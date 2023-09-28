import { NextRequest, NextResponse } from "next/server";
import { Category, Priority } from "./types";
import getPredictionFromImage from "./getPredicitonFromImage";

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