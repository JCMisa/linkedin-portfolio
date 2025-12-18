"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PersonalInfoType } from "@/config/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  SendIcon,
  MailIcon,
  UserIcon,
  MessageSquareIcon,
  InfoIcon,
} from "lucide-react";

interface SendMessageFormProps {
  personalInfo: PersonalInfoType;
}

const SendMessageForm = ({ personalInfo }: SendMessageFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSending(true);

    try {
      const subject = `Portfolio Inquiry: Message from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${
        personalInfo.email
      }&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.open(gmailUrl, "_blank");
      toast.success("Draft prepared in Gmail!");

      // Clear form after slight delay
      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setIsSending(false);
      }, 500);
    } catch (error) {
      console.error("Error preparing message:", error);
      toast.error("Failed to prepare message. Please try again.");
      setIsSending(false);
    }
  };

  return (
    <div className="bg-neutral-100 dark:bg-dark p-6 sm:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <MessageSquareIcon className="size-5 text-primary" />
          Send Message
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          I typically respond within 24 hours. Let&apos;s build something
          amazing!
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="name"
            className="text-sm font-semibold flex items-center gap-2"
          >
            <UserIcon className="size-3.5 text-neutral-500" />
            Full Name
          </Label>
          <Input
            type="text"
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-sm font-semibold flex items-center gap-2"
          >
            <MailIcon className="size-3.5 text-neutral-500" />
            Email Address
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="message"
            className="text-sm font-semibold flex items-center gap-2"
          >
            <MessageSquareIcon className="size-3.5 text-neutral-500" />
            Your Message
          </Label>
          <Textarea
            id="message"
            placeholder="What project or collaboration do you have in mind?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[150px] bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary resize-none"
          />
        </div>
      </div>

      <Button
        onClick={handleSend}
        disabled={isSending}
        className="w-full bg-primary hover:bg-primary-600 text-white font-bold h-11 cursor-pointer transition-all active:scale-[0.98]"
      >
        {isSending ? (
          "Preparing..."
        ) : (
          <span className="flex items-center gap-2">
            <SendIcon className="size-4" />
            Send Inquiry
          </span>
        )}
      </Button>

      <div className="flex items-start gap-2 p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10">
        <InfoIcon className="size-4 text-primary shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          Clicking send will open your default email client with a pre-filled
          draft. You can then review and send it directly to{" "}
          <span className="font-bold text-primary">{personalInfo.email}</span>.
        </p>
      </div>
    </div>
  );
};

export default SendMessageForm;
