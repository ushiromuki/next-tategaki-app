"use client";

import { useEffect, useState } from "react";
import { Stage, Container, Text } from "@pixi/react";
import { Application, TextStyle } from "pixi.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const KINSOKU_START = "、。，．・：；？！ー）］｝〕〉》」』】｠〙〜";
const KINSOKU_END = "（［｛〔〈《「『【｟〘";

const FONTS = [
  { name: "Noto Sans JP", value: "Noto Sans JP" },
  { name: "Sawarabi Mincho", value: "Sawarabi Mincho" },
  { name: "M PLUS Rounded 1c", value: "M PLUS Rounded 1c" },
];

function splitTextWithKinsoku(text: string, maxChars: number): string[] {
  const result: string[] = [];
  let currentLine = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (currentLine.length >= maxChars) {
      while (
        currentLine.length > 0 &&
        KINSOKU_START.includes(currentLine[currentLine.length - 1])
      ) {
        const lastChar = currentLine[currentLine.length - 1];
        currentLine = currentLine.slice(0, -1);
        text = lastChar + text.slice(i);
        i--;
      }
      result.push(currentLine);
      currentLine = "";
    }

    if (currentLine.length === 0 && KINSOKU_END.includes(char)) {
      if (result.length > 0) {
        result[result.length - 1] += char;
      } else {
        currentLine += char;
      }
    } else {
      currentLine += char;
    }
  }

  if (currentLine.length > 0) {
    result.push(currentLine);
  }

  return result;
}

export default function TategakiRenderer() {
  const [text, setText] = useState("こんにちは、世界！\n改行のテストです。");
  const [lines, setLines] = useState<string[]>([]);
  const [font, setFont] = useState("Noto Sans JP");
  const [fontSize, setFontSize] = useState(24);
  const [charsPerLine, setCharsPerLine] = useState(15);
  const [app, setApp] = useState<Application | null>(null);

  useEffect(() => {
    const input = document.getElementById("text-input") as HTMLTextAreaElement;
    const button = document.querySelector("button");

    const handleClick = () => {
      setText(input.value);
    };

    button?.addEventListener("click", handleClick);

    return () => {
      button?.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const splitText = text
      .split("\n")
      .flatMap((line) => splitTextWithKinsoku(line, charsPerLine));
    setLines(splitText);
  }, [text, charsPerLine]);

  const [fontStyle, setFontStyle] = useState(
    new TextStyle({
      fontFamily: font,
      fontSize: fontSize,
      fill: "#000000",
      wordWrap: true,
    }),
  );

  useEffect(() => {
    setFontStyle(
      new TextStyle({
        fontFamily: font,
        fontSize: fontSize,
        fill: "#000000",
        wordWrap: true,
      }),
    );
  }, [font, fontSize]);

  const handleDownload = () => {
    if (app) {
      const renderer = app.renderer as PIXI.Renderer;
      const container = app.stage.children[0] as PIXI.Container;
      const texture = renderer.generateTexture(container);
      const canvas = renderer.extract.canvas(texture);
      if (canvas) {
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "tategaki.png";
        link.href = dataURL;
        link.click();
      } else {
        console.error("Canvas extraction failed.");
      }
    }
  };

  return (
    <div>
      <div className="mb-4 space-y-2">
        <Select onValueChange={setFont} defaultValue={font}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="フォントを選択" />
          </SelectTrigger>
          <SelectContent>
            {FONTS.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div>
          <label
            htmlFor="font-size"
            className="block text-sm font-medium text-gray-700"
          >
            フォントサイズ: {fontSize}px
          </label>
          <Slider
            id="font-size"
            min={12}
            max={48}
            step={1}
            value={[fontSize]}
            onValueChange={(value) => setFontSize(value[0])}
          />
        </div>
        <div>
          <label
            htmlFor="chars-per-line"
            className="block text-sm font-medium text-gray-700"
          >
            1行あたりの文字数: {charsPerLine}
          </label>
          <Slider
            id="chars-per-line"
            min={5}
            max={30}
            step={1}
            value={[charsPerLine]}
            onValueChange={(value) => setCharsPerLine(value[0])}
          />
        </div>
        <Button onClick={handleDownload}>画像としてダウンロード</Button>
      </div>
      <Stage
        width={400}
        height={400}
        options={{ backgroundColor: 0xffffff }}
        onMount={(app) => setApp(app)}
      >
        <Container>
          {lines.map((line, lineIndex) => (
            <Container key={lineIndex} x={380 - lineIndex * (fontSize * 1.5)}>
              {line.split("").map((char, charIndex) => (
                <Text
                  key={charIndex}
                  text={char}
                  x={0}
                  y={20 + charIndex * (fontSize * 1.5)}
                  style={fontStyle}
                />
              ))}
            </Container>
          ))}
        </Container>
      </Stage>
    </div>
  );
}
