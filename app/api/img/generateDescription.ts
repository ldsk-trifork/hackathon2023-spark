import { Category, Prediction } from "./types";
import { chat, Message } from "../../service/openai";

export async function generateDescription(panelId: string, predictions: Prediction[]): Promise<string> {
  const probabilities = predictions
    .sort((a, b) => b.confidence - a.confidence)
    .map(p => `${Category[p.category].toLowerCase()}=${Math.round(p.confidence * 100)}%`)
    .join(', ');
  const messages: Message[] = [
    {
      role: 'system',
      content: `You are an expert solar panel technician.`
    },
    {
      role: 'user',
      content: `Write a short (75 words) incident description based on probable diagnoses for panel '${panelId}'. The probabilities for different errors are the following: ${probabilities}. Do not mention the probabilities in your response.`
    }
  ];

  return chat(messages, 200);
}
