import {NextRequest, NextResponse} from "next/server";
import {Category, Priority, RequestBody} from "../../service/predictions/types";
import { generateDescription } from "../../service/predictions/generateDescription";
import getSapData from "@/app/service/sap";
import { getPredictionFromId } from "@/app/service/predictions/getPrediciton";
import { getHighestScoringPrediction } from "@/app/service/predictions/getHighestScoringPrediction";
import {Notification} from "@/app/service/sap/sap";

// Endpoint for receiving an image from the client
export async function POST(req: NextRequest, res: NextResponse) {
  const { paneId, image }: RequestBody = await req.json()
  console.log(paneId)
  if(paneId === undefined || paneId === "") {
    return NextResponse.json({ message: "PaneId is undefined or empty" }, { status: 400 })
  } else if(paneId !== "RAT" && paneId !== "DSAT" && paneId !== "SAL") {
    return NextResponse.json({ message: "Invalid paneId" }, { status: 400 })
  }

  const prediction = getPredictionFromId(paneId)
  const heighestScoringPrediction = getHighestScoringPrediction(prediction)
  
  const descriptionPromise = generateDescription(paneId, prediction);
  const sapId = paneIdToSapIdMapper(paneId as PaneId)
  const sapDataPromise = getSapData(sapId)
  let [description, sapData]: [string | undefined, Notification | undefined] = [undefined, undefined]
  try {
    [description, sapData] = await Promise.all([descriptionPromise, sapDataPromise])
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Failed to get SAP data" }, { status: 500 })
  }
  
  return NextResponse.json({
      paneId,
      location: toLocation(sapData),
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

function toLocation(notification: Notification) {
    const lat = notification.Latitude == null ? NaN : parseFloat(notification.Latitude);
    const lng = notification.Longitude == null ? NaN : parseFloat(notification.Longitude);

    return isNaN(lat) || isNaN(lng)
        ? null
        : { lat, lng };
}
