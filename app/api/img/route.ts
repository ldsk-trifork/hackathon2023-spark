import {NextRequest, NextResponse} from "next/server";
import {Category, Priority, RequestBody} from "../../service/predictions/types";
import { generateDescription } from "../../service/predictions/generateDescription";
import getSapData from "@/app/service/sap";
import { getPredictionFromId } from "@/app/service/predictions/getPrediciton";
import { getHighestScoringPrediction } from "@/app/service/predictions/getHighestScoringPrediction";

// Endpoint for receiving an image from the client
export async function POST(req: NextRequest, res: NextResponse) {
  const { id, image }: RequestBody = await req.json()
  // const prediction = getPredictionFromImage(image)
  const prediction = getPredictionFromId(id)
  const heighestScoringPrediction = getHighestScoringPrediction(prediction)
  const descriptionPromise = generateDescription(id, prediction);
  const sapDataPromise = getSapData(id)
  const [description, sapData] = await Promise.all([descriptionPromise, sapDataPromise])

  return NextResponse.json({
      panelId: id,
      location: { lat: 42, lng: 42 },
      priority: Priority[heighestScoringPrediction.category],
      category: Category[heighestScoringPrediction.category],
      description,
      sap: {
          ...sapData,
      }
  })
}
