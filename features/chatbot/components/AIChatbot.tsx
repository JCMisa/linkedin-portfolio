"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchJson, HttpError, isTimeoutError } from "@/lib/fetch-json";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dynamic from "next/dynamic";

// Markdown renderer is only needed once the bot replies
const BotMarkdown = dynamic(() => import("./BotMarkdown"), {
  loading: () => <span className="text-muted-foreground">…</span>,
});

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

/* ---------- simple mobile detector ---------- */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);
  return isMobile;
}

const AIChatbot = () => {
  const { user } = useUser();
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [rateLimit, setRateLimit] = useState<{
    blocked: boolean;
    retryAfter: number;
  }>({ blocked: false, retryAfter: 0 });

  const scrollRef = useRef<HTMLDivElement>(null);

  /* auto-scroll to bottom when new message arrives */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- rate-limit countdown ---------- */
  useEffect(() => {
    if (!rateLimit.blocked) return;
    const t = setInterval(() => {
      setRateLimit((v) => {
        if (v.retryAfter <= 1) return { blocked: false, retryAfter: 0 };
        return { ...v, retryAfter: v.retryAfter - 1 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [rateLimit.blocked]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || rateLimit.blocked) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: trimmed,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await fetchJson<{ response: string }, ChatErrorBody>(
        "/api/chat",
        { json: { message: trimmed }, timeoutMs: 30000 },
      );

      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: data.response,
      };
      setMessages((m) => [...m, botMsg]);
    } catch (err: unknown) {
      /* ---------- unified error handling ---------- */
      let msg = "Something went wrong. Please try again.";

      if (err instanceof HttpError) {
        const body = err.body as ChatErrorBody | null;
        if (err.status === 429) {
          const retry = body?.retryAfterSeconds ?? 60;
          setRateLimit({ blocked: true, retryAfter: retry });
          msg = `Too many questions. Please wait ${retry}s before asking again.`;
        } else if (err.status === 401) {
          msg = "You must be signed in to chat.";
        } else if (body?.response) {
          msg = body.response; // server bot message
        } else if (body?.error) {
          msg = body.error;
        }
      } else if (isTimeoutError(err)) {
        msg = "Request timed out. Please try again.";
      } else if (err instanceof Error && err.message) {
        msg = err.message;
      }

      toast.error(msg);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: msg,
      };
      setMessages((m) => [...m, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- avatars ---------- */
  const UserAvatar = () => (
    <Avatar className="h-6 w-6">
      <AvatarImage src={user?.imageUrl} />
      <AvatarFallback className="text-[10px]">U</AvatarFallback>
    </Avatar>
  );
  const BotAvatar = () => (
    <Avatar className="h-6 w-6">
      <AvatarImage src="/logo.png" />
      <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
        B
      </AvatarFallback>
    </Avatar>
  );

  /* ---------- shared trigger ---------- */
  const Trigger = !user ? (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* Signed out: the robot links to sign-in instead of doing nothing */}
        <Link
          href="/sign-in"
          aria-label="Sign in to chat with JCM AI"
          className="block rounded-md"
        >
          <Image
            src="/machine.webp"
            alt=""
            width={50}
            height={50}
            className="image-pixelated opacity-50 grayscale"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left" className="bg-card">
        <p>Sign in to unlock JCM AI</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <button
      type="button"
      aria-label="Chat with JCM AI"
      className="block cursor-pointer rounded-md"
    >
      <Image
        src="/machine.webp"
        alt=""
        width={50}
        height={50}
        className="image-pixelated"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </button>
  );

  /* ---------- chat body ---------- */
  const ChatBody = (
    <>
      {/* header */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">JCM AI</h3>
          <p className="text-xs text-muted-foreground">
            Ask me anything about John Carlo
          </p>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Hi! How can I help you today?
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && <BotAvatar />}
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.sender === "bot" ? (
                <BotMarkdown text={msg.text} />
              ) : (
                msg.text
              )}
            </div>
            {msg.sender === "user" && <UserAvatar />}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start gap-2">
            <BotAvatar />
            <div className="rounded-2xl bg-muted px-3 py-2 text-sm">
              <span className="inline-flex space-x-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
                <span className="[animation-delay=0.2s] h-2 w-2 animate-bounce rounded-full bg-current" />
                <span className="[animation-delay=0.4s] h-2 w-2 animate-bounce rounded-full bg-current" />
              </span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* input - locked when rate-limited */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex shrink-0 items-center gap-2 border-t px-4 py-3"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            rateLimit.blocked
              ? `Retry in ${rateLimit.retryAfter}s`
              : "What do you want to know?"
          }
          disabled={loading || rateLimit.blocked}
          className="rounded-lg placeholder:text-xs focus:!border-transparent focus:!ring-0 focus:!outline-none"
        />
        <Button
          type="submit"
          size="icon"
          disabled={loading || rateLimit.blocked}
          aria-label="Send message"
          className="shrink-0 rounded-full"
        >
          <SendIcon className="h-4 w-4 text-primary-foreground" />
        </Button>
      </form>
    </>
  );

  return (
    <>
      {/* No user — show disabled trigger only, no popover/dialog */}
      {!user && Trigger}

      {/* Desktop */}
      {user && !isMobile && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{Trigger}</PopoverTrigger>
          <PopoverContent
            align="end"
            side="left"
            sideOffset={8}
            className="flex h-[600px] w-[380px] flex-col rounded-2xl p-0 shadow-2xl"
          >
            {ChatBody}
          </PopoverContent>
        </Popover>
      )}

      {/* Mobile */}
      {user && isMobile && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>{Trigger}</DialogTrigger>
          <DialogContent className="h-screen max-h-none w-screen max-w-none gap-0 rounded-none p-0">
            <DialogHeader className="hidden">
              <DialogTitle>Chat</DialogTitle>
              <DialogDescription>Chat modal</DialogDescription>
            </DialogHeader>
            {ChatBody}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AIChatbot;
