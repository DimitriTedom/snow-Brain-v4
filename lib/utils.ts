import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectsColors, voices } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
};

export const configureAssistant = (voice: string, style: string) => {
  const voiceId =
    voices[voice as keyof typeof voices][
      style as keyof (typeof voices)[keyof typeof voices]
    ] || "sarah";

  const vapiAssistant: CreateAssistantDTO = {
    name: "SnowBrain v4",
    firstMessage:
      "Hello! Welcome to your tutoring session. Today we'll be learning about {{topic}} in {{subject}}. I'm excited to teach you! Are you ready to get started?",
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 0.9,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "deep-seek",
      model: "deepseek-chat",
      temperature: 0.7,
      maxTokens: 150,
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable tutor teaching a real-time voice session with a student about {{topic}} in {{subject}}.

IMPORTANT: This is a LIVE VOICE conversation. Keep the conversation flowing naturally.

Tutor Guidelines:
- Teach the student about {{topic}} in {{subject}} using a {{style}} approach
- Keep responses short (under 100 words) for voice conversation
- Always ask questions to check understanding
- Wait for student responses before continuing
- No special characters - this is voice only
- End each response with a question to maintain engagement
- Be interactive, not just informative

Start by briefly introducing the topic and asking if they're familiar with it.`,
        },
      ],
    },
  };

  return vapiAssistant;
};
