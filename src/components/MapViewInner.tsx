"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Destination } from '@/types';
import type { calcCost } from '@/lib/search';
import Link from 'next/link';

// Webpack でアイコン画像パスが壊れる問題を修正
function fixLeafletIcon() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

type Result = Destination & {
  cost: NonNullable<ReturnType<typeof calcCost>>;
  budgetRatio: number;
};

interface Props {
  results: Result[];
  queryString: string;
}

function formatYen(n: number) { return n.toLocaleString('ja-JP') + '円'; }
function formatTime(min: number) {
  return min >= 60 ? `${Math.floor(min / 60)}時間${min % 60 > 0 ? min % 60 + '分' : ''}` : `${min}分`;
}

export default function MapViewInner({ results, queryString }: Props) {
  useEffect(() => { fixLeafletIcon(); }, []);

  // 全候補地の中心を計算
  const center: [number, number] = results.length > 0
    ? [
        results.reduce((s, d) => s + d.latitude, 0) / results.length,
        results.reduce((s, d) => s + d.longitude, 0) / results.length,
      ]
    : [36.5, 136.0];

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: '65vh', width: '100%', borderRadius: '1rem' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {results.map(d => (
        <Marker key={d.id} position={[d.latitude, d.longitude]}>
          <Popup>
            <div style={{ minWidth: 160 }}>
              <div style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: '#7a6b56', marginBottom: 2 }}>
                合計 {formatYen(d.cost.total)}
              </div>
              <div style={{ fontSize: 12, color: '#7a6b56', marginBottom: 6 }}>
                {d.cost.method} 約{formatTime(d.cost.minutes)}
              </div>
              <a
                href={`/destination/${d.id}?${queryString}`}
                style={{
                  display: 'inline-block',
                  background: '#74593a',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 'bold',
                  textDecoration: 'none',
                }}
              >
                詳細を見る →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
