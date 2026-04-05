import React, { Suspense } from 'react';
import Link from 'next/link';
import { searchDests, LodgingGrade } from '@/lib/search';
import { SCHEDULES } from '@/data/constants';
import BudgetSlider from '@/components/BudgetSlider';
import DestinationCard from '@/components/DestinationCard';
import ResultsClientToolbar from './ResultsClientToolbar';

export default function ResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const origin = searchParams.origin || "東京";
  const adults = parseInt(searchParams.adults || "2", 10);
  const children = parseInt(searchParams.children || "0", 10);
  const seniors = parseInt(searchParams.seniors || "0", 10);
  const budget = parseInt(searchParams.budget || "100000", 10);
  const si = parseInt(searchParams.si || "1", 10);
  const now = searchParams.now === "1";
  const themes = searchParams.th ? searchParams.th.split(",") : [];
  const transportFilter = searchParams.tf ? searchParams.tf.split(",") : [];
  const sceneFilter = searchParams.sf ? searchParams.sf.split(",") : [];
  const sort = searchParams.sort || "cost";
  const pp = searchParams.pp === "1";
  const lodgingGrade = (searchParams.lg as LodgingGrade) || 'budget';

  const nights = SCHEDULES[si]?.nights || 0;

  const results = searchDests({
    origin, adults, children, seniors, budget, nights, themes, transportFilter, sceneFilter, sort, lodgingGrade
  });

  const gradeLabel = lodgingGrade === 'premium' ? 'プレミアム' : lodgingGrade === 'standard' ? 'スタンダード' : 'エコノミー';

  return (
    <div className="animate-fu pb-6">
      <div className="flex justify-between items-center my-3 flex-wrap gap-2">
        <Link
          href="/"
          className="bg-transparent text-brown-700 border-[1.5px] border-brown-700 px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-brown-700 hover:text-white transition-colors active:scale-95"
        >
          ← 条件を変更
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] text-brown-600 font-medium bg-white px-3 py-1.5 rounded-lg shadow-sm border border-brown-100">
            {origin}発 / {SCHEDULES[si]?.label}
          </span>
          {now && <span className="text-[11px] bg-red-500 text-white px-2 py-1 rounded-md font-bold shadow-sm">⚡ 今すぐ</span>}
        </div>
      </div>

      <Suspense fallback={<div>Loading budget...</div>}>
        <BudgetSlider initialBudget={budget} />
      </Suspense>

      <div className="flex justify-between items-start mb-4 flex-wrap gap-2 md:flex-row flex-col">
        <div className="text-[15px] font-bold text-brown-900 md:text-left text-center pt-1">
          {results.length} 件の旅行先候補
          <span className="ml-2 text-[11px] font-normal text-brown-500">（宿泊：{gradeLabel}）</span>
        </div>

        <Suspense fallback={<div />}>
          <ResultsClientToolbar currentSort={sort} currentPp={pp} currentGrade={lodgingGrade} />
        </Suspense>
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
            <DestinationCard key={d.id} d={d} pp={pp} index={i} queryString={new URLSearchParams(searchParams as Record<string, string>).toString()} />
          ))}
        </div>
      )}

      {/* 免責表示 */}
      <p className="text-center text-[11px] text-brown-400 mt-6 px-4">
        ※ 宿泊費は目安です。実際の料金は
        <a href="https://www.jalan.net/" target="_blank" rel="noopener noreferrer" className="underline hover:text-brown-600">じゃらん</a>・
        <a href="https://travel.rakuten.co.jp/" target="_blank" rel="noopener noreferrer" className="underline hover:text-brown-600">楽天トラベル</a>
        でご確認ください。
      </p>
    </div>
  );
}
