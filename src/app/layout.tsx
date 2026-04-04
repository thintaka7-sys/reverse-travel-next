import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "逆算型旅行サイト - 旅さがし",
  description: "予算と条件から行ける旅行先を逆算します",
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
