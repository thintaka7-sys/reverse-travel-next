"use client";

import React, { useState } from 'react';

interface BudgetSliderProps {
  initialBudget: number;
  onChange?: (budget: number) => void;
  resultCount?: number;
}

export default function BudgetSlider({ initialBudget, onChange, resultCount }: BudgetSliderProps) {
  const [budget, setBudget] = useState(initialBudget);
  const [showSlider, setShowSlider] = useState(false);

  const formatYen = (n: number) => n.toLocaleString("ja-JP") + "円";

  const handleChange = (value: number) => {
    setBudget(value);
    onChange?.(value);
  };

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
            type="range" min={5000} max={300000} step={5000} value={budget}
            onChange={e => handleChange(+e.target.value)}
            className="w-full h-1.5 bg-brown-300 rounded-lg appearance-none cursor-pointer accent-brown-700"
          />
          <div className="flex justify-between text-[10px] text-brown-400 mt-1.5 font-medium">
            <span>5,000円</span><span>30万円</span>
          </div>
          {resultCount !== undefined && (
            <p className="text-center text-[12px] text-brown-600 font-bold mt-2">
              この予算で行ける場所が
              <span className="text-brown-800 text-[15px] mx-1">{resultCount}</span>
              件あります
            </p>
          )}
        </div>
      )}
    </div>
  );
}
