export function formatYen(n) { return n.toLocaleString("ja-JP") + "円"; }
export function formatMin(m) { const h = Math.floor(m / 60), mn = m % 60; return h > 0 ? `${h}時間${mn > 0 ? mn + "分" : ""}` : `${mn}分`; }

export function mapToNearestOrigin(inputStr) {
  if (!inputStr) return { origin: "東京", isEstimated: true };
  const s = inputStr.toLowerCase();
  
  // Exact matches
  const exact = ["東京", "大阪", "名古屋", "福岡", "札幌", "仙台"];
  if (exact.includes(s)) return { origin: s, isEstimated: false };
  for (const e of exact) {
    if (s.includes(e)) return { origin: e, isEstimated: false };
  }

  // Kansai -> Osaka
  if (s.match(/京都|兵庫|神戸|滋賀|奈良|和歌山|関西|近畿|osaka|kyoto|kobe|kansai|kinki/)) return { origin: "大阪", isEstimated: true };
  
  // Tokai/Chubu -> Nagoya
  if (s.match(/愛知|岐阜|三重|静岡|東海|中部|nagoya|aichi|shizuoka|gifu|mie/)) return { origin: "名古屋", isEstimated: true };
  
  // Kyushu/Chugoku/Shikoku -> Fukuoka
  if (s.match(/佐賀|長崎|熊本|大分|宮崎|鹿児島|沖縄|九州|山口|広島|岡山|鳥取|島根|中国|愛媛|香川|徳島|高知|四国|fukuoka|kyushu|okinawa|hiroshima/)) return { origin: "福岡", isEstimated: true };
  
  // Hokkaido -> Sapporo
  if (s.match(/北海道|sapporo|hokkaido/)) return { origin: "札幌", isEstimated: true };
  
  // Tohoku -> Sendai
  if (s.match(/青森|岩手|秋田|山形|福島|宮城|東北|sendai|tohoku|aomori/)) return { origin: "仙台", isEstimated: true };
  
  // Default to Tokyo for Kanto, Koshinetsu, Hokuriku or unknown
  return { origin: "東京", isEstimated: true };
}
