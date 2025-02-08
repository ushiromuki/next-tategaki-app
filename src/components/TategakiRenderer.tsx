"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getRandomEmoji } from "../utils/emojis";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { CreateDocumentUseCase } from "../application/usecases/CreateDocumentUseCase";
import { ExportPageUseCase } from "../application/usecases/ExportPageUseCase";
import { ExportAllPagesUseCase } from "../application/usecases/ExportAllPagesUseCase";
import { SVGDocumentRepository } from "../infrastructure/repositories/SVGDocumentRepository";
import { Document } from "../domain/entities/Document";

const kinsokuStart = '、。，．・：；？！ヽヾゝゞ々ー）〕］｝〉》」』】」゛゜ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ';
const kinsokuEnd = '（〔［｛〈《「『【「';

const processKinsoku = (text: string, charsPerLine: number) => {
  const lines = text.split('\n');
  return lines.map(line => {
    let result = '';
    let currentLine = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      currentLine += char;

      if (currentLine.length === charsPerLine) {
        if (nextChar && kinsokuStart.includes(nextChar)) {
          currentLine += nextChar;
          i++;
        }
        result += currentLine + '\n';
        currentLine = '';
      }
    }

    if (currentLine) {
      result += currentLine;
    }

    return result;
  }).join('\n');
};

const VerticalTextApp = () => {
  const [username] = useLocalStorage('username', `${getRandomEmoji()}さん`);
  const [savedText, setSavedText] = useLocalStorage('editContent', "これは縦書きeditorです。\n改行もできます。");
  const [text, setText] = useState(savedText);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSavedText(text);
  }, [text, setSavedText]);

  useEffect(() => {
    alert(`こんにちは、${username}！`);
  }, []);
  const [documentX, setDocument] = useState<Document | null>(null);
  const [charsPerPage, setCharsPerPage] = useState(400);
  const [charsPerLine, setCharsPerLine] = useState(20);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('"Noto Serif JP", serif');
  const textRef = useRef(null);

  const fontOptions = [
    { label: '源ノ明朝', value: '"Noto Serif JP", serif' },
    { label: 'さわらび明朝', value: '"Sawarabi Mincho", serif' },
    { label: '源ノ角ゴシック', value: '"Noto Sans JP", sans-serif' },
    { label: 'M PLUS Rounded 1c', value: '"M PLUS Rounded 1c", sans-serif' },
    { label: '禅アンティーク', value: '"Zen Antique", serif' },
    { label: '游明朝体', value: '"Yuji Mincho", serif' },
  ];

  // Initialize use cases
  const documentRepository = new SVGDocumentRepository();
  const createDocument = new CreateDocumentUseCase(documentRepository);
  const exportPage = new ExportPageUseCase(documentRepository);
  const exportAllPages = new ExportAllPagesUseCase(documentRepository);

  const handleTextChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newText = e.target.value;
    setText(newText);
    try {
      // useCase を修正して、charsPerPage, charsPerLine を反映するようにする例です
      const processedText = processKinsoku(newText, charsPerLine);
      const newDocument = await createDocument.execute(
        processedText,
        charsPerPage,
        charsPerLine,
      );
      setDocument(newDocument);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const handleDownloadCurrentPage = async () => {
    if (!documentX) return;

    const currentPageObj = documentX.getPage(currentPage);
    if (!currentPageObj) return;

    try {
      const url = await exportPage.execute(currentPageObj);
      const link = document.createElement("a");
      link.href = url;
      link.download = `vertical-text-page-${currentPage}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading page:", error);
    }
  };

  const handleDownloadAllPages = async () => {
    if (!documentX) return;

    try {
      const urls = await exportAllPages.execute(documentX);
      urls.forEach((url, index) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = `vertical-text-page-${index + 1}.svg`;
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Error downloading all pages:", error);
    }
  };

  const textStyle = {
    writingMode: "vertical-rl" as const,
    textOrientation: "mixed" as const,
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
    height: `${charsPerLine * (fontSize * 1.7)}px`,
    width: "680px",
  };

  useEffect(() => {
    const processedText = processKinsoku(text, charsPerLine);
    createDocument.execute(processedText, charsPerPage, charsPerLine)
      .then(newDocument => setDocument(newDocument))
      .catch(error => console.error("Error creating document:", error));
  }, [text, charsPerPage, charsPerLine, createDocument]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">縦書きテキストエディター</h1>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            ※
            １ページあたりの文字数と一行あたりの文字数をスライダーで設定できます
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">
                １ページあたりの文字数: {charsPerPage}
              </label>
              <Slider
                value={[charsPerPage]}
                onValueChange={(vals: number[]) => setCharsPerPage(vals[0])}
                min={100}
                max={1000}
                step={50}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                一行あたりの文字数: {charsPerLine}
              </label>
              <Slider
                value={[charsPerLine]}
                onValueChange={(vals: number[]) => setCharsPerLine(vals[0])}
                min={5}
                max={50}
                step={1}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                フォントサイズ: {fontSize}px
              </label>
              <Slider
                value={[fontSize]}
                onValueChange={(vals: number[]) => setFontSize(vals[0])}
                min={10}
                max={30}
                step={1}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                フォント:
              </label>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                {fontOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Textarea
            value={text}
            onChange={handleTextChange}
            className="w-full h-32"
            placeholder="テキストを入力してください"
          />
        </div>

        <div className="flex justify-between items-center">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            前のページ
          </Button>

          <span className="text-sm">
            {documentX
              ? `${currentPage} / ${documentX.getTotalPages()}ページ`
              : "0 / 0 ページ"}
          </span>

          <Button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(documentX?.getTotalPages() || 1, prev + 1),
              )
            }
            disabled={!documentX || currentPage >= documentX.getTotalPages()}
          >
            次のページ
          </Button>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleDownloadCurrentPage}
            className="flex-1"
            disabled={!documentX}
          >
            現在のページをダウンロード
          </Button>

          <Button
            onClick={handleDownloadAllPages}
            className="flex-1"
            disabled={!documentX}
          >
            全ページをダウンロード
          </Button>
        </div>
      </div>

      <div
        ref={textRef}
        className="p-8 bg-white border rounded-lg shadow-sm mx-auto"
      >
        <div className="vertical-text text-xl" style={textStyle}>
          {documentX?.getPage(currentPage)?.getContent() || ""}
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap");
        @import url('https://fonts.googleapis.com/css2?family=Sawarabi+Mincho&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Zen+Antique&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Yuji+Mincho&display=swap');

      `}</style>
    </div>
  );
};

export default VerticalTextApp;