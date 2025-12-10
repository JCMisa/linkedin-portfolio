"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SendIcon, XCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      const { data } = await axios.post<{ response: string }>(
        "/api/chat",
        { message: trimmed },
        { timeout: 30000 }
      );

      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: data.response,
      };
      setMessages((m) => [...m, botMsg]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      /* ---------- unified error handling ---------- */
      const axiosErr = err as AxiosError<ChatErrorBody>;
      let msg = "Something went wrong. Please try again.";

      if (axiosErr.response?.status === 429) {
        const retry = axiosErr.response?.data?.retryAfterSeconds ?? 60;
        setRateLimit({ blocked: true, retryAfter: retry });
        msg = `Too many questions. Please wait ${retry}s before asking again.`;
      } else if (axiosErr.response?.status === 401) {
        msg = "You must be signed in to chat.";
      } else if (axiosErr.response?.data?.response) {
        msg = axiosErr.response.data.response; // server bot message
      } else if (axiosErr.response?.data?.error) {
        msg = axiosErr.response.data.error;
      } else if (axiosErr.code === "ECONNABORTED") {
        msg = "Request timed out. Please try again.";
      } else if (axiosErr.message) {
        msg = axiosErr.message;
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
      <AvatarImage src="/profile-img.png" />
      <AvatarFallback className="text-[10px] bg-blue-500 text-white">
        B
      </AvatarFallback>
    </Avatar>
  );

  /* ---------- shared trigger ---------- */
  const Trigger = !user ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-[40px] h-[40px] rounded-full bg-neutral-100 dark:bg-neutral-900 shadow-xl flex items-center justify-center flex-none">
          <XCircleIcon className="size-5 text-red-600" />
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        className="bg-neutral-100 dark:bg-neutral-900"
      >
        <p>Sign in to unlock JCM AI</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <Image
      src="/machine.webp"
      alt="Pixel art pumpkin computer with bat wings"
      width={50}
      height={50}
      className="image-pixelated cursor-pointer"
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );

  /* ---------- chat body ---------- */
  const ChatBody = (
    <>
      {/* header */}
      <div className="px-4 py-3 border-b shrink-0 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">JCM AI</h3>
          <p className="text-xs text-muted-foreground">
            Ask me anything about John Carlo
          </p>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center mt-10">
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
              className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                msg.sender === "user"
                  ? "bg-blue-400 text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && <UserAvatar />}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 justify-start">
            <BotAvatar />
            <div className="bg-muted px-3 py-2 rounded-2xl text-sm">
              <span className="inline-flex space-x-1">
                <span className="w-2 h-2 bg-current rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay=0.2s]" />
                <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay=0.4s]" />
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
        className="flex items-center gap-2 border-t px-4 py-3 shrink-0"
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
          className="rounded-lg placeholder:text-xs focus:!outline-none focus:!ring-0 focus:!border-transparent"
        />
        <Button
          type="submit"
          size="icon"
          disabled={loading || rateLimit.blocked}
          className="rounded-full shrink-0 bg-blue-400 hover:bg-primary"
        >
          <SendIcon className="h-4 w-4 text-white" />
        </Button>
      </form>
    </>
  );

  return (
    <>
      {!isMobile && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{Trigger}</PopoverTrigger>
          <PopoverContent
            align="end"
            side="left"
            sideOffset={8}
            className="w-[380px] h-[600px] flex flex-col p-0 rounded-2xl shadow-2xl"
          >
            {ChatBody}
          </PopoverContent>
        </Popover>
      )}

      {isMobile && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>{Trigger}</DialogTrigger>
          <DialogContent className="h-screen w-screen max-w-none max-h-none p-0 gap-0 rounded-none">
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
