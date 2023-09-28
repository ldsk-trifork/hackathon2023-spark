import {NextRequest, NextResponse} from "next/server";
import {Category, Priority, RequestBody} from "./types";
import { getPredictionFromId, getPredictionFromImage } from "./getPrediciton";
import { generateDescription } from "./generateDescription";
import { getHighestScoringPrediction } from "./getHighestScoringPrediction";

// Endpoint for receiving an image from the client
export async function POST(req: NextRequest, res: NextResponse) {
  const { id, image }: RequestBody = await req.json()
  // const prediction = getPredictionFromImage(image)
  const prediction = getPredictionFromId(id)
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
