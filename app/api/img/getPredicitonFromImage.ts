import { Category, Prediction } from "./types"

const mostLikelyCrack: Prediction[] = [
  { category: Category.CRACK, confidence: 0.9 },
  { category: Category.DENT, confidence: 0.05 },
  { category: Category.OTHER, confidence: 0.05 }
]
const mostLikelyScratch: Prediction[] = [
  { category: Category.SCRATCH, confidence: 0.8 },
  { category: Category.DENT, confidence: 0.15 },
  { category: Category.OTHER, confidence: 0.05 }
]
const mostLikelyDent: Prediction[] = [
  { category: Category.DIRTY, confidence: 0.60 },
  { category: Category.CRACK, confidence: 0.25 },
  { category: Category.OTHER, confidence: 0.15 }
]

export default function getPredictionFromImage(image: string) {
  const randomIndex = Math.random() % 3
  switch (randomIndex) {
    case 0:
      return mostLikelyCrack
    case 1:
      return mostLikelyScratch
    default:
      return mostLikelyDent
  }
}