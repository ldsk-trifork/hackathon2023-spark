import {NextRequest, NextResponse} from "next/server";
import {Category, Prediction, Priority} from "./types";
import getPredictionFromImage from "./getPredicitonFromImage";
import {chat, Message} from "../../service/openai";

// Endpoint for receiving an image from the client
export async function POST(req: NextRequest, res: NextResponse) {
  const { image } = await req.json()
  const prediction = getPredictionFromImage(image);

  // const panelId = req.nextUrl.searchParams.get('panelId') as string;
  const panelId = 'foo-panel';
  const description = await generateDescription(panelId, prediction);

  return NextResponse.json({
    panelId: "123",
    location: { lat: 0, lng: 0 },
    priority: Priority.HIGH_IMPACT,
    category: Category.CRACK,
    description
  })
}

async function generateDescription(panelId: string, predictions: Prediction[]): Promise<string> {
    const probabilities = predictions
        .sort((a, b) => b.confidence - a.confidence)
        .map(p => `${Category[p.category].toLowerCase()}=${Math.round(p.confidence * 100)}%`)
        .join(', ');
    const messages: Message[] = [
        {
            role: 'system',
            content: `As a solar panel technician your task is to write a short (100 words) incident description based on probable diagnoses for panel '${panelId}'`
        },
        {
            role: 'user',
            content: `The possible diagnoses and their respective probabilities are: ${probabilities}`
        }
    ];

    return chat(messages, 200);
}
