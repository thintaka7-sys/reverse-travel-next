import React, { Suspense } from 'react';
import Link from 'next/link';
import { LodgingGrade } from '@/lib/search';
import { SCHEDULES } from '@/data/constants';
import ResultsClient from './ResultsClient';

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

      <Suspense fallback={<div className="h-16 bg-white rounded-2xl animate-pulse mb-4" />}>
        <ResultsClient
          initialBudget={budget}
          origin={origin}
          adults={adults}
          children={children}
          seniors={seniors}
          si={si}
          now={now}
          themes={themes}
          transportFilter={transportFilter}
          sceneFilter={sceneFilter}
          sort={sort}
          pp={pp}
          lodgingGrade={lodgingGrade}
        />
      </Suspense>
    </div>
  );
}
