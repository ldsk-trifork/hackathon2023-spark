import {NextRequest, NextResponse} from "next/server";
import {Category, Prediction, Priority} from "./types";
import getPredictionFromImage from "./getPredicitonFromImage";
import {chat, Message} from "../../service/openai";

interface RequestBody {
  id: string;
  image: string;
}

// Endpoint for receiving an image from the client
export async function POST(req: NextRequest, res: NextResponse) {
  const { id, image }: RequestBody = await req.json()
  const prediction = getPredictionFromImage(image)
  const heighestScoringPrediction = getHighestScoringPrediction(prediction)
  const description = await generateDescription(id, prediction);
  return NextResponse.json({
      panelId: id,
      location: { lat: 42, lng: 42 },
      priority: Priority[heighestScoringPrediction.category],
      category: Category[heighestScoringPrediction.category],
      description
  })
}

function getHighestScoringPrediction(predictions: Prediction[]): Prediction {
    return predictions.reduce((acc, curr) => curr.confidence > acc.confidence ? curr : acc);
}

async function generateDescription(panelId: string, predictions: Prediction[]): Promise<string> {
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
