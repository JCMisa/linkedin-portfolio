// Usage: node first-load-js.mjs <projectRoot> <baseUrl> <route...>
// Sums the size of every /_next/static JS file a page's HTML references
// (= JavaScript downloaded on first load of that route).
import fs from "fs";
import path from "path";
import zlib from "zlib";

const [root, base, ...routes] = process.argv.slice(2);
for (const route of routes) {
  const html = await (await fetch(base + route)).text();
  const srcs = [
    ...new Set(
      [...html.matchAll(/\/_next\/(static\/[^"'\s)]+?\.js)/g)].map((m) => m[1]),
    ),
  ];
  let raw = 0,
    gz = 0;
  for (const s of srcs) {
    const file = path.join(root, ".next", decodeURIComponent(s));
    if (!fs.existsSync(file)) continue;
    const buf = fs.readFileSync(file);
    raw += buf.length;
    gz += zlib.gzipSync(buf).length;
  }
  console.log(
    `${route.padEnd(14)} ${String(srcs.length).padStart(3)} files  ${(raw / 1024).toFixed(0).padStart(5)} KB raw  ${(gz / 1024).toFixed(0).padStart(4)} KB gzip`,
  );
}
