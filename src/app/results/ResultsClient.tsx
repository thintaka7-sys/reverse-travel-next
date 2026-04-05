"use client";

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchDests, LodgingGrade } from '@/lib/search';
import { SCHEDULES } from '@/data/constants';
import BudgetSlider from '@/components/BudgetSlider';
import DestinationCard from '@/components/DestinationCard';
import ResultsClientToolbar from './ResultsClientToolbar';

interface ResultsClientProps {
  initialBudget: number;
  origin: string;
  adults: number;
  children: number;
  seniors: number;
  si: number;
  now: boolean;
  themes: string[];
  transportFilter: string[];
  sceneFilter: string[];
  sort: string;
  pp: boolean;
  lodgingGrade: LodgingGrade;
}

export default function ResultsClient(props: ResultsClientProps) {
  const { initialBudget, origin, adults, children, seniors, si, now, themes, transportFilter, sceneFilter, sort, pp, lodgingGrade } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const [budget, setBudget] = useState(initialBudget);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nights = SCHEDULES[si]?.nights || 0;

  // スライダー変更時: 表示は即時更新、URL更新は300msデバウンス
  const handleBudgetChange = useCallback((value: number) => {
    setBudget(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('budget', value.toString());
      router.replace(`/results?${params.toString()}`, { scroll: false });
    }, 300);
  }, [router, searchParams]);

  // 予算変更のたびに再計算（useMemoで不要な再実行を防ぐ）
  const results = useMemo(() => searchDests({
    origin, adults, children, seniors, budget, nights, themes, transportFilter, sceneFilter, sort, lodgingGrade
  }), [origin, adults, children, seniors, budget, nights, themes, transportFilter, sceneFilter, sort, lodgingGrade]);

  const gradeLabel = lodgingGrade === 'premium' ? 'プレミアム' : lodgingGrade === 'standard' ? 'スタンダード' : 'エコノミー';
  const queryString = searchParams.toString();

  return (
    <>
      <BudgetSlider
        initialBudget={budget}
        onChange={handleBudgetChange}
        resultCount={results.length}
      />

      <div className="flex justify-between items-start mb-4 flex-wrap gap-2 md:flex-row flex-col">
        <div className="text-[15px] font-bold text-brown-900 md:text-left text-center pt-1">
          {results.length} 件の旅行先候補
          <span className="ml-2 text-[11px] font-normal text-brown-500">（宿泊：{gradeLabel}）</span>
        </div>
        <ResultsClientToolbar currentSort={sort} currentPp={pp} currentGrade={lodgingGrade} />
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 px-5 text-brown-500 bg-white/50 rounded-3xl border border-brown-200/50">
          <div className="text-5xl mb-4 grayscale opacity-60">🗺️</div>
          <div className="text-[16px] font-bold text-brown-700">条件に合う旅行先が見つかりませんでした</div>
          <div className="text-[13px] mt-2">予算を上げるか、こだわりの条件を外してみてください。</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.map((d, i) => (
            <DestinationCard key={d.id} d={d} pp={pp} index={i} queryString={queryString} />
          ))}
        </div>
      )}

      <p className="text-center text-[11px] text-brown-400 mt-6 px-4">
        ※ 宿泊費は目安です。実際の料金は
        <a href="https://www.jalan.net/" target="_blank" rel="noopener noreferrer" className="underline hover:text-brown-600">じゃらん</a>・
        <a href="https://travel.rakuten.co.jp/" target="_blank" rel="noopener noreferrer" className="underline hover:text-brown-600">楽天トラベル</a>
        でご確認ください。
      </p>
    </>
  );
}
