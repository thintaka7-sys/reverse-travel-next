import React from 'react';
import { formatYen } from '../utils/helpers';

export default function DetailView({ sel, nights, nav }) {
  const ck = nights === 0 ? "dayTrip" : "overnight", co = sel.modelCourse?.[ck] || [];
  
  const sectionClass = "bg-white rounded-2xl p-5 mb-4 shadow-sm border border-brown-100/50 hover:shadow-md transition-shadow duration-300";
  const headingClass = "text-[16px] font-bold text-[#5c4a32] mb-4 flex items-center gap-2 border-b border-brown-100 pb-2";

  return (
    <div className="animate-fu pb-6">
      <div className="flex justify-between items-center mb-4">
        <button 
          className="bg-white text-brown-700 border-[1.5px] border-brown-200 px-4 py-2 rounded-xl text-[13px] font-bold hover:border-brown-700 hover:bg-brown-50 transition-all active:scale-95 shadow-sm"
          onClick={() => nav("results")}
        >
          ← 一覧に戻る
        </button>
        <span className="text-xs bg-brown-700 text-white px-3 py-1 rounded-full font-bold shadow-sm">
          {nights === 0 ? "日帰り" : `${nights}泊`}コース
        </span>
      </div>

      <div className="rounded-3xl overflow-hidden mb-5 relative group shadow-lg">
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        <img 
          src={sel.imageUrl} 
          className="w-full h-[240px] object-cover transition-transform duration-700 ease-out group-hover:scale-105 relative z-10" 
          alt={sel.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
          <h2 className="text-white text-3xl font-black m-0 drop-shadow-md tracking-tight mb-1">{sel.name}</h2>
          <span className="text-white/90 text-sm font-medium bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-sm">{sel.prefecture}</span>
        </div>
      </div>

      <p className="text-[14px] leading-[1.8] text-brown-800 mb-5 px-1 font-medium">{sel.description}</p>

      <div className={sectionClass}>
        <div className="flex flex-wrap gap-2.5 mb-4">
          {sel.scene?.map(s => (
            <span key={s} className="text-[12px] bg-blue-50/80 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg font-bold">
              {s} 向き
            </span>
          ))}
        </div>
        {sel.season && (
          <div className="text-[13px] text-brown-800 leading-[1.7] bg-[#faf7f2] border border-brown-200/60 rounded-xl p-4 font-medium relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
            <span className="font-bold text-orange-600 block mb-1">🌸 季節のポイント</span>
            {sel.season}
          </div>
        )}
      </div>

      <div className={sectionClass}>
        <h3 className={headingClass}>💴 費用内訳 <span className="text-[10px] font-normal text-brown-400 ml-auto bg-brown-50 px-2 py-0.5 rounded-md">全員分・概算</span></h3>
        <div className="space-y-3">
          {[{ l: "交通費（往路・復路）", v: sel.cost.transport }, { l: "宿泊費目安", v: sel.cost.lodging }, { l: "食費・雑費目安", v: sel.cost.food }].map(({ l, v }) => (
            <div key={l} className="flex justify-between text-[14px] items-center">
              <span className="text-brown-600 font-medium">{l}</span>
              <span className="font-bold text-[#5c4a32] bg-brown-50 px-2 py-0.5 rounded-md">{formatYen(v)}</span>
            </div>
          ))}
        </div>
        <div className="border-t-[1.5px] border-dashed border-brown-200 mt-4 pt-3 flex justify-between items-end">
          <span className="font-bold text-brown-800 text-[16px]">合計費用</span>
          <div className="text-right">
            <span className="font-black text-brown-700 text-3xl tracking-tight">{formatYen(sel.cost.total)}</span>
          </div>
        </div>
        <div className="text-[12px] text-brown-500 text-right mt-1.5 font-semibold bg-orange-50 inline-block float-right px-2 py-0.5 rounded-md">
          → 1人あたり {formatYen(sel.cost.perPerson)}
        </div>
        <div className="clear-both"></div>
      </div>

      <div className={sectionClass}>
        <h3 className={headingClass}>📍 モデルコース</h3>
        <div className="mt-2 text-brown-800">
          {co.map((s, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="flex flex-col items-center w-6">
                <div className="w-3 h-3 rounded-full bg-brown-200 border-2 border-white shadow-sm z-10 shrink-0 group-hover:bg-brown-600 transition-colors mt-1" />
                {i < co.length - 1 && <div className="w-0.5 flex-1 bg-brown-100 group-hover:bg-brown-200 transition-colors my-1" />}
              </div>
              <div className="pb-5 text-[14.5px] leading-relaxed font-medium pt-0.5">
                {s}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className={headingClass}>🏯 周辺の人気スポット</h3>
        <div className="flex flex-wrap gap-2">
          {sel.spots.map(s => (
            <span key={s} className="text-[13px] bg-white border border-brown-200 text-brown-700 px-3.5 py-1.5 rounded-xl font-bold shadow-sm hover:shadow hover:-translate-y-0.5 transition-all cursor-default">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className={headingClass}>🔗 手配・詳細へ進む</h3>
        <div className="flex flex-col gap-3">
          <a href={sel.externalLinks.jalan} target="_blank" rel="noopener noreferrer" 
             className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl text-center text-[15px] font-bold transition-colors shadow-sm shadow-orange-500/20 active:scale-[0.98]">
             じゃらんnetで宿を探す・予約する
          </a>
          <a href={`https://www.google.com/maps/search/${encodeURIComponent(sel.name)}`} target="_blank" rel="noopener noreferrer" 
             className="bg-white border-[1.5px] border-blue-500 text-blue-600 hover:bg-blue-50 p-3.5 rounded-xl text-center text-[14px] font-bold transition-colors active:scale-[0.98]">
             Googleマップで周辺を見る
          </a>
        </div>
      </div>
    </div>
  );
}
