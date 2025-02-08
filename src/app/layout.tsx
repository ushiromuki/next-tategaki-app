import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "縦書きテキストレンダラー",
  description: "日本語テキストを縦書きで描画するツール",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Noto+Serif+JP&family=Sawarabi+Mincho&family=M+PLUS+Rounded+1c&family=Zen+Antique&family=Yuji+Mincho&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
