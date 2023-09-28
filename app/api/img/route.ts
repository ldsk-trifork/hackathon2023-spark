import { NextRequest, NextResponse } from "next/server";
import { Category, Priority } from "./types";
import getPredictionFromImage from "./getPredicitonFromImage";
import { completion } from "../../service/openai";

// Endpoint for receiving an image from the client
export async function POST(req: NextRequest, res: NextResponse) {
  const { image } = await req.json()
  const prediction = getPredictionFromImage(image)

  // TODO: Jens use data from blob to call OpenAI API


  return NextResponse.json({
    panelId: "123",
    location: { lat: 0, lng: 0 },
    priority: Priority.HIGH_IMPACT,
    category: Category.CRACK,
    description: "Big crack. Doesn't work."
  })
}

// TODO Remove stupid impl.
export async function GET(req: NextRequest): Promise<any> {
    const prompt = req.nextUrl.searchParams.get('p') as string;
    const text = await completion(prompt, Math.ceil(prompt.length / 4) + 100);

    return NextResponse.json(text);
}
