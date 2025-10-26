"use client";
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { CompanionComponentProps, SavedMessage } from "@/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundwaves from "@/constants/soundwaves.json";
import { addToSessionHistory } from "@/lib/actions/brains.actions";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}
const BrainComponent =  ({
    brainId,
  subject,
  topic,
  name,
  userName,
  userImage,
  style,
  voice,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const checkMicrophonePermissions = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Clean up
      return true;
    } catch (error) {
      console.error("Microphone permission error:", error);
      return false;
    }
  };

  useEffect(() => {
    if (lottieRef) {
      if (isSpeaking) {
        lottieRef.current?.play();
      } else {
        lottieRef.current?.stop();
      }
    }
  }, [isSpeaking, lottieRef]);
  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };
    
    const onCallEnd = async () => {
      setCallStatus(CallStatus.FINISHED);
      setIsSpeaking(false);

      // Save session history with all messages
      if (messages.length > 0) {
        try {
          const userMessages = messages.filter(msg => msg.role === "user").map(msg => msg.content).join(" | ");
          const assistantMessages = messages.filter(msg => msg.role === "assistant").map(msg => msg.content).join(" | ");
          
          await addToSessionHistory(brainId, userMessages, assistantMessages);
        } catch (error) {
          console.error("Failed to save session history:", error);
        }
      }
    };

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { 
          role: message.role, 
          content: message.transcript 
        };
        setMessages((prev) => [newMessage, ...prev]);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };
    
    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("Vapi Error:", error.message);
      setCallStatus(CallStatus.FINISHED);
      setIsSpeaking(false);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
    };
  }, [brainId, messages]); // Add dependencies

  const toggleMicrophone = () => {
    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);

      // Check microphone permissions first
      const hasPermission = await checkMicrophonePermissions();
      if (!hasPermission) {
        setCallStatus(CallStatus.FINISHED);
        return;
      }

      // Check if vapi is properly initialized
      if (!vapi) {
        console.error("Vapi instance not found");
        setCallStatus(CallStatus.FINISHED);
        return;
      }

      const assistantConfig = configureAssistant(voice, style);

      const assistantOverrides = {
        variableValues: {
          subject: subject,
          topic: topic,
          style: style,
        },
      };

      // Start the call with the assistant configuration
      await vapi.start(assistantConfig, assistantOverrides);
      
    } catch (error: any) {
      console.error("Failed to start call:", error);
      setCallStatus(CallStatus.FINISHED);
    }
  };

  const handleDisconnect = async () => {
    try {
      console.log("Disconnecting call");
      setCallStatus(CallStatus.FINISHED);
      setIsSpeaking(false);
      vapi.stop();
    } catch (error) {
      console.error("Error disconnecting call:", error);
    }
  };
  return (
    <section className="flex flex-col h-[70vh]">
      <section className="flex gap-8 max:sm:flex-col">
        <div className="companion-section">
          <div
            className="companion-avatar"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <div
              className={cn(
                `absolute transition-opacity duration-1000`,
                callStatus === CallStatus.FINISHED ||
                  callStatus === CallStatus.INACTIVE
                  ? "opacity-1001"
                  : "opacity-0",
                callStatus === CallStatus.CONNECTING &&
                  "opacity-100 animate-pulse"
              )}
            >
              <Image
                src={`/icons/${subject}.svg`}
                alt={subject}
                width={150}
                height={150}
                className="max-sm:w-fit"
              />
            </div>
            <div
              className={cn(
                "absolute transition-opacity duration-1000",
                callStatus === CallStatus.ACTIVE ? "opacity-100" : "opacity-0"
              )}
            >
              {/* <SonicWaveformHero /> */}
              {/* <DotLottie lottieRef={}/> */}
              <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoplay={false}
                className="companion-lottie"
              />
            </div>
          </div>
          <p className="font-bold text-2xl">{name}</p>
        </div>
        <div className="user-section">
          <div className="user-avatar">
            <Image
              src={userImage}
              alt={userName}
              width={130}
              height={130}
              className="rounded-lg"
            />
            <p className="font-bold text-2xl">{userName}</p>
          </div>
          <button className="btn-mic" onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE}>
            <Image
              src={isMuted ? "/icons/mic-off.svg" : "/icons/mic-on.svg"}
              alt="mic"
              width={36}
              height={36}
            />
            <p className="max-sm:hidden">
              {isMuted ? "Turn on microphone" : "Turn off Microphone"}
            </p>
          </button>

          <button
            className={cn(
              "rounded-lg py-2 cursor-pointer transition-colors w-full text-white",
              callStatus === CallStatus.ACTIVE ? "bg-red-700" : "bg-primary",
              callStatus === CallStatus.CONNECTING && "animate-pulse"
            )}
            onClick={
              callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall
            }
          >
            {callStatus === CallStatus.ACTIVE
              ? "End Status"
              : callStatus === CallStatus.CONNECTING
              ? "Connecting"
              : "Start Session"}
          </button>
        </div>
      </section>

      <section className="transcript">
        <div className="transcript-message no-scrollbar">
          {messages.map((message, index) => {
            if (message.role === "assistant") {
              return (
                <p key={index} className="max-sm:text-sm">
                  {name.split(" ")[0].replace("/[.,]/g,", "")}:{" "}
                  {message.content}
                </p>
              );
            } else {
              return (
                <p key={index} className="text-primary max-sm:text-sm">
                  {userName}:{message.content}
                </p>
              );
            }
          })}
        </div>

        <div className="transcript-fade"></div>
      </section>
    </section>
  );
};

export default BrainComponent;
