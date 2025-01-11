"use client";

import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const TategakiRenderer = dynamic(
  () => Promise.resolve(import("../components/TategakiRenderer")),
  {
    ssr: false,
  },
);

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">縦書きテキストレンダラー</h1>
      <div className="mb-4">
        <Textarea
          placeholder="テキストを入力してください"
          id="text-input"
          className="mb-2"
          rows={4}
        />
        <Button>描画</Button>
      </div>
      <TategakiRenderer />
    </div>
  );
}
