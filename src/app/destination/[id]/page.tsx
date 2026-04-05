import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import destinationsJson from '@/data/destinations.json';
import { Destination } from '@/types';
import { SCHEDULES } from '@/data/constants';
import { calcCost, LodgingGrade } from '@/lib/search';
import YahooCredit from '@/components/YahooCredit';

function formatYen(n: number) { return n.toLocaleString("ja-JP") + "円"; }

export default function DestinationDetail({
  params,
  searchParams,
}: {
  params: { id: string },
  searchParams: { [key: string]: string | undefined }
}) {
  const d = (destinationsJson as Destination[]).find(dest => dest.id === params.id);
  if (!d) return notFound();

  const si = parseInt(searchParams.si || "1", 10);
  const nights = SCHEDULES[si]?.nights || 0;
  const origin = searchParams.origin || "東京";
  const adults = parseInt(searchParams.adults || "2", 10);
  const children = parseInt(searchParams.children || "0", 10);
  const seniors = parseInt(searchParams.seniors || "0", 10);
  const lodgingGrade = (searchParams.lg as LodgingGrade) || 'budget';

  const cost = calcCost(d, origin, nights, adults, children, seniors, lodgingGrade);

  return (
    <div className="animate-fu pb-6">
      <div className="mb-3">
        <Link 
          href={`/results?${new URLSearchParams(searchParams as Record<string, string>).toString()}`}
          className="bg-transparent text-brown-700 border-[1.5px] border-brown-700 px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-brown-700 hover:text-white transition-colors active:scale-95 inline-block"
        >
          ← 検索結果に戻る
        </Link>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-brown-100/50">
        <div 
          className="h-[280px] bg-center bg-cover relative"
          style={{ backgroundImage: `url(${d.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex gap-2 items-center mb-2">
              <span className="text-[12px] bg-brown-600/80 backdrop-blur-sm px-2 py-0.5 rounded font-bold border border-white/20">{d.prefecture}</span>
            </div>
            <h2 className="text-4xl font-black drop-shadow-md">{d.name}</h2>
          </div>
        </div>

        <div className="p-6">
          <p className="text-[15px] leading-relaxed text-brown-800 font-medium mb-6">
            {d.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-brown-50 rounded-2xl p-4 border border-brown-100">
              <div className="text-[12px] font-bold text-brown-500 mb-2">🏅 特徴・テーマ</div>
              <div className="flex flex-wrap gap-1.5">
                {d.themes.map((t: string) => <span key={t} className="text-[11px] bg-white text-brown-700 border border-brown-200 px-2 py-0.5 rounded-md font-bold shadow-sm">{t}</span>)}
              </div>
            </div>
            <div className="bg-brown-50 rounded-2xl p-4 border border-brown-100">
              <div className="text-[12px] font-bold text-brown-500 mb-2">🌸 ベストシーズン</div>
              <div className="text-[13px] font-bold text-brown-800">{d.season}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-brown-900 border-b-2 border-brown-100 pb-2 mb-3 flex items-center gap-2">
              <span>📍</span> 必見スポット
            </h3>
            <div className="flex flex-wrap gap-2">
              {d.spots.map((s: string) => (
                <span key={s} className="bg-white border border-brown-200 text-brown-700 px-3 py-1.5 text-[13px] font-bold rounded-lg shadow-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-brown-900 border-b-2 border-brown-100 pb-2 mb-3 flex items-center gap-2">
              <span>🗺️</span> モデルコース ({nights === 0 ? "日帰り" : nights === 1 ? "1泊2日" : "2泊3日以上"})
            </h3>
            <div className="bg-orange-50/50 rounded-2xl p-5 border border-orange-100/50">
              <ul className="space-y-4">
                {(nights === 0 ? d.modelCourse.dayTrip : d.modelCourse.overnight).map((step: string, i: number) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="shrink-0 w-6 h-6 bg-orange-200 text-orange-800 rounded-full flex items-center justify-center text-[11px] font-black mt-0.5 shadow-sm">
                      {i + 1}
                    </div>
                    <div className="text-[14px] font-bold text-brown-800 leading-relaxed shadow-sm bg-white px-3 py-1.5 rounded-xl border border-brown-100">
                      {step}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 費用内訳 */}
          {cost && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-brown-900 border-b-2 border-brown-100 pb-2 mb-3 flex items-center gap-2">
                <span>💴</span> 費用内訳
                {cost.isEstimated && (
                  <span className="text-[10px] bg-orange-50 text-orange-600 border border-orange-200 px-1.5 py-0.5 rounded font-bold">概算</span>
                )}
              </h3>
              <div className="bg-brown-50 rounded-2xl border border-brown-100 overflow-hidden">
                <table className="w-full text-[13px]">
                  <tbody>
                    <tr className="border-b border-brown-100">
                      <td className="px-4 py-3 text-brown-600 font-medium">🚃 交通費（往復）</td>
                      <td className="px-4 py-3 text-right font-bold text-brown-900">{formatYen(cost.transport)}</td>
                    </tr>
                    <tr className="border-b border-brown-100">
                      <td className="px-4 py-3 text-brown-600 font-medium">🏨 宿泊費</td>
                      <td className="px-4 py-3 text-right font-bold text-brown-900">
                        {nights === 0 ? <span className="text-brown-400 font-medium">—（日帰りのため）</span> : formatYen(cost.lodging)}
                      </td>
                    </tr>
                    <tr className="border-b border-brown-100">
                      <td className="px-4 py-3 text-brown-600 font-medium">🍜 食費（目安）</td>
                      <td className="px-4 py-3 text-right font-bold text-brown-900">{formatYen(cost.food)}</td>
                    </tr>
                    <tr className="bg-brown-100/50">
                      <td className="px-4 py-3 font-bold text-brown-900">合計</td>
                      <td className="px-4 py-3 text-right text-[16px] font-black text-brown-700">{formatYen(cost.total)}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-[11px] text-brown-400 px-4 py-2 border-t border-brown-100">
                  ※ 概算です。交通費は{cost.method}利用・往復、宿泊費は{nights}泊分（{adults + children + seniors}名合計）の目安です。
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center border border-gray-200">
            <div>
              <div className="text-[11px] font-bold text-gray-500 mb-0.5">参考宿泊費 (1泊1名)</div>
              <div className="text-lg font-black text-gray-700">{formatYen(d.lodging.budget)} <span className="text-sm font-medium">〜</span> {formatYen(d.lodging.standard)}</div>
            </div>
            <a
              href={d.externalLinks.jalan}
              target="_blank"
              rel="noreferrer"
              className="bg-[#ff5a00] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-md hover:bg-[#e04f00] active:scale-95 transition-all"
            >
              じゃらんで探す ↗
            </a>
          </div>
        </div>
      </div>
      <YahooCredit />
    </div>
  );
}
