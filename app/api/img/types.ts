export interface Prediction {
  category: Category
  confidence: number
}

export enum Priority {
  CRITICAL_IMPACT,
  HIGH_IMPACT,
  MODERATE_IMPACT,
  LOW_IMPACT,
  NEGLIGIBLE_IMPACT,
  MAINTENANCE_REQUIRED
}

export enum Category {
  CRACK,
  SCRATCH,
  DENT,
  HOLE,
  DIRTY,
  OTHER
}

export interface ReportData {
  panelId: string
  location: { lat: number, lng: number }
  priority: Priority
  category: Category
  description: string
}

export interface ResponseBody {
  id: string;
  description: string;
  report: ReportData
}

export interface RequestBody {
  id: string;
  image: string;
}