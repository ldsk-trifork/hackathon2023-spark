import { Prediction } from "./types";

export function getHighestScoringPrediction(predictions: Prediction[]): Prediction {
  return predictions.reduce((acc, curr) => curr.confidence > acc.confidence ? curr : acc);
}
