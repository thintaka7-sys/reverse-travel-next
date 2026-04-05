import { Destination } from '../types';
import { FOOD_COST } from '../data/constants';
import destinationsJson from '../data/destinations.json';

const destinations = destinationsJson as Destination[];

export function mapToNearestOrigin(inputStr: string | null | undefined): { origin: string; isEstimated: boolean } {
  if (!inputStr) return { origin: "東京", isEstimated: true };
  const s = inputStr.toLowerCase();

  const exact = ["東京", "大阪", "名古屋", "福岡", "札幌", "仙台"];
  if (exact.includes(s)) return { origin: s, isEstimated: false };
  for (const e of exact) {
    if (s.includes(e)) return { origin: e, isEstimated: false };
  }

  if (s.match(/京都|兵庫|神戸|滋賀|奈良|和歌山|関西|近畿|osaka|kyoto|kobe|kansai|kinki/)) return { origin: "大阪", isEstimated: true };
  if (s.match(/愛知|岐阜|三重|静岡|東海|中部|nagoya|aichi|shizuoka|gifu|mie/)) return { origin: "名古屋", isEstimated: true };
  if (s.match(/佐賀|長崎|熊本|大分|宮崎|鹿児島|沖縄|九州|山口|広島|岡山|鳥取|島根|中国|愛媛|香川|徳島|高知|四国|fukuoka|kyushu|okinawa|hiroshima/)) return { origin: "福岡", isEstimated: true };
  if (s.match(/北海道|sapporo|hokkaido/)) return { origin: "札幌", isEstimated: true };
  if (s.match(/青森|岩手|秋田|山形|福島|宮城|東北|sendai|tohoku|aomori/)) return { origin: "仙台", isEstimated: true };

  return { origin: "東京", isEstimated: true };
}

export type LodgingGrade = 'budget' | 'standard' | 'premium';

export interface TransportData {
  cost: number;
  minutes: number;
  method: string;
}

export function calcCost(
  dest: Destination,
  originStr: string,
  nights: number,
  adults: number,
  children: number,
  seniors: number,
  lodgingGrade: LodgingGrade = 'budget',
  transportOverride?: TransportData
) {
  const p = adults + children + seniors;
  if (!p) return null;

  let tCost: number, tMins: number, tMethod: string, isEstimated: boolean;

  if (transportOverride) {
    tCost = transportOverride.cost;
    tMins = transportOverride.minutes;
    tMethod = transportOverride.method;
    isEstimated = false;
  } else {
    const { origin, isEstimated: est } = mapToNearestOrigin(originStr);
    const t = dest.transport[origin];
    if (!t) return null;
    tCost = est ? t.cost + 1500 : t.cost;
    tMins = est ? t.minutes + 40 : t.minutes;
    tMethod = t.method;
    isEstimated = est;
  }

  const tr = tCost * 2 * p;
  const lodgingRate = dest.lodging[lodgingGrade];
  const lo = nights > 0 ? lodgingRate * nights * p : 0;
  const fo = (FOOD_COST[nights] || 3000) * p;

  return {
    transport: tr,
    lodging: lo,
    food: fo,
    total: tr + lo + fo,
    perPerson: Math.ceil((tr + lo + fo) / p),
    method: tMethod,
    minutes: tMins,
    isEstimated,
  };
}

export function searchDests(params: {
  origin: string;
  adults: number;
  children: number;
  seniors: number;
  budget: number;
  nights: number;
  themes: string[];
  transportFilter: string[];
  sceneFilter: string[];
  sort: string;
  lodgingGrade?: LodgingGrade;
  transportData?: Map<string, TransportData>;
}) {
  const {
    origin, adults, children, seniors, budget, nights,
    themes, transportFilter, sceneFilter, sort,
    lodgingGrade = 'budget',
    transportData,
  } = params;
  if (adults + children + seniors === 0 || !origin) return [];

  const results = destinations.map(d => {
    const override = transportData?.get(d.id);
    const c = calcCost(d, origin, nights, adults, children, seniors, lodgingGrade, override);
    if (!c || c.total > budget) return null;

    if (transportFilter.length > 0) {
      const m = c.method;
      const ok = (transportFilter.includes("飛行機OK") && m.includes("飛行機")) ||
                 (transportFilter.includes("新幹線OK") && (m.includes("新幹線") || m.includes("在来線"))) ||
                 (transportFilter.includes("電車のみ") && (m.includes("在来線") || m.includes("バス")));
      if (!ok) return null;
    }

    if (themes.length > 0 && !themes.some(t => d.themes.includes(t))) return null;
    if (sceneFilter.length > 0 && d.scene && !sceneFilter.some(s => d.scene!.includes(s))) return null;

    return { ...d, cost: c, budgetRatio: c.total / budget };
  }).filter(Boolean) as (Destination & { cost: NonNullable<ReturnType<typeof calcCost>>; budgetRatio: number })[];

  if (sort === "time") results.sort((a, b) => a.cost.minutes - b.cost.minutes);
  else if (sort === "fit") results.sort((a, b) => a.budgetRatio - b.budgetRatio);
  else results.sort((a, b) => a.cost.total - b.cost.total);

  return results;
}

/** Yahoo! 乗換API から片道運賃・所要時間・交通手段を取得する */
export async function fetchTransportCost(
  fromStation: string,
  toStation: string
): Promise<TransportData | null> {
  try {
    const query = new URLSearchParams({ from: fromStation, to: toStation });
    const res = await fetch(`/api/transport?${query.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    return { cost: data.cost, minutes: data.minutes, method: data.method };
  } catch {
    return null;
  }
}
