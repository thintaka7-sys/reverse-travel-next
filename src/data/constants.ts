export const ORIGINS = ["東京", "大阪", "名古屋", "福岡", "札幌", "仙台"];
export const THEMES = ["温泉", "グルメ", "自然", "歴史", "アクティビティ"];
export const SCENES = ["カップル", "子連れ", "友達", "一人旅"];
export const SCHEDULES = [
  { key: "dayTrip", label: "日帰り", nights: 0 },
  { key: "1night", label: "1泊2日", nights: 1 },
  { key: "2nights", label: "2泊3日", nights: 2 }
];
export const TRANSPORT_OPTIONS = ["電車のみ", "新幹線OK", "飛行機OK"];
export const FOOD_COST: Record<number, number> = { 0: 3000, 1: 6000, 2: 9000 };
