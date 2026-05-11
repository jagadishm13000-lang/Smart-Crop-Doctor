export type AppModule = "voice" | "weather" | "history" | "yield" | "compare" | "scanner" | null;

export type Feature = {
  title: string;
  description: string;
  icon: string;
  color: string;
};

export type Stat = {
  label: string;
  value: string;
  suffix?: string;
};

export type Report = {
  id: string;
  crop: string;
  status: 'Healthy' | 'Infected' | 'At Risk';
  date: string;
};

export interface AnalysisResult {
  name: string;
  confidence: number;
  severity: "None" | "Low" | "Medium" | "High" | "Critical";
  description: string;
  symptoms: string[];
  causes: string[];
  remedies: {
    organic: string[];
    chemical?: string[];
    immediate: string;
  };
  prevention: string[];
  farmingAdvice: {
    irrigation: string;
    weatherPrecautions: string;
    fertilizer: string;
  };
  recoveryExpectation: string;
  timestamp: string;
  image?: string; // Base64 or URL
  // Metadata for report
  location?: string;
  cropType?: string;
  weather?: {
    temp: string;
    humidity: string;
    rain: string;
  };
}
