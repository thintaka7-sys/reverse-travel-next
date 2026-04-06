import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: '旅さがし | 予算から旅行先を逆算して探せるサービス',
  description: '予算・人数・日程を入力するだけで、行ける旅行先を自動提案。じゃらん・楽天では「行き先を決めてから検索」だが、旅さがしは逆算で候補を出します。',
  keywords: ['旅行', '予算', '旅行先探し', '日帰り旅行', '逆算', '旅行計画'],
  openGraph: {
    title: '旅さがし | 予算から旅行先を逆算',
    description: '予算・人数・日程を入れるだけで行ける場所がわかる逆算型旅行サービス',
    url: 'https://tabi-sagashi.netlify.app',
    siteName: '旅さがし',
    images: [
      {
        url: 'https://tabi-sagashi.netlify.app/ogp.png',
        width: 1200,
        height: 630,
        alt: '旅さがし - 予算から旅行先を逆算',
      }
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '旅さがし | 予算から旅行先を逆算',
    description: '予算・人数・日程を入れるだけで行ける場所がわかる逆算型旅行サービス',
    images: ['https://tabi-sagashi.netlify.app/ogp.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans min-h-screen bg-gradient-to-b from-brown-50 to-brown-100 text-brown-950">
        <div className="max-w-[900px] mx-auto px-4">
          <header className="pt-8 pb-4 text-center">
            <div className="inline-block group cursor-pointer hover:opacity-80 transition-opacity">
              <a href="/">
                <div className="text-[10px] tracking-[6px] text-brown-500 font-bold mb-1 ml-1.5 transition-colors group-hover:text-brown-700">REVERSE TRAVEL SEARCH</div>
                <h1 className="font-['Zen_Kaku_Gothic_New'] text-3xl font-black text-brown-900 tracking-widest my-0">旅さがし</h1>
                <div className="w-10 h-1 bg-brown-700 mx-auto mt-2.5 rounded-full transition-all group-hover:w-16" />
              </a>
            </div>
          </header>
          <main className="py-2">
            {children}
          </main>
          <footer className="text-center pt-8 pb-6 text-[11px] text-brown-400 font-medium">
            ※ 表示される費用は概算です。実際の費用と異なる場合があります。
          </footer>
        </div>
      </body>
    </html>
  );
}
