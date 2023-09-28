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
  const description = await generateDescription(id, prediction);
  const data = await getSapData(id)

  return NextResponse.json({
      panelId: id,
      location: { lat: 42, lng: 42 },
      priority: Priority[heighestScoringPrediction.category],
      category: Category[heighestScoringPrediction.category],
      description,
      sap: {
          ...data,
          NotificationDate: data.NotificationDate?.toISOString(),
          NotificationTime: data.NotificationTime?.toISOString(),
          CompletionDate: data.CompletionDate?.toISOString(),
          RequiredEndDate: data.RequiredEndDate?.toISOString(),
      }
  })
}
