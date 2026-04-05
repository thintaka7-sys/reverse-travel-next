"use client";

import type { Destination } from '@/types';
import type { calcCost } from '@/lib/search';

type Result = Destination & {
  cost: NonNullable<ReturnType<typeof calcCost>>;
  budgetRatio: number;
};

interface Props {
  results: Result[];
  origin: string;
  budget: number;
  adults: number;
  children: number;
  seniors: number;
}

function formatYen(n: number) { return n.toLocaleString('ja-JP') + '円'; }

function buildShareText(results: Result[], origin: string): string {
  const top = results.slice(0, 3);
  const lines = top.map((d, i) => `${i + 1}位：${d.name}（合計 ${formatYen(d.cost.total)}）`);
  const url = typeof window !== 'undefined' ? window.location.href : 'https://gyaku-san-travel.netlify.app';
  return (
    `【逆算旅行】${origin}発で行ける旅先${top.length}選✈️\n` +
    lines.join('\n') +
    `\n#逆算旅行 #旅行計画\n${url}`
  );
}

export default function ShareButton({ results, origin, budget, adults, children, seniors }: Props) {
  if (results.length === 0) return null;

  const handleShare = async () => {
    const text = buildShareText(results, origin);
    const url = typeof window !== 'undefined' ? window.location.href : '';

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: '逆算型旅行サイト', text, url });
        return;
      } catch {
        // キャンセルされた場合は何もしない
        return;
      }
    }

    // フォールバック: X シェアウィンドウを開く
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const shareText = typeof window !== 'undefined' ? buildShareText(results, origin) : '';
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(shareText)}`;

  const btnBase = "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all active:scale-95 border";

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 my-4">
      {/* Web Share API 対応端末ではネイティブ共有ボタン */}
      <button
        onClick={handleShare}
        className={`${btnBase} bg-brown-700 text-white border-brown-700 hover:bg-brown-800 shadow-sm`}
      >
        📤 この結果をシェア
      </button>

      {/* 個別リンク（非対応端末や任意選択用） */}
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnBase} bg-black text-white border-black hover:bg-gray-800`}
      >
        𝕏 でシェア
      </a>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnBase} bg-[#06C755] text-white border-[#06C755] hover:bg-[#05b04b]`}
      >
        LINE でシェア
      </a>
    </div>
  );
}
