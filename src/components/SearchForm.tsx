"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ORIGINS, THEMES, SCENES, SCHEDULES, TRANSPORT_OPTIONS } from '../data/constants';
import { searchDests } from '../lib/search';
import { getNearestStation, isStaticOrigin } from '../lib/location';

function formatYen(n: number) { return n.toLocaleString("ja-JP") + "円"; }

export default function SearchForm() {
  const router = useRouter();
  const [origin, setOrigin] = useState("東京");
  const [ad, setAd] = useState(2);
  const [ch, setCh] = useState(0);
  const [sr, setSr] = useState(0);
  const [budget, setBudget] = useState(100000);
  const [si, setSi] = useState(1);
  const [tf, setTf] = useState<string[]>([]);
  const [th, setTh] = useState<string[]>([]);
  const [sf, setSf] = useState<string[]>([]);
  const [now, setNow] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const tp = ad + ch + sr;

  // 自由入力の出発地が未対応かどうかチェック
  const originWarning = useMemo(() => {
    if (!origin || ORIGINS.includes(origin)) return null;
    if (isStaticOrigin(origin)) return null;
    if (getNearestStation(origin) === null) {
      return '対応していない出発地です。お近くの主要都市名でお試しください。';
    }
    return null;
  }, [origin]);

  const resultCount = useMemo(() => {
    if (tp === 0) return 0;
    return searchDests({
      origin, adults: ad, children: ch, seniors: sr, budget,
      nights: SCHEDULES[si]?.nights || 0,
      themes: th, transportFilter: tf, sceneFilter: sf, sort: 'cost',
    }).length;
  }, [origin, ad, ch, sr, budget, si, th, tf, sf, tp]);

  const tog = (p: string[], s: React.Dispatch<React.SetStateAction<string[]>>, v: string) => 
    s(p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const nowOn = () => { setNow(true); setSi(0); setBudget(30000); };
  const nowOff = () => setNow(false);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("お使いのブラウザは位置情報の取得に対応していません。");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
          if (!res.ok) throw new Error("API Network error");
          const data = await res.json();
          let locName = data.address.province || data.address.state || data.address.region || data.address.county || data.address.city || "現在地";
          locName = locName.replace(/(都|府|県)$/, '');
          setOrigin(locName || "現在地");
        } catch (error) {
          console.error(error);
          setOrigin("現在地");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("現在地の取得に失敗しました。設定を確認してください。");
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      origin,
      adults: ad.toString(),
      children: ch.toString(),
      seniors: sr.toString(),
      budget: budget.toString(),
      si: si.toString(),
      now: now ? "1" : "0"
    });
    if (tf.length > 0) params.set("tf", tf.join(","));
    if (th.length > 0) params.set("th", th.join(","));
    if (sf.length > 0) params.set("sf", sf.join(","));
    
    router.push(`/results?${params.toString()}`);
  };

  const chipBase = "inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[13px] cursor-pointer transition-all duration-200 border-[1.5px] font-medium whitespace-nowrap active:scale-95";
  const chipOff = "border-brown-300 bg-transparent text-brown-800 hover:border-brown-700 hover:bg-brown-50";
  const chipOn = "bg-brown-700 text-white border-brown-700 shadow-md shadow-brown-700/20";
  
  const secClass = "bg-white rounded-2xl p-5 mb-4 shadow-sm border border-brown-100/50";
  const LClass = "text-[13px] font-bold text-[#7a6b56] mb-3 flex items-center gap-2";
  const RClass = "text-[10px] bg-brown-200 text-brown-700 px-2 py-0.5 rounded-md font-semibold";
  const OClass = "text-[10px] bg-brown-100 text-brown-500 px-2 py-0.5 rounded-md font-semibold";
  const stepBtn = "w-9 h-9 rounded-xl border-[1.5px] border-brown-300 bg-white cursor-pointer text-lg font-bold text-brown-700 flex items-center justify-center transition-all hover:bg-brown-50 hover:border-brown-700 active:scale-90";

  return (
    <div className="animate-fu pb-6">
      <p className="text-center text-[14px] text-brown-600 my-2 mb-4 leading-relaxed font-medium">予算と条件から、行ける旅行先を逆算します</p>
      
      <div className="text-center mb-5">
        <button 
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold cursor-pointer border-none transition-all duration-200 active:scale-95 ${
            now ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 hover:scale-105" 
                : "bg-gray-200 text-gray-500 hover:bg-gray-300"
          }`}
          onClick={now ? nowOff : nowOn}
        >
          ⚡ 今すぐ出発モード {now ? "ON" : "OFF"}
        </button>
        {now && <div className="text-[12px] text-red-500 mt-2 font-medium animate-pulse">日帰り・低予算で今すぐ行ける場所を探します</div>}
      </div>

      <div className={secClass}>
        <div className={LClass}><span>🚉</span> 出発地 <span className={RClass}>必須</span></div>
        <div className="flex flex-wrap gap-2">
          {ORIGINS.map(o => (
            <button key={o} className={`${chipBase} ${origin === o ? chipOn : chipOff}`} onClick={() => setOrigin(o)}>{o}</button>
          ))}
        </div>
        <div className="flex flex-col gap-3 mt-3">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={!ORIGINS.includes(origin) ? origin : ''} 
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="その他の地域を入力..." 
              className="flex-1 bg-brown-50/50 border border-brown-200 rounded-xl px-3 py-2.5 text-[13px] font-medium text-brown-800 focus:outline-none focus:border-brown-500 focus:ring-1 focus:ring-brown-500 transition-all placeholder-brown-300 shadow-inner"
            />
            <button 
              onClick={handleGeolocation}
              disabled={isLocating}
              className={`shrink-0 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all border
                ${isLocating ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 active:scale-95 shadow-sm'}
              `}
            >
               {isLocating ? '📍 取得中...' : '📍 現在地'}
            </button>
          </div>
        </div>
        {originWarning && (
          <p className="mt-2 text-[12px] text-orange-600 font-medium bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
            ⚠️ {originWarning}
          </p>
        )}
      </div>

      <div className={secClass}>
        <div className={LClass}><span>👥</span> 人数 <span className={RClass}>必須</span></div>
        <div className="flex flex-wrap gap-5">
          {[{ l: "大人", v: ad, s: setAd }, { l: "子ども", v: ch, s: setCh }, { l: "シニア", v: sr, s: setSr }].map(({ l, v, s }) => (
            <div key={l} className="flex items-center gap-2">
              <span className="text-[13px] text-brown-800 font-medium min-w-[40px]">{l}</span>
              <button className={stepBtn} onClick={() => s(Math.max(0, v - 1))}>−</button>
              <span className="text-lg font-bold min-w-[24px] text-center text-brown-900">{v}</span>
              <button className={stepBtn} onClick={() => s(Math.min(10, v + 1))}>+</button>
            </div>
          ))}
        </div>
      </div>

      <div className={secClass}>
        <div className={LClass}><span>💰</span> 予算（税込合計） <span className={RClass}>必須</span></div>
        <div className="text-center mb-3">
          <span className="text-4xl font-black text-brown-700 font-['Zen_Kaku_Gothic_New']">
            {(budget / 10000).toFixed(budget % 10000 === 0 ? 0 : 1)}
          </span>
          <span className="text-base font-bold text-brown-500 ml-1">万円</span>
          {tp > 0 && <div className="text-[12px] text-brown-500 mt-0.5 font-medium">(一人あたり約 {formatYen(Math.ceil(budget / tp))})</div>}
        </div>
        <input 
          type="range" min={5000} max={300000} step={5000} value={budget} onChange={e => setBudget(+e.target.value)} 
          className="w-full h-1.5 bg-brown-300 rounded-lg appearance-none cursor-pointer accent-brown-700"
        />
        <div className="flex justify-between text-[10px] text-brown-400 mt-1.5 font-medium">
          <span>5,000円</span><span>30万円</span>
        </div>
      </div>

      <div className={secClass}>
        <div className={LClass}><span>📅</span> 日程 <span className={RClass}>必須</span></div>
        <div className="flex gap-2">
          {SCHEDULES.map((s, i) => (
            <button key={s.key} className={`flex-1 ${chipBase} ${si === i ? chipOn : chipOff}`} onClick={() => { setSi(i); if (now && i !== 0) nowOff(); }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className={secClass}>
        <div className={LClass}><span>🚄</span> 移動手段 <span className={OClass}>任意</span></div>
        <div className="flex flex-wrap gap-2">
          {TRANSPORT_OPTIONS.map(t => (
            <button key={t} className={`${chipBase} ${tf.includes(t) ? chipOn : chipOff}`} onClick={() => tog(tf, setTf, t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className={secClass}>
        <div className={LClass}><span>🏷️</span> テーマ <span className={OClass}>任意</span></div>
        <div className="flex flex-wrap gap-2">
          {THEMES.map(t => (
            <button key={t} className={`${chipBase} ${th.includes(t) ? chipOn : chipOff}`} onClick={() => tog(th, setTh, t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className={secClass}>
        <div className={LClass}><span>🎯</span> シーン <span className={OClass}>任意</span></div>
        <div className="flex flex-wrap gap-2">
          {SCENES.map(s => (
            <button key={s} className={`${chipBase} ${sf.includes(s) ? chipOn : chipOff}`} onClick={() => tog(sf, setSf, s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="text-center mt-6">
        {tp > 0 && (
          <p className="text-[13px] text-brown-600 font-bold mb-3">
            現在の条件で
            <span className="text-brown-800 text-[18px] mx-1.5">{resultCount}</span>
            件の旅行先が見つかります
          </p>
        )}
        <button 
          className={`w-full max-w-[360px] py-4 px-8 text-[17px] font-bold rounded-2xl transition-all duration-300 shadow-lg ${
            tp === 0 
              ? "bg-brown-400 text-white/70 cursor-not-allowed shadow-none" 
              : "bg-gradient-to-r from-brown-700 to-[#74593a] text-white hover:scale-[1.02] hover:shadow-brown-700/30 active:scale-95"
          }`}
          disabled={tp === 0} 
          onClick={handleSearch}
        >
          {now ? "⚡ 今すぐ行ける場所を探す" : "この条件で検索する →"}
        </button>
      </div>
    </div>
  );
}
