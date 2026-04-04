"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export default function ResultsClientToolbar({ currentSort, currentPp }: { currentSort: string, currentPp: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/results?${params.toString()}`);
  };

  const filterBtn = "text-[11px] px-3 py-1.5 rounded-full border-[1.5px] font-medium transition-all duration-200 active:scale-95";

  return (
    <div className="flex gap-2 items-center flex-wrap justify-center bg-white p-1.5 rounded-2xl shadow-sm border border-brown-100/30">
      <button className={`${filterBtn} ${!currentPp ? 'bg-brown-700 text-white border-brown-700' : 'bg-transparent text-brown-600 border-transparent hover:bg-brown-50'}`} onClick={() => setParam("pp", "0")}>合計</button>
      <button className={`${filterBtn} ${currentPp ? 'bg-brown-700 text-white border-brown-700' : 'bg-transparent text-brown-600 border-transparent hover:bg-brown-50'}`} onClick={() => setParam("pp", "1")}>1人あたり</button>
      <span className="text-brown-300">|</span>
      {[["cost", "安い順"], ["time", "近い順"], ["fit", "予算順"]].map(([k, l]) => (
        <button key={k} className={`${filterBtn} ${currentSort === k ? 'bg-brown-200 text-brown-800 border-brown-200' : 'bg-transparent text-brown-500 border-transparent hover:bg-brown-50'}`} onClick={() => setParam("sort", k)}>{l}</button>
      ))}
    </div>
  );
}
