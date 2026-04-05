"use client";

import dynamic from 'next/dynamic';
import type { Destination } from '@/types';
import type { calcCost } from '@/lib/search';

type Result = Destination & {
  cost: NonNullable<ReturnType<typeof calcCost>>;
  budgetRatio: number;
};

interface Props {
  results: Result[];
  queryString: string;
}

const MapViewInner = dynamic(() => import('./MapViewInner'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-brown-50 rounded-2xl border border-brown-100" style={{ height: '65vh' }}>
      <div className="text-brown-500 text-[14px] font-medium animate-pulse">🗺️ 地図を読み込み中...</div>
    </div>
  ),
});

export default function MapView({ results, queryString }: Props) {
  return <MapViewInner results={results} queryString={queryString} />;
}
