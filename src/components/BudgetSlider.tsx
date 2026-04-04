"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BudgetSlider({ initialBudget }: { initialBudget: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [budget, setBudget] = useState(initialBudget);
  const [showSlider, setShowSlider] = useState(false);

  // When slider is released or changed via a dedicated button, we update URL
  // Here we'll just update it instantly or add a button to apply
  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('budget', budget.toString());
    router.push(`/results?${params.toString()}`);
  };

  const formatYen = (n: number) => n.toLocaleString("ja-JP") + "円";

  return (
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
          <div className="flex justify-between text-[10px] text-brown-400 mt-1.5 font-medium mb-3">
            <span>5,000円</span><span>30万円</span>
          </div>
          <button 
            className="w-full py-2 bg-brown-700 text-white rounded-lg text-sm font-bold shadow-sm active:scale-95 transition-all"
            onClick={handleApply}
          >
            この予算で再検索
          </button>
        </div>
      )}
    </div>
  );
}
