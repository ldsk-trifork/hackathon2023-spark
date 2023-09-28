import { NextRequest, NextResponse } from "next/server";
import { Category, Priority } from "./types";
import getPredictionFromImage from "./getPredicitonFromImage";
import { completion } from "../../service/openai";

// Endpoint for receiving an image from the client
export async function POST(req: NextRequest, res: NextResponse) {
  const json = await req.json()
  const prediction = getPredictionFromImage(json.image)

  // TODO: Jens use data from blob to call OpenAI API


  return NextResponse.json(json)
}

// TODO Remove stupid impl.
export async function GET(req: NextRequest): Promise<any> {
    const prompt = req.nextUrl.searchParams.get('p') as string;
    const text = await completion(prompt, Math.ceil(prompt.length / 4) + 100);

    return NextResponse.json(text);
}
