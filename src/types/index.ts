export type TransportMethod = "新幹線" | "飛行機" | "在来線" | "新幹線+在来線" | "在来線+バス";

export interface TransportDetail {
  cost: number;
  minutes: number;
  method: string;
}

export interface ModelCourse {
  dayTrip: string[];
  overnight: string[];
}

export interface Destination {
  id: string;
  name: string;
  prefecture: string;
  themes: string[];
  description: string;
  scene?: string[];
  season: string;
  transport: Record<string, TransportDetail>;
  lodging: {
    budget: number;
    standard: number;
  };
  tags: {
    family?: boolean;
    [key: string]: boolean | undefined;
  };
  imageUrl: string;
  externalLinks: {
    jalan: string;
  };
  modelCourse: ModelCourse;
  spots: string[];
  largeAreaCode?: string;
}
