// 出発地（都市名 → 代表駅名）マッピング
const ORIGIN_STATION_MAP: Record<string, string> = {
  // 関東
  "東京": "東京",
  "横浜": "横浜",
  "川崎": "川崎",
  "千葉": "千葉",
  "さいたま": "大宮",
  "埼玉": "大宮",
  "大宮": "大宮",
  "船橋": "船橋",
  "柏": "柏",
  "相模原": "相模原",
  "八王子": "八王子",
  "立川": "立川",
  "町田": "町田",
  "藤沢": "藤沢",
  "厚木": "本厚木",
  "小田原": "小田原",
  "宇都宮": "宇都宮",
  "前橋": "前橋",
  "高崎": "高崎",
  "水戸": "水戸",
  // 近畿
  "大阪": "大阪",
  "神戸": "神戸",
  "京都": "京都",
  "奈良": "奈良",
  "和歌山": "和歌山",
  "堺": "堺市",
  "尼崎": "尼崎",
  "西宮": "西宮",
  "姫路": "姫路",
  // 東海
  "名古屋": "名古屋",
  "静岡": "静岡",
  "浜松": "浜松",
  "岐阜": "岐阜",
  "豊橋": "豊橋",
  "津": "津",
  "四日市": "四日市",
  // 九州
  "福岡": "博多",
  "北九州": "小倉",
  "熊本": "熊本",
  "鹿児島": "鹿児島中央",
  "長崎": "長崎",
  "大分": "大分",
  "宮崎": "宮崎",
  "佐賀": "佐賀",
  // 北海道
  "札幌": "札幌",
  "旭川": "旭川",
  "函館": "函館",
  "帯広": "帯広",
  "釧路": "釧路",
  // 東北
  "仙台": "仙台",
  "青森": "青森",
  "盛岡": "盛岡",
  "秋田": "秋田",
  "山形": "山形",
  "福島": "福島",
  // 北陸
  "金沢": "金沢",
  "富山": "富山",
  "福井": "福井",
  // 甲信越
  "新潟": "新潟",
  "長野": "長野",
  "松本": "松本",
  "甲府": "甲府",
  // 中国
  "広島": "広島",
  "岡山": "岡山",
  "鳥取": "鳥取",
  "松江": "松江",
  "山口": "新山口",
  // 四国
  "高松": "高松",
  "松山": "松山",
  "高知": "高知",
  "徳島": "徳島",
};

// 目的地ID → 代表駅名マッピング（Yahoo! 乗換API用）
const DEST_STATION_MAP: Record<string, string> = {
  "kyoto-01":       "京都",
  "hakone-01":      "箱根湯本",
  "nikko-01":       "日光",
  "kamakura-01":    "鎌倉",
  "atami-01":       "熱海",
  "kanazawa-01":    "金沢",
  "hiroshima-01":   "広島",
  "fukuoka-city-01":"博多",
  "sapporo-01":     "札幌",
  "sendai-01":      "仙台",
  "nara-01":        "奈良",
  "nagasaki-01":    "長崎",
  "izu-01":         "伊東",
  "takayama-01":    "高山",
  "okinawa-01":     "那覇空港",
  "matsumoto-01":   "松本",
  "beppu-01":       "別府",
  "kusatsu-01":     "長野原草津口",
  "miyajima-01":    "宮島口",
  "kawaguchiko-01": "河口湖",
  "chichibu-01":    "西武秩父",
  "nasu-01":        "黒磯",
  "enoshima-01":    "片瀬江ノ島",
  "kinosaki-01":    "城崎温泉",
  "shirahama-01":   "白浜",
  "arima-01":       "有馬温泉",
  "otaru-01":       "小樽",
  "kagoshima-01":   "鹿児島中央",
  "matsuyama-01":   "松山",
  "karuizawa-01":   "軽井沢",
  "yokohama-01":    "横浜",
  "ise-01":         "伊勢市",
  "hakodate-01":    "函館",
  "kumamoto-01":    "熊本",
  "tottori-01":     "鳥取",
  "noboribetsu-01": "登別",
};

/** 都市名 → 代表駅名。未対応の場合は null を返す */
export function getNearestStation(cityName: string): string | null {
  return ORIGIN_STATION_MAP[cityName] ?? null;
}

/** 目的地ID → 代表駅名。未対応の場合は null を返す */
export function getDestinationStation(destId: string): string | null {
  return DEST_STATION_MAP[destId] ?? null;
}

/** 静的データが存在する6都市 */
export const STATIC_ORIGINS = ["東京", "大阪", "名古屋", "福岡", "札幌", "仙台"] as const;

export function isStaticOrigin(city: string): boolean {
  return (STATIC_ORIGINS as readonly string[]).includes(city);
}
