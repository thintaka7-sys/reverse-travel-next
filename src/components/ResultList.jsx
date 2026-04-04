import React from 'react';
import { SCHEDULES } from '../data/travelData';
import { formatYen, formatMin } from '../utils/helpers';

function BudgetBadge({ ratio }) {
  const [c, t, bg] = ratio <= 0.7 
    ? ["#16a34a", "余裕あり", "bg-green-500/10"] 
    : ratio <= 0.95 
      ? ["#ca8a04", "ちょうど", "bg-yellow-500/10"] 
      : ["#dc2626", "ギリギリ", "bg-red-500/10"];
      
  return (
    <span 
      className={`font-bold text-[11px] px-2.5 py-1 ${bg} rounded-lg backdrop-blur-sm border border-white/40 shadow-sm`}
      style={{ color: c }}
    >
      ◉ {t}
    </span>
  );
}

export default function ResultList({
  sorted, nav, origin, si, now, budget, setBudget,
  showSlider, setShowSlider, pp, setPp, sort, setSort
}) {
  const filterBtn = "text-[11px] px-3 py-1.5 rounded-full border-[1.5px] font-medium transition-all duration-200 active:scale-95";

  return (
    <div className="animate-fu pb-6">
      <div className="flex justify-between items-center my-3 flex-wrap gap-2">
        <button 
          className="bg-transparent text-brown-700 border-[1.5px] border-brown-700 px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-brown-700 hover:text-white transition-colors active:scale-95"
          onClick={() => nav("search")}
        >
          ← 条件を変更
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] text-brown-600 font-medium bg-white px-3 py-1.5 rounded-lg shadow-sm border border-brown-100">
            {origin}発 / {SCHEDULES[si].label}
          </span>
          {now && <span className="text-[11px] bg-red-500 text-white px-2 py-1 rounded-md font-bold shadow-sm">⚡ 今すぐ</span>}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-brown-100/50">
        <div className="flex justify-between items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowSlider(!showSlider)}>
          <span className="text-[13px] font-bold text-brown-800">
            💰 予算: <span className="text-brown-700 font-black ml-1 text-lg">{formatYen(budget)}</span>
          </span>
          <span className="text-[12px] text-brown-500 font-semibold bg-brown-50 px-2.5 py-1 rounded-md">{showSlider ? "▲ 閉じる" : "▼ 調整する"}</span>
        </div>
        {showSlider && (
          <div className="mt-4 animate-fu">
            <input 
              type="range" min={5000} max={300000} step={5000} value={budget} onChange={e => setBudget(+e.target.value)} 
              className="w-full h-1.5 bg-brown-300 rounded-lg appearance-none cursor-pointer accent-brown-700"
            />
            <div className="flex justify-between text-[10px] text-brown-400 mt-1.5 font-medium">
              <span>5,000円</span><span>30万円</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-2 md:flex-row flex-col md:items-center items-stretch">
        <div className="text-[15px] font-bold text-brown-900 md:text-left text-center">{sorted.length} 件の旅行先候補</div>
        <div className="flex gap-2 items-center flex-wrap justify-center bg-white p-1.5 rounded-2xl shadow-sm border border-brown-100/30">
          <button className={`${filterBtn} ${!pp ? 'bg-brown-700 text-white border-brown-700' : 'bg-transparent text-brown-600 border-transparent hover:bg-brown-50'}`} onClick={() => setPp(false)}>合計</button>
          <button className={`${filterBtn} ${pp ? 'bg-brown-700 text-white border-brown-700' : 'bg-transparent text-brown-600 border-transparent hover:bg-brown-50'}`} onClick={() => setPp(true)}>1人あたり</button>
          <span className="text-brown-300">|</span>
          {[["cost", "安い順"], ["time", "近い順"], ["fit", "予算順"]].map(([k, l]) => (
            <button key={k} className={`${filterBtn} ${sort === k ? 'bg-brown-200 text-brown-800 border-brown-200' : 'bg-transparent text-brown-500 border-transparent hover:bg-brown-50'}`} onClick={() => setSort(k)}>{l}</button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 px-5 text-brown-500 bg-white/50 rounded-3xl border border-brown-200/50">
          <div className="text-5xl mb-4 grayscale opacity-60">🗺️</div>
          <div className="text-[16px] font-bold text-brown-700">条件に合う旅行先が見つかりませんでした</div>
          <div className="text-[13px] mt-2">予算を上げるか、こだわりの条件を外してみてください。</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map((d, i) => (
            <div 
              key={d.id} 
              className="group flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden cursor-pointer animate-fu transition-all duration-400 ease-out hover:-translate-y-1.5 border border-brown-100/30 shadow-[0_4px_16px_-4px_rgba(44,36,24,0.08)] hover:shadow-[0_20px_32px_-8px_rgba(139,111,71,0.25)]" 
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }} 
              onClick={() => nav("detail", d)}
            >
              <div className="w-full md:w-[180px] h-[160px] md:h-auto shrink-0 relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-center bg-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${d.imageUrl})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
                <div className="absolute bottom-3 left-3 md:bottom-2 md:left-2 flex gap-2">
                  <BudgetBadge ratio={d.budgetRatio} />
                  <span className="md:hidden text-white font-bold text-sm drop-shadow-md px-1">{d.name}</span>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col justify-between min-w-0 bg-white relative">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 hidden md:block">
                      <h3 className="text-lg font-bold text-[#3d3225] m-0 truncate group-hover:text-brown-700 transition-colors">{d.name}</h3>
                      <div className="text-[11px] text-brown-500 font-medium mt-0.5">{d.prefecture}</div>
                    </div>
                    <div className="text-right shrink-0 md:static absolute top-4 right-4">
                      <div className="text-xl md:text-[22px] font-black text-brown-700 tracking-tight">{formatYen(pp ? d.cost.perPerson : d.cost.total)}</div>
                      <div className="text-[10px] text-brown-400 font-semibold">{pp ? "1人あたり" : "合計"}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-3 pr-20 md:pr-0">
                    {d.themes.map(t => <span key={t} className="text-[10px] bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-md font-bold">{t}</span>)}
                    {d.scene?.slice(0, 2).map(s => <span key={s} className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-md font-bold">{s}</span>)}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-brown-50">
                  <span className="text-[12px] text-brown-600 font-medium flex items-center gap-1.5 flex-wrap">
                    <span className="text-brown-400">🚃</span> {d.cost.method} <span className="font-bold">約{formatMin(d.cost.minutes)}</span>
                    {d.cost.isEstimated && <span className="text-[10px] bg-orange-50 text-orange-600 border border-orange-200 px-1.5 py-0.5 rounded shadow-sm ml-1 font-bold">概算</span>}
                  </span>
                  <span className="text-[12px] text-brown-700 font-bold bg-brown-50 px-3 py-1.5 rounded-lg group-hover:bg-brown-700 group-hover:text-white transition-colors">
                    詳細を見る →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
