"use client";

import React, { useState, useEffect, useRef } from "react";
// Lucide icons used for the UI buttons and status indicators
import {
  Mic,
  MicOff,
  PhoneOff,
  Video,
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
import { vapi } from "@/lib/vapi.sdk";
import { configureAssistant } from "@/lib/vapi.config";
// Axios for API calls and Sonner for popup notifications
import axios from "axios";
import { toast } from "sonner";

// Import custom components and actions for handling the "Review" phase
import InquiryReview, { InquiryData } from "./InquiryReview";
import { updateInquiry } from "@/lib/actions/contactInquiries";
import { useRouter } from "next/navigation";

// Define what information the parent component must provide
interface AgentProps {
  userName: string;
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

const Agent = ({ userName }: AgentProps) => {
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
      interval = setInterval(() => {
        setSecondsActive((prev) => {
          // Auto-kill the call if it exceeds the credit-saving limit
          if (prev >= MAX_DURATION) {
            endCall();
            toast.warning("Call ended due to time limit.");
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    // Cleanup function: clears the interval when the component updates or unmounts
    return () => clearInterval(interval);
  }, [status]);

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
      handleProcessCall(); // Move to Gemini extraction phase
    };

    // Visual state updates based on who is talking
    const onSpeechStart = () => setStatus("listening");
    const onSpeechEnd = () => setStatus("speaking");

    // Fired whenever words are transcribed
    const onMessage = (message: any) => {
      if (message.type === "transcript") {
        // Update the live text on screen (includes partial sentences)
        setTranscript(message.transcript);

        // Only save "final" (complete) sentences to the history ref
        if (message.transcriptType === "final") {
          const roleType = message.role === "user" ? "user" : "assistant";

          const newMessage: Message = {
            role: roleType,
            content: message.transcript,
          };

          messagesRef.current.push(newMessage);
          // If the user spoke, we expect the AI to respond next
          if (message.role === "user") setStatus("speaking");
        }
      }
    };

    // Captures raw audio volume for the pulsing orb effect
    const onVolumeLevel = (volume: number) => setVolumeLevel(volume);

    const onError = (error: any) => {
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
    // 1. Guard: If we are already talking to the API, don't start again
    if (isProcessingRef.current) {
      console.log("Already processing, skipping duplicate call-end event.");
      return;
    }

    // 2. Set the Lock
    isProcessingRef.current = true;
    setStatus("processing");

    // 3. Guard: If no words were spoken, don't waste API credits
    if (messagesRef.current.length === 0) {
      setStatus("idle");
      return;
    }

    try {
      // 4. Send the conversation history to our Next.js API route
      // This route calls Gemini to turn the text into a JSON object (Name, Email, etc.)
      const response = await axios.post("/api/process-inquiry", {
        messages: messagesRef.current,
        userName: userNameRef.current,
      });

      if (response.status === 200) {
        setExtractedData(response.data); // Save the JSON
        setStatus("review"); // Show the edit form
      } else {
        toast.error("Failed to process conversation.");
        setStatus("idle");
      }
    } catch (error) {
      console.error(error);
      setStatus("idle");
    }
  };

  // Called when user clicks "Confirm & Send" in the Review form
  const handleUpdateAndSave = async (updatedData: InquiryData) => {
    try {
      // Calls a Server Action to save/update the record in NeonDB using Drizzle
      const result = await updateInquiry(updatedData);

      if (result) {
        if (result.data && result.success) {
          toast.success("Details updated and sent to John!");
          setStatus("idle");
          // Redirect back to the main contact page after success
          setTimeout(() => router.push("/contact"), 1000);
        } else {
          toast.error("Could not update details.");
        }
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

  // Utility to turn seconds (e.g. 75) into readable string (e.g. "01:15")
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculates the CSS scale (size) of the center orb
  // High volume = bigger orb. No volume = steady pulse.
  const getOrbScale = () => {
    if (status === "idle" || status === "review" || status === "processing")
      return 1;
    if (status === "listening") return 1 + volumeLevel * 1.5;
    if (status === "speaking") return 1.1 + Math.sin(Date.now() / 300) * 0.05;
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
    <Card className="relative w-full overflow-hidden shadow-2xl rounded-3xl border border-border bg-card flex flex-col transition-all duration-300 h-[80vh] min-h-[500px] max-h-[800px]">
      {/* --- HEADER: Badges and Timer --- */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start z-20 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto bg-background/80 dark:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm mt-1">
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
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-destructive"
              )}
            />
          )}
          <span className="text-xs md:text-sm font-semibold tracking-wide text-foreground uppercase">
            {status === "processing"
              ? "Analyzing..."
              : status === "idle"
              ? "Disconnected"
              : "Live Agent"}
          </span>
        </div>

        {/* The Digital Timer Display */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div
            className={cn(
              "hidden md:flex items-center justify-center px-3 py-1.5 rounded-full backdrop-blur-md border border-border/50 text-xs font-mono font-medium transition-colors",
              // Turn timer red when user has less than 30 seconds left
              status !== "idle" && MAX_DURATION - secondsActive < 30
                ? "bg-red-500/20 text-red-500 border-red-500/30 animate-pulse"
                : "bg-background/80 dark:bg-black/50 text-muted-foreground"
            )}
          >
            {status === "idle"
              ? "03:00 Max"
              : `${formatTime(secondsActive)} / ${formatTime(MAX_DURATION)}`}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* --- MAIN STAGE: The visual "Orb" and Text --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 dark:bg-black w-full overflow-hidden">
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
          <div className="z-40 absolute inset-0 bg-black/80 flex flex-col items-center justify-center animate-fadeIn text-center p-4">
            <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-bold text-white">
              Analyzing Conversation
            </h3>
            <p className="text-zinc-400 max-w-sm mt-2">
              JCM is organizing your details...
            </p>
          </div>
        )}

        {/* UI before the call starts */}
        {status === "idle" ? (
          <div className="z-30 flex flex-col items-center gap-6 animate-fadeIn">
            <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
              <Phone className="h-12 w-12 text-primary" />
            </div>
            <Button
              onClick={startCall}
              size="lg"
              className="rounded-full px-8 h-14 text-lg shadow-lg hover:scale-105 transition-all"
            >
              Start Conversation
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Max duration: 3 minutes
            </p>
          </div>
        ) : (
          /* UI while call is active */
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-4">
            <div className="relative group mb-8 md:mb-12">
              {/* Outer soft glow that matches the orb's color */}
              <div
                className={cn(
                  "absolute -inset-8 md:-inset-12 rounded-full blur-3xl transition-all duration-200",
                  status === "speaking"
                    ? "bg-primary/40 opacity-80"
                    : "bg-emerald-500/20 opacity-40"
                )}
                style={{ transform: `scale(${1 + volumeLevel})` }}
              />
              {/* The Inner Orb: Scales up based on getOrbScale() logic */}
              <div
                className={cn(
                  "relative h-32 w-32 md:h-48 md:w-48 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  status === "speaking"
                    ? "border-primary/50 bg-primary/10"
                    : "border-emerald-500/30 bg-emerald-500/5"
                )}
                style={{ transform: `scale(${getOrbScale()})` }}
              >
                <Activity className="h-16 w-16 text-primary animate-spin" />
              </div>
            </div>
            {/* The real-time transcript subtitles */}
            <div className="space-y-3 text-center w-full max-w-xl mx-auto min-h-[100px]">
              <p className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest">
                {status === "listening"
                  ? "Listening..."
                  : status === "speaking"
                  ? "Speaking..."
                  : "Connecting..."}
              </p>
              <p
                className={cn(
                  "text-lg md:text-2xl font-medium leading-relaxed transition-all duration-300",
                  status === "listening"
                    ? "text-zinc-400 italic"
                    : "text-zinc-100"
                )}
              >
                "{transcript}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* --- FOOTER: Call controls --- */}
      {status !== "processing" && (
        <div className="relative bg-card border-t border-border p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
          {/* Identity info */}
          <div className="hidden md:flex items-center gap-3 text-left">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
              {userName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {userName}
              </p>
              <p className="text-xs text-muted-foreground">Guest User</p>
            </div>
          </div>

          {/* Main call action buttons */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-center">
            {/* Microphone Toggle Button */}
            {(status === "active" ||
              status === "listening" ||
              status === "speaking") && (
              <Button
                variant="secondary"
                size="icon"
                onClick={toggleMic}
                className={cn(
                  "h-12 w-12 md:h-14 md:w-14 rounded-full transition-all shadow-sm border border-border",
                  !isMicOn &&
                    "bg-destructive/10 text-destructive border-destructive/20"
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
                className="h-12 md:h-14 px-8 rounded-full bg-destructive text-white hover:scale-105"
              >
                <PhoneOff className="h-6 w-6 mr-2" /> End Call
              </Button>
            )}
          </div>
          <div className="hidden md:block w-[180px]"></div>
        </div>
      )}
    </Card>
  );
};

export default Agent;
