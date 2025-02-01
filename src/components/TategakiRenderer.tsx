"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreateDocumentUseCase } from "../application/useCases/CreateDocumentUseCase";
import { ExportPageUseCase } from "../application/useCases/ExportPageUseCase";
import { ExportAllPagesUseCase } from "../application/useCases/ExportAllPagesUseCase";
import { SVGDocumentRepository } from "../infrastructure/repositories/SVGDocumentRepository";
import { Document } from "../domain/entities/Document";

const VerticalTextApp = () => {
  const [text, setText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [document, setDocument] = useState<Document | null>(null);
  const textRef = useRef(null);

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
      const newDocument = await createDocument.execute(newText);
      setDocument(newDocument);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const handleDownloadCurrentPage = async () => {
    if (!document) return;

    const currentPageObj = document.getPage(currentPage);
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
    if (!document) return;

    try {
      const urls = await exportAllPages.execute(document);
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
    fontFamily: '"Noto Serif JP", serif',
    lineHeight: "1.7",
    height: "800px",
    width: "680px",
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">縦書きテキストエディター</h1>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            ※ 1ページ20文字×20行（400文字）で表示します
          </p>
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
            {document
              ? `${currentPage} / ${document.getTotalPages()}ページ`
              : "0 / 0 ページ"}
          </span>

          <Button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(document?.getTotalPages() || 1, prev + 1),
              )
            }
            disabled={!document || currentPage >= document.getTotalPages()}
          >
            次のページ
          </Button>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleDownloadCurrentPage}
            className="flex-1"
            disabled={!document}
          >
            現在のページをダウンロード
          </Button>

          <Button
            onClick={handleDownloadAllPages}
            className="flex-1"
            disabled={!document}
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
          {document?.getPage(currentPage)?.getContent() || ""}
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap");
      `}</style>
    </div>
  );
};

export default VerticalTextApp;
