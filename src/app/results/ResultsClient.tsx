"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchDests, fetchTransportCost, LodgingGrade, TransportData } from '@/lib/search';
import { getNearestStation, getDestinationStation, isStaticOrigin } from '@/lib/location';
import { SCHEDULES } from '@/data/constants';
import destinationsJson from '@/data/destinations.json';
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
  const {
    initialBudget, origin, adults, children, seniors,
    si, themes, transportFilter, sceneFilter, sort, pp, lodgingGrade,
  } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const [budget, setBudget] = useState(initialBudget);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 動的交通費データ（非静的出発地のときAPIで取得）
  const [transportData, setTransportData] = useState<Map<string, TransportData> | null>(null);
  const [transportLoading, setTransportLoading] = useState(false);
  const [originError, setOriginError] = useState<string | null>(null);

  const nights = SCHEDULES[si]?.nights || 0;

  // 非静的出発地のとき交通費をAPI取得
  useEffect(() => {
    setTransportData(null);
    setOriginError(null);

    if (isStaticOrigin(origin)) return;

    const fromStation = getNearestStation(origin);
    if (!fromStation) {
      setOriginError('対応していない出発地です。お近くの主要都市名でお試しください。');
      return;
    }

    setTransportLoading(true);

    // 全目的地の交通費を並列取得（5件ずつバッチ）
    const dests = destinationsJson as Array<{ id: string }>;
    const BATCH = 5;

    (async () => {
      const map = new Map<string, TransportData>();
      for (let i = 0; i < dests.length; i += BATCH) {
        const batch = dests.slice(i, i + BATCH);
        const results = await Promise.all(
          batch.map(async d => {
            const toStation = getDestinationStation(d.id);
            if (!toStation) return null;
            const data = await fetchTransportCost(fromStation, toStation);
            return data ? ([d.id, data] as [string, TransportData]) : null;
          })
        );
        results.forEach(r => r && map.set(r[0], r[1]));
      }
      setTransportData(map);
      setTransportLoading(false);
    })();
  }, [origin]);

  const handleBudgetChange = useCallback((value: number) => {
    setBudget(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('budget', value.toString());
      router.replace(`/results?${params.toString()}`, { scroll: false });
    }, 300);
  }, [router, searchParams]);

  const results = useMemo(() => searchDests({
    origin, adults, children, seniors, budget, nights,
    themes, transportFilter, sceneFilter, sort, lodgingGrade,
    transportData: transportData ?? undefined,
  }), [origin, adults, children, seniors, budget, nights,
       themes, transportFilter, sceneFilter, sort, lodgingGrade, transportData]);

  const gradeLabel = lodgingGrade === 'premium' ? 'プレミアム'
    : lodgingGrade === 'standard' ? 'スタンダード' : 'エコノミー';
  const queryString = searchParams.toString();

  return (
    <>
      <BudgetSlider
        initialBudget={budget}
        onChange={handleBudgetChange}
        resultCount={results.length}
      />

      {/* 出発地エラー */}
      {originError && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4 text-[13px] text-orange-700 font-medium">
          ⚠️ {originError}
        </div>
      )}

      {/* 交通費取得中バナー */}
      {transportLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 text-[13px] text-blue-700 font-medium animate-pulse">
          🔍 {origin}からの交通費を取得中です（概算値で表示中）…
        </div>
      )}

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
