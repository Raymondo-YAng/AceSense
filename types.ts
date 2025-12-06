export interface SwingMetric {
  label: string;
  value: string;
  delta: string;
  isPositive: boolean;
}

export interface AnalysisSession {
  id: string;
  title: string;
  date: string;
  thumbnail: string;
}

export interface ProProfile {
  name: string;
  image: string;
}

export interface Exercise {
  category: string;
  title: string;
  description: string;
}
