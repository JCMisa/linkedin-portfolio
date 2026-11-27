// Minimal Chrome DevTools Protocol driver (Node 24 global WebSocket; no deps).
// Usage:
//   node cdp.mjs shot     <url> <width> <light|dark> <outPng> [fullPage=1]
//   node cdp.mjs overflow <url> <width> <light|dark>
// Requires Chrome started with --remote-debugging-port=$CDP_PORT (default 9333).
// Env: ACCENT=<id> seeds the saved theme color (see lib/accent.ts).
import fs from "fs";

const [cmd, url, width, scheme, out, full = "1"] = process.argv.slice(2);
const W = Number(width);
const PORT = process.env.CDP_PORT || "9333";

const targets = await (
  await fetch(`http://127.0.0.1:${PORT}/json/list`)
).json();
let page = targets.find((t) => t.type === "page");
if (!page)
  page = await (
    await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, {
      method: "PUT",
    })
  ).json();

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
const events = [];
ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method) events.push(msg.method);
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const i = ++id;
    pending.set(i, (m) =>
      m.error
        ? reject(new Error(method + ": " + m.error.message))
        : resolve(m.result),
    );
    ws.send(JSON.stringify({ id: i, method, params }));
  });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const evaluate = async (expr) =>
  (
    await send("Runtime.evaluate", {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    })
  ).result.value;

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: W,
  height: 900,
  deviceScaleFactor: 1,
  mobile: W < 768,
});
await send("Emulation.setEmulatedMedia", {
  features: [
    {
      name: "prefers-color-scheme",
      value: scheme === "dark" ? "dark" : "light",
    },
  ],
});
// next-themes stores the choice; clear it so "system" follows the emulated scheme
await send("Page.navigate", { url: new URL(url).origin + "/favicon.ico" });
await sleep(400);
await evaluate("try{localStorage.removeItem('theme')}catch(e){}");
// ACCENT=green etc. seeds the saved theme color like a returning visitor
await evaluate(
  process.env.ACCENT
    ? `localStorage.setItem('accent', ${JSON.stringify(process.env.ACCENT)})`
    : "try{localStorage.removeItem('accent')}catch(e){}",
);
await send("Page.navigate", { url });
for (let i = 0; i < 60 && !events.includes("Page.loadEventFired"); i++)
  await sleep(250);
await sleep(2500); // let client components / images settle

if (cmd === "overflow") {
  const res = await evaluate(`(() => {
    const vw = document.documentElement.clientWidth;
    const docW = document.documentElement.scrollWidth;
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > vw + 1) {
        // report only the outermost overflowing element
        let p = el.parentElement, parentOverflows = false;
        while (p && p !== document.body) {
          const pr = p.getBoundingClientRect();
          if (pr.right > vw + 1) { parentOverflows = true; break; }
          p = p.parentElement;
        }
        if (!parentOverflows) offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.getAttribute("class") || "").slice(0, 140),
          right: Math.round(r.right), width: Math.round(r.width),
          text: (el.innerText || "").replace(/\\s+/g, " ").slice(0, 50),
        });
      }
    }
    return { viewport: vw, documentWidth: docW, offenders: offenders.slice(0, 15) };
  })()`);
  console.log(JSON.stringify(res, null, 2));
} else {
  let clip;
  if (full === "1") {
    const h = await evaluate(
      "Math.min(document.documentElement.scrollHeight, 5000)",
    );
    await send("Emulation.setDeviceMetricsOverride", {
      width: W,
      height: h,
      deviceScaleFactor: 1,
      mobile: W < 768,
    });
    await sleep(800);
  }
  const { data } = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
    clip,
  });
  fs.writeFileSync(out, Buffer.from(data, "base64"));
  console.log("saved", out);
}
ws.close();
process.exit(0);
