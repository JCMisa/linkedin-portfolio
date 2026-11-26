"use client";

import React, { useState, useEffect, useRef } from "react";
// Lucide icons used for the UI buttons and status indicators
import {
  Mic,
  MicOff,
  PhoneOff,
  Settings,
  Activity,
  Phone,
  Loader2,
} from "lucide-react";
// Utility to merge Tailwind classes conditionally
import { cn } from "@/lib/utils";
// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// Vapi SDK instance and the function to generate dynamic assistant configurations
import { vapi } from "@/features/contact/lib/vapi-client";
import { configureAssistant } from "@/features/contact/lib/vapi-assistant";
// Axios for API calls and Sonner for popup notifications
import { fetchJson, HttpError } from "@/lib/fetch-json";
import { toast } from "sonner";

// Import custom components and actions for handling the "Review" phase
import InquiryReview, { InquiryData } from "./InquiryReview";
import { updateInquiry } from "@/features/contact/actions";
import { useRouter } from "next/navigation";
import { getActionError } from "@/lib/action-result";

/** Seconds -> "mm:ss" for the call timer. */
const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

/** The subset of Vapi client messages this component handles. */
type VapiMessage = {
  type: string;
  transcriptType?: "partial" | "final";
  role?: string;
  transcript?: string;
};

// Define what information the parent component must provide
interface VoiceAgentProps {
  userName: string;
  credits: number;
}

// Enumeration of all possible visual states of this component
type AgentState =
  | "idle" // Initial state: Show "Start Conversation"
  | "connecting" // Handshaking with Vapi servers
  | "active" // Call is live
  | "listening" // AI is waiting for user to finish speaking
  | "speaking" // AI is currently generating/playing audio
  | "processing" // Call ended: Sending transcript to Gemini for extraction
  | "review"; // AI finished: Showing the user a form to edit extracted info

// Structure for the chat history passed to the Gemini API
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const VoiceAgent = ({ userName, credits }: VoiceAgentProps) => {
  const router = useRouter();

  // --- REFS (Mutable variables that don't trigger re-renders) ---

  // Stores the latest userName to prevent "stale closures" in event listeners
  const userNameRef = useRef(userName);

  // Accumulates every "final" sentence spoken by user or AI for the final report
  const messagesRef = useRef<Message[]>([]);

  // CRITICAL: Prevents handleProcessCall from running twice if Vapi sends
  // multiple "call-end" signals simultaneously
  const isProcessingRef = useRef(false);

  // --- STATE (Variables that update the UI when changed) ---
  const [status, setStatus] = useState<AgentState>("idle");
  const [isMicOn, setIsMicOn] = useState(true);
  const [transcript, setTranscript] = useState("Ready to connect.");
  const [volumeLevel, setVolumeLevel] = useState(0); // 0.0 to 1.0, drives the orb animation

  // Time tracking for the 3-minute limit
  const [secondsActive, setSecondsActive] = useState(0);
  const MAX_DURATION = 180; // 180 seconds = 3 minutes

  // Stores the JSON data returned by Gemini (Name, Email, etc.)
  const [extractedData, setExtractedData] = useState<InquiryData | null>(null);

  // Sync the Ref with the Prop whenever the parent updates the userName
  useEffect(() => {
    userNameRef.current = userName;
  }, [userName]);

  // --- TIMER EFFECT ---
  // Starts an interval when the call is live; stops it when idle/finished
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      status === "active" ||
      status === "listening" ||
      status === "speaking"
    ) {
      interval = setInterval(() => setSecondsActive((prev) => prev + 1), 1000);
    }
    // Cleanup function: clears the interval when the component updates or unmounts
    return () => clearInterval(interval);
  }, [status]);

  // Auto-end the call at the credit-saving limit (side effects stay out of
  // the state updater above)
  const isLive =
    status === "active" || status === "listening" || status === "speaking";
  useEffect(() => {
    if (isLive && secondsActive >= MAX_DURATION) {
      vapi.stop();
      toast.warning("Call ended due to time limit.");
    }
  }, [isLive, secondsActive]);

  // Latest handleProcessCall for the Vapi listeners registered once below
  const processCallRef = useRef<() => void>(() => {});

  // --- VAPI EVENT LISTENERS ---
  // This effect runs ONCE when the component mounts to set up the voice engine
  useEffect(() => {
    // Fired when the voice connection is successful
    const onCallStart = () => {
      setStatus("active");
      setTranscript(`Hello ${userNameRef.current}! How can I help?`);
      messagesRef.current = []; // Clear history for the new session
      setSecondsActive(0); // Reset timer
      isProcessingRef.current = false; // Unlock the processing gate
    };

    // Fired when call is hung up or disconnected
    const onCallEnd = () => {
      console.log("Call ended event received");
      processCallRef.current(); // Move to Gemini extraction phase
    };

    // Visual state updates based on who is talking
    const onSpeechStart = () => setStatus("listening");
    const onSpeechEnd = () => setStatus("speaking");

    // Fired whenever words are transcribed
    const onMessage = (message: VapiMessage) => {
      if (message.type === "transcript") {
        // Update the live text on screen (includes partial sentences)
        setTranscript(message.transcript ?? "");

        // Only save "final" (complete) sentences to the history ref
        if (message.transcriptType === "final") {
          const roleType = message.role === "user" ? "user" : "assistant";

          const newMessage: Message = {
            role: roleType,
            content: message.transcript ?? "",
          };

          messagesRef.current.push(newMessage);
          // If the user spoke, we expect the AI to respond next
          if (message.role === "user") setStatus("speaking");
        }
      }
    };

    // Captures raw audio volume for the pulsing orb effect
    const onVolumeLevel = (volume: number) => setVolumeLevel(volume);

    const onError = (error: unknown) => {
      console.error("Vapi Error:", error);
      setStatus("idle");
    };

    // Register listeners with the Vapi SDK
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("message", onMessage);
    vapi.on("volume-level", onVolumeLevel);
    vapi.on("error", onError);

    // Cleanup: remove listeners when the user leaves the page
    return () => {
      vapi.stop();
      vapi.removeAllListeners();
    };
  }, []);

  // --- UI ACTIONS ---

  // Initiates the Vapi connection
  const startCall = async () => {
    if (credits <= 0) {
      toast.error("You have reached the limit for voice calls.");
      return;
    }

    isProcessingRef.current = false; // Reset lock
    setStatus("connecting");
    setTranscript("Connecting to JCM...");
    try {
      // Get the prompt and voice settings from config file
      const assistantConfig = configureAssistant(userName);
      await vapi.start(assistantConfig);
    } catch (e) {
      console.error("Failed to start call", e);
      setStatus("idle");
    }
  };

  // User manually clicks "End Call"
  const endCall = () => {
    vapi.stop();
  };

  // The bridge between Voice Interaction and Database Storage
  const handleProcessCall = async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    setStatus("processing");

    if (messagesRef.current.length === 0) {
      setStatus("idle");
      return;
    }

    try {
      // The server identifies the user from the session
      const data = await fetchJson<InquiryData>("/api/process-inquiry", {
        json: { messages: messagesRef.current },
      });

      setExtractedData(data);
      setStatus("review");
      toast.success("Inquiry processed successfully!");
    } catch (error: unknown) {
      console.error(error);
      // Handle the specific 403 Insufficient Credits error
      if (error instanceof HttpError && error.status === 403) {
        toast.error("You have no contact credits remaining.");
      } else {
        toast.error("An error occurred processing the call.");
      }
      setStatus("idle");
    }
  };

  // Called when user clicks "Confirm & Send" in the Review form
  const handleUpdateAndSave = async (updatedData: InquiryData) => {
    try {
      // Calls a Server Action to save/update the record in NeonDB using Drizzle
      const result = await updateInquiry({
        id: updatedData.id ?? "",
        visitorName: updatedData.visitorName,
        email: updatedData.email,
        phoneNumber: updatedData.phoneNumber,
        purpose: updatedData.purpose,
        summary: updatedData.summary,
      });
      const error = getActionError(result);

      if (!error) {
        toast.success("Details updated and sent to John!");
        setStatus("idle");
        // Redirect back to the main contact page after success
        setTimeout(() => router.push("/contact"), 1000);
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.error("Failed to update", error);
      toast.error("Something went wrong saving your edits.");
    }
  };

  const toggleMic = () => {
    const newState = !isMicOn;
    setIsMicOn(newState);
    vapi.setMuted(!newState); // Tells Vapi to stop listening to the user's mic
  };

  useEffect(() => {
    processCallRef.current = handleProcessCall;
  });

  // Calculates the CSS scale (size) of the center orb
  // High volume = bigger orb. No volume = steady pulse.
  const getOrbScale = () => {
    if (status === "idle" || status === "review" || status === "processing")
      return 1;
    if (status === "listening") return 1 + volumeLevel * 1.5;
    if (status === "speaking") return 1.1 + volumeLevel * 0.5;
    return 1;
  };

  // --- CONDITIONAL RENDER 1: THE REVIEW FORM ---
  // If we have AI-extracted data, replace the video-call UI with the Form
  if (status === "review" && extractedData) {
    return (
      <InquiryReview
        data={extractedData}
        onCancel={() => setStatus("idle")}
        onSave={handleUpdateAndSave}
      />
    );
  }

  // --- CONDITIONAL RENDER 2: THE MAIN AGENT UI ---
  return (
    <Card className="relative flex h-[80vh] max-h-[800px] min-h-[500px] w-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl transition-all duration-300">
      {/* --- HEADER: Badges and Timer --- */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-20 flex items-start justify-between p-4 md:p-6">
        <div className="pointer-events-auto mt-1 flex items-center gap-3 rounded-full border border-border/50 bg-background/80 px-4 py-2 shadow-sm backdrop-blur-md dark:bg-black/50">
          {/* Show a spinner if we are talking to Gemini */}
          {status === "processing" ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            // Animated dot: Green if call is active, Red if disconnected
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-colors duration-300",
                status === "active" ||
                  status === "listening" ||
                  status === "speaking"
                  ? "animate-pulse bg-emerald-500"
                  : "bg-destructive",
              )}
            />
          )}
          <span className="text-xs font-semibold tracking-wide text-foreground uppercase md:text-sm">
            {status === "processing"
              ? "Analyzing..."
              : status === "idle"
                ? "Disconnected"
                : "Live Agent"}
          </span>
        </div>

        {/* The Digital Timer Display */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div
            className={cn(
              "hidden items-center justify-center rounded-full border border-border/50 px-3 py-1.5 font-mono text-xs font-medium backdrop-blur-md transition-colors md:flex",
              // Turn timer red when user has less than 30 seconds left
              status !== "idle" && MAX_DURATION - secondsActive < 30
                ? "animate-pulse border-red-500/30 bg-red-500/20 text-red-500"
                : "bg-background/80 text-muted-foreground dark:bg-black/50",
            )}
          >
            {status === "idle"
              ? "03:00 Max"
              : `${formatTime(secondsActive)} / ${formatTime(MAX_DURATION)}`}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* --- MAIN STAGE: The visual "Orb" and Text --- */}
      <div className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden bg-zinc-950 dark:bg-black">
        {/* Subtle grid background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#4b5563 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Analyzing Overlay: Blurs out the orb while AI extract data */}
        {status === "processing" && (
          <div className="animate-fadeIn absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 p-4 text-center">
            <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
            <h3 className="text-xl font-bold text-white">
              Analyzing Conversation
            </h3>
            <p className="mt-2 max-w-sm text-zinc-400">
              JCM is organizing your details...
            </p>
          </div>
        )}

        {/* UI before the call starts */}
        {status === "idle" ? (
          <div className="animate-fadeIn z-30 flex flex-col items-center gap-6">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
              <Phone className="h-12 w-12 text-primary" />
            </div>
            <Button
              onClick={startCall}
              size="lg"
              className="h-14 rounded-full px-8 text-lg shadow-lg transition-all hover:scale-105"
            >
              Start Conversation
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Max duration: 3 minutes
            </p>
          </div>
        ) : (
          /* UI while call is active */
          <div className="relative z-10 flex w-full max-w-2xl flex-col items-center justify-center px-4">
            <div className="group relative mb-8 md:mb-12">
              {/* Outer soft glow that matches the orb's color */}
              <div
                className={cn(
                  "absolute -inset-8 rounded-full blur-3xl transition-all duration-200 md:-inset-12",
                  status === "speaking"
                    ? "bg-primary/40 opacity-80"
                    : "bg-emerald-500/20 opacity-40",
                )}
                style={{ transform: `scale(${1 + volumeLevel})` }}
              />
              {/* The Inner Orb: Scales up based on getOrbScale() logic */}
              <div
                className={cn(
                  "relative flex h-32 w-32 items-center justify-center rounded-full border-2 transition-all duration-300 md:h-48 md:w-48",
                  status === "speaking"
                    ? "border-primary/50 bg-primary/10"
                    : "border-emerald-500/30 bg-emerald-500/5",
                )}
                style={{ transform: `scale(${getOrbScale()})` }}
              >
                <Activity className="h-16 w-16 animate-spin text-primary" />
              </div>
            </div>
            {/* The real-time transcript subtitles */}
            <div className="mx-auto min-h-[100px] w-full max-w-xl space-y-3 text-center">
              <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase md:text-sm">
                {status === "listening"
                  ? "Listening..."
                  : status === "speaking"
                    ? "Speaking..."
                    : "Connecting..."}
              </p>
              <p
                className={cn(
                  "text-lg leading-relaxed font-medium transition-all duration-300 md:text-2xl",
                  status === "listening"
                    ? "text-zinc-400 italic"
                    : "text-zinc-100",
                )}
              >
                &ldquo;{transcript}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* --- FOOTER: Call controls --- */}
      {status !== "processing" && (
        <div className="relative z-20 flex flex-col items-center justify-between gap-4 border-t border-border bg-card p-4 md:flex-row md:p-6">
          {/* Identity info */}
          <div className="hidden items-center gap-3 text-left md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-bold text-primary">
              {userName?.charAt(0) || "J"}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {userName}
              </p>
              <p className="text-xs text-muted-foreground">Guest User</p>
            </div>
          </div>

          {/* Main call action buttons */}
          <div className="flex w-full items-center justify-center gap-4 md:w-auto">
            {/* Microphone Toggle Button */}
            {(status === "active" ||
              status === "listening" ||
              status === "speaking") && (
              <Button
                variant="secondary"
                size="icon"
                onClick={toggleMic}
                className={cn(
                  "h-12 w-12 rounded-full border border-border shadow-sm transition-all md:h-14 md:w-14",
                  !isMicOn &&
                    "border-destructive/20 bg-destructive/10 text-destructive",
                )}
              >
                {isMicOn ? (
                  <Mic className="h-6 w-6" />
                ) : (
                  <MicOff className="h-6 w-6" />
                )}
              </Button>
            )}
            {/* Big Red Hang-up Button */}
            {status !== "idle" && (
              <Button
                onClick={endCall}
                className="h-12 rounded-full bg-destructive px-8 text-white hover:scale-105 md:h-14"
              >
                <PhoneOff className="mr-2 h-6 w-6" /> End Call
              </Button>
            )}
          </div>
          <div className="hidden w-[180px] md:block"></div>
        </div>
      )}
    </Card>
  );
};

export default VoiceAgent;
