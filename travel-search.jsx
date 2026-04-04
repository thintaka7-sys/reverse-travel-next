import React, { useState, useMemo, useCallback, useEffect } from "react";
import { destinations, SCHEDULES, FOOD_COST } from "./src/data/travelData";
import SearchForm from "./src/components/SearchForm";
import ResultList from "./src/components/ResultList";
import DetailView from "./src/components/DetailView";
import { mapToNearestOrigin } from "./src/utils/helpers";

function calcCost(dest, originStr, nights, adults, children, seniors) {
  const { origin, isEstimated } = mapToNearestOrigin(originStr);
  const t = dest.transport[origin]; if (!t) return null;
  const p = adults + children + seniors; if (!p) return null;
  
  const baseCost = isEstimated ? t.cost + 1500 : t.cost;
  const baseMins = isEstimated ? t.minutes + 40 : t.minutes;
  
  const tr = baseCost * 2 * p, lo = nights > 0 ? dest.lodging.budget * nights * p : 0, fo = (FOOD_COST[nights] || 3000) * p;
  return { transport: tr, lodging: lo, food: fo, total: tr + lo + fo, perPerson: Math.ceil((tr + lo + fo) / p), method: t.method, minutes: baseMins, isEstimated };
}

function filterDests(params) {
  const { origin, adults, children, seniors, budget, nights, themes, transportFilter, sceneFilter } = params;
  if (adults + children + seniors === 0 || !origin) return [];
  return destinations.map(d => {
    const c = calcCost(d, origin, nights, adults, children, seniors); if (!c || c.total > budget) return null;
    if (transportFilter.length > 0) { const m = c.method; const ok = transportFilter.includes("飛行機OK") && m.includes("飛行機") || transportFilter.includes("新幹線OK") && (m.includes("新幹線") || m.includes("在来線")) || transportFilter.includes("電車のみ") && (m.includes("在来線") || m.includes("バス")); if (!ok) return null; }
    if (themes.length > 0 && !themes.some(t => d.themes.includes(t))) return null;
    if (sceneFilter.length > 0 && !sceneFilter.some(s => d.scene?.includes(s))) return null;
    return { ...d, cost: c, budgetRatio: c.total / budget };
  }).filter(Boolean).sort((a, b) => a.cost.total - b.cost.total);
}

export default function App() {
  const [pg, setPg] = useState("search"), [sel, setSel] = useState(null), [pp, setPp] = useState(false);
  const [origin, setOrigin] = useState("東京"), [ad, setAd] = useState(2), [ch, setCh] = useState(0), [sr, setSr] = useState(0);
  const [budget, setBudget] = useState(100000), [si, setSi] = useState(1), [tf, setTf] = useState([]), [th, setTh] = useState([]);
  const [sf, setSf] = useState([]), [sort, setSort] = useState("cost"), [now, setNow] = useState(false), [fade, setFade] = useState(true);
  const [showSlider, setShowSlider] = useState(false);
  const [isTailwindLoaded, setIsTailwindLoaded] = useState(false);
  
  const nights = SCHEDULES[si].nights;
  const tp = ad + ch + sr;

  // Insert Tailwind script on mount
  useEffect(() => {
    if (!document.getElementById("tailwind-script")) {
      const script = document.createElement("script");
      script.id = "tailwind-script";
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => {
        window.tailwind.config = {
          theme: {
            extend: {
              colors: {
                brown: {
                  50: '#faf7f2', 100: '#f5efe6', 200: '#e8dfd2', 300: '#ddd4c4',
                  400: '#c4b8a5', 500: '#a0937e', 600: '#8a7b68', 700: '#8b6f47',
                  800: '#6b5c4a', 900: '#5c4a32', 950: '#3d3225'
                }
              },
              fontFamily: {
                sans: ['"Noto Sans JP"', '"Hiragino Sans"', 'sans-serif'],
              },
              keyframes: {
                fu: {
                  '0%': { opacity: '0', transform: 'translateY(16px)' },
                  '100%': { opacity: '1', transform: 'translateY(0)' }
                }
              },
              animation: {
                fu: 'fu 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }
            }
          }
        };
        setIsTailwindLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setIsTailwindLoaded(true);
    }
  }, []);
  
  const res = useMemo(() => filterDests({ origin, adults: ad, children: ch, seniors: sr, budget, nights, themes: th, transportFilter: tf, sceneFilter: sf }), [origin, ad, ch, sr, budget, nights, th, tf, sf]);
  const sorted = useMemo(() => { const r = [...res]; if (sort === "time") r.sort((a, b) => a.cost.minutes - b.cost.minutes); if (sort === "fit") r.sort((a, b) => a.budgetRatio - b.budgetRatio); return r; }, [res, sort]);
  
  const nav = useCallback((p, d) => { setFade(false); setTimeout(() => { setPg(p); if (d) setSel(d); setFade(true); try { window.scrollTo?.({ top: 0, behavior: 'smooth' }); } catch(e){} }, 200); }, []);
  const nowOn = () => { setNow(true); setSi(0); setBudget(30000); };
  const nowOff = () => setNow(false);

  // Fallback while loading
  if (!isTailwindLoaded) {
    return <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif", color: "#8b6f47" }}>Loading...</div>;
  }

  return (
    <div className={`font-sans max-w-[900px] mx-auto px-4 min-h-screen bg-gradient-to-b from-brown-50 to-brown-100 text-brown-950 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      {/* Import Japanese fonts if not already in document */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Zen+Kaku+Gothic+New:wght@700;900&display=swap');`}</style>
      
      <header className="pt-8 pb-4 text-center">
        <div className="cursor-pointer inline-block group" onClick={() => nav("search")}>
          <div className="text-[10px] tracking-[6px] text-brown-500 font-bold mb-1 ml-1.5 transition-colors group-hover:text-brown-700">REVERSE TRAVEL SEARCH</div>
          <h1 className="font-['Zen_Kaku_Gothic_New'] text-3xl font-black text-brown-900 tracking-widest my-0">旅さがし</h1>
          <div className="w-10 h-1 bg-brown-700 mx-auto mt-2.5 rounded-full transition-all group-hover:w-16" />
        </div>
      </header>

      <main className="py-2">
        {pg === "search" && (
          <SearchForm 
            origin={origin} setOrigin={setOrigin} ad={ad} setAd={setAd} ch={ch} setCh={setCh} sr={sr} setSr={setSr}
            budget={budget} setBudget={setBudget} si={si} setSi={setSi} tf={tf} setTf={setTf} th={th} setTh={setTh} sf={sf} setSf={setSf}
            now={now} nowOn={nowOn} nowOff={nowOff} resCount={res.length} tp={tp} nav={nav}
          />
        )}

        {pg === "results" && (
          <ResultList 
            sorted={sorted} nav={nav} origin={origin} si={si} now={now} budget={budget} setBudget={setBudget}
            showSlider={showSlider} setShowSlider={setShowSlider} pp={pp} setPp={setPp} sort={sort} setSort={setSort}
          />
        )}

        {pg === "detail" && sel && (
          <DetailView sel={sel} nights={nights} nav={nav} />
        )}
      </main>

      <footer className="text-center pt-8 pb-6 text-[11px] text-brown-400 font-medium">
        ※ 表示される費用は概算です。実際の費用と異なる場合があります。
      </footer>
    </div>
  );
}
