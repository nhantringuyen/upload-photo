export interface SceneOption {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  icon?: string;
}

export interface HistoricalEra {
  id: string;
  title: string;
  year: string;
  eraCategory: 'ancient' | 'medieval' | 'renaissance' | 'victorian' | '20th_century' | 'futuristic';
  shortDescription: string;
  detailedContext: string;
  icon: string;
  accentColor: string;
  clothingDescription: string;
  backgroundSetting: string;
  artStyle: string;
  scenes: SceneOption[];
  samplePrompts: string[];
}

export interface FaceAnalysisResult {
  detectedExpression: string;
  facialStructure: string;
  lightingAngle: string;
  suggestedHistoricalRoles: string[];
  recommendedEras: {
    eraId: string;
    eraTitle: string;
    compatibilityScore: number;
    reason: string;
  }[];
  customStylingAdvice: string;
  historicalQuote: string;
}

export interface TimeTravelPhoto {
  id: string;
  timestamp: number;
  originalImage: string; // base64 or url
  generatedImage: string; // base64 or url
  eraId: string;
  eraTitle: string;
  eraYear: string;
  sceneName: string;
  customPrompt?: string;
  appliedFilter?: string;
  historicalLore?: string;
  passengerName?: string;
}

export interface VintageFilter {
  id: string;
  name: string;
  yearLabel: string;
  description: string;
  filterClass: string;
  colorGrade: string;
  overlayType?: 'none' | 'sepia-dust' | 'vignette' | 'scanlines' | 'halftone';
}
