import {NextRequest, NextResponse} from "next/server";
import {Category, Priority, RequestBody} from "../../service/predictions/types";
import { generateDescription } from "../../service/predictions/generateDescription";
import getSapData from "@/app/service/sap";
import { getPredictionFromId } from "@/app/service/predictions/getPrediciton";
import { getHighestScoringPrediction } from "@/app/service/predictions/getHighestScoringPrediction";

// Endpoint for receiving an image from the client
export async function POST(req: NextRequest, res: NextResponse) {
  const { paneId, image }: RequestBody = await req.json()
  console.log(paneId)
  if(paneId === undefined || paneId === "") {
    return NextResponse.json({ message: "PaneId is undefined or empty" }, { status: 400 })
  }

  const prediction = getPredictionFromId(paneId)
  const heighestScoringPrediction = getHighestScoringPrediction(prediction)
  
  const descriptionPromise = generateDescription(paneId, prediction);
  const sapId = paneIdToSapIdMapper(paneId as PaneId)
  const sapDataPromise = getSapData(sapId)
  const [description, sapData] = await Promise.all([descriptionPromise, sapDataPromise])
  return NextResponse.json({
      paneId,
      location: { lat: 42, lng: 42 },
      priority: Priority[heighestScoringPrediction.category],
      category: Category[heighestScoringPrediction.category],
      description,
      sap: {
          ...sapData,
      }
  })
}

type PaneId = "RAT" | "DSAT" | "SAL"
type SapId = "24" | "555" | "31121"
function paneIdToSapIdMapper(paneId: PaneId): SapId {
  switch(paneId) {
    case "RAT": return "31121"
    case "DSAT": return "24"
    case "SAL": return "555"
    default: throw new Error("Invalid paneId")
  }
}