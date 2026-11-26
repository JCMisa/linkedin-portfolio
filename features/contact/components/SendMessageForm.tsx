"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { contactMessageSchema, type ContactMessageInput } from "../schemas";
import { toast } from "sonner";
import { PersonalInfoType } from "@/db/schema";
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isSending },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const handleSend = handleSubmit(({ name, email, message }) => {
    try {
      const subject = `Portfolio Inquiry: Message from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${
        personalInfo.email
      }&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.open(gmailUrl, "_blank");
      toast.success("Draft prepared in Gmail!");

      reset();
    } catch (error) {
      console.error("Error preparing message:", error);
      toast.error("Failed to prepare message. Please try again.");
    }
  });

  return (
    <div className="space-y-6 rounded-xl border border-neutral-200 bg-neutral-100 p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-dark">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
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
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <UserIcon className="size-3.5 text-neutral-500" />
            Full Name
          </Label>
          <Input
            type="text"
            id="name"
            placeholder="John Doe"
            {...register("name")}
            aria-invalid={!!errors.name}
            className="border-neutral-200 bg-neutral-50 focus-visible:ring-primary dark:border-neutral-800 dark:bg-neutral-900/50"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <MailIcon className="size-3.5 text-neutral-500" />
            Email Address
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="your@email.com"
            {...register("email")}
            aria-invalid={!!errors.email}
            className="border-neutral-200 bg-neutral-50 focus-visible:ring-primary dark:border-neutral-800 dark:bg-neutral-900/50"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="message"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <MessageSquareIcon className="size-3.5 text-neutral-500" />
            Your Message
          </Label>
          <Textarea
            id="message"
            placeholder="What project or collaboration do you have in mind?"
            {...register("message")}
            aria-invalid={!!errors.message}
            className="min-h-[150px] resize-none border-neutral-200 bg-neutral-50 focus-visible:ring-primary dark:border-neutral-800 dark:bg-neutral-900/50"
          />
          {errors.message && (
            <p className="text-xs text-destructive">{errors.message.message}</p>
          )}
        </div>
      </div>

      <Button
        onClick={handleSend}
        disabled={isSending}
        className="h-11 w-full cursor-pointer bg-primary font-bold text-white transition-all hover:bg-primary-600 active:scale-[0.98]"
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

      <div className="flex items-start gap-2 rounded-lg border border-primary/10 bg-primary/5 p-3 dark:bg-primary/10">
        <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary" />
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
