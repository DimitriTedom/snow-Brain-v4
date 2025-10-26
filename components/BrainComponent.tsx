"use client";
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { CompanionComponentProps, SavedMessage } from "@/types";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
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
  const [debugLog, setDebugLog] = useState<string[]>([]);

  // Helper function to add debug logs
  const addDebugLog = (message: string) => {
    setDebugLog(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 9)]);
    console.log(message);
  };

  // Test function to check vapi instance
  const testSimpleCall = async () => {
    addDebugLog("=== TESTING SIMPLE CALL ===");
    try {
      if (!vapi) {
        addDebugLog("ERROR: No vapi instance");
        return;
      }

      // Test with minimal configuration using exact same structure as our working config
      const minimalConfig: CreateAssistantDTO = {
        name: "Test Assistant",
        firstMessage: "Hello, this is a test call.",
        transcriber: {
          provider: "deepgram",
          model: "nova-3",
          language: "en",
        },
        model: {
          provider: "deep-seek",
          model: "deepseek-chat",
          temperature: 0.7,
          maxTokens: 150,
        },
        voice: {
          provider: "11labs",
          voiceId: "sarah",
          stability: 0.4,
          similarityBoost: 0.8,
        },
      };

      addDebugLog("Starting simple test call...");
      const result = await vapi.start(minimalConfig);
      addDebugLog(`Simple call result: ${JSON.stringify(result)}`);
      
    } catch (error: any) {
      addDebugLog(`Simple call failed: ${error.message || error}`);
      console.error("Simple call error:", error);
    }
    addDebugLog("=== END SIMPLE CALL TEST ===");
  };

  const testVapiInstance = () => {
    addDebugLog("=== VAPI INSTANCE TEST ===");
    addDebugLog(`Vapi exists: ${!!vapi}`);
    addDebugLog(`Vapi type: ${typeof vapi}`);
    
    if (vapi) {
      addDebugLog(`Vapi methods: ${Object.getOwnPropertyNames(Object.getPrototypeOf(vapi))}`);
      addDebugLog(`Has start method: ${typeof vapi.start === 'function'}`);
      addDebugLog(`Has stop method: ${typeof vapi.stop === 'function'}`);
    }

    // Check environment variable
    addDebugLog(`VAPI token exists: ${!!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN}`);
    addDebugLog(`VAPI token length: ${process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN?.length || 0}`);
    
    addDebugLog("=== END VAPI TEST ===");
  };  // Check microphone permissions
  const checkMicrophonePermissions = async () => {
    try {
      addDebugLog("Checking microphone permissions...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      addDebugLog("Microphone permission granted");
      stream.getTracks().forEach(track => track.stop()); // Clean up
    } catch (error: any) {
      addDebugLog(`Microphone permission error: ${error.message}`);
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
      addDebugLog("Call started successfully");
    };
    
    const onCallEnd = async () => {
      addDebugLog("Call ended");
      setCallStatus(CallStatus.FINISHED);
      setIsSpeaking(false);

      // Save session history with all messages
      if (messages.length > 0) {
        try {
          const userMessages = messages.filter(msg => msg.role === "user").map(msg => msg.content).join(" | ");
          const assistantMessages = messages.filter(msg => msg.role === "assistant").map(msg => msg.content).join(" | ");
          
          await addToSessionHistory(brainId, userMessages, assistantMessages);
          addDebugLog("Session history saved");
        } catch (error) {
          addDebugLog(`Failed to save session history: ${error}`);
        }
      }
    };

    const onMessage = (message: any) => {
      addDebugLog(`Received message: ${message.type} - ${message.role || 'no role'}`);
      
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { 
          role: message.role, 
          content: message.transcript 
        };
        setMessages((prev) => [newMessage, ...prev]);
        addDebugLog(`Added transcript: ${message.role}: ${message.transcript}`);
      }

      // Log other message types for debugging
      if (message.type === "speech-update") {
        addDebugLog(`Speech update: ${message.status}`);
      }
    };

    const onSpeechStart = () => {
      addDebugLog("Speech started");
      setIsSpeaking(true);
    };
    
    const onSpeechEnd = () => {
      addDebugLog("Speech ended");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      addDebugLog(`Vapi Error: ${error.message}`);
      setCallStatus(CallStatus.FINISHED);
      setIsSpeaking(false);
    };

    // Add more event listeners for debugging
    const onVolumeLevel = (volume: any) => {
      // Only log significant volume changes to avoid spam
      if (volume.level > 0.1) {
        addDebugLog(`Volume level: ${volume.level}`);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("volume-level", onVolumeLevel);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("volume-level", onVolumeLevel);
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
      addDebugLog(`Starting call with: ${subject}, ${topic}, ${style}, ${voice}`);

      // Check microphone permissions first
      await checkMicrophonePermissions();

      // Check if vapi is properly initialized
      if (!vapi) {
        addDebugLog("ERROR: Vapi instance not found");
        setCallStatus(CallStatus.FINISHED);
        return;
      }

      const assistantConfig = configureAssistant(voice, style);
      addDebugLog("Assistant config created successfully");

      const assistantOverrides = {
        variableValues: {
          subject: subject,
          topic: topic,
          style: style,
        },
      };

      addDebugLog(`Variable values: ${JSON.stringify(assistantOverrides.variableValues)}`);

      // Start the call with the assistant configuration
      addDebugLog("Calling vapi.start...");
      const result = await vapi.start(assistantConfig, assistantOverrides);
      addDebugLog(`Vapi.start result: ${JSON.stringify(result)}`);
      
    } catch (error: any) {
      addDebugLog(`Failed to start call: ${error.message || error}`);
      console.error("Full error:", error);
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

          {/* Temporary debug button - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <button
              className="rounded-lg py-1 px-2 bg-gray-500 text-white text-sm mt-2 w-full"
              onClick={testVapiInstance}
            >
              Test Vapi
            </button>
          )}
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

        {/* Debug Panel - only show during development or when call status is problematic */}
        {(process.env.NODE_ENV === 'development' || callStatus === CallStatus.FINISHED) && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold text-sm mb-2">Debug Panel:</h3>
            <div className="space-x-2 mb-2">
              <button onClick={testVapiInstance} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                Test Vapi Instance
              </button>
              <button onClick={checkMicrophonePermissions} className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                Check Microphone
              </button>
              <button onClick={testSimpleCall} className="px-3 py-1 bg-purple-500 text-white rounded text-sm">
                Test Simple Call
              </button>
              <button onClick={() => setDebugLog([])} className="px-3 py-1 bg-red-500 text-white rounded text-sm">
                Clear Logs
              </button>
            </div>
            <div className="text-xs max-h-32 overflow-y-auto space-y-1 bg-black text-green-400 p-2 rounded font-mono">
              {debugLog.map((log, index) => (
                <p key={index}>{log}</p>
              ))}
            </div>
          </div>
        )}
      </section>
    </section>
  );
};

export default BrainComponent;
