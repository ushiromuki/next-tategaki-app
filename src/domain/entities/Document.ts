import { Page } from "./Page";
import { TextContent } from "../valueObject/TextContent";

export class Document {
  private charsPerPage: number;
  private charsPerLine: number;
  private pages: Page[];
  private content: TextContent;

  constructor(content: TextContent, charsPerPage = 400, charsPerLine = 20) {
    this.content = content;
    this.charsPerPage = charsPerPage;
    this.charsPerLine = charsPerLine;
    this.pages = this.splitIntoPages(content.getValue());
  }

  private splitIntoPages(text: string): Page[] {
    const pages: Page[] = [];
    let currentPage = "";
    let pageNumber = 1;
    let charCount = 0;

    for (const char of text) {
      if (charCount >= this.charsPerPage) {
        pages.push(new Page(currentPage, pageNumber));
        currentPage = "";
        charCount = 0;
        pageNumber++;
      }

      if (char === "\n") {
        const remainingInLine =
          this.charsPerLine - (charCount % this.charsPerLine);
        charCount += remainingInLine;
        currentPage += char;
        continue;
      }

      currentPage += char;
      charCount++;
    }

    if (currentPage) {
      pages.push(new Page(currentPage, pageNumber));
    }

    return pages;
  }

  getPages(): Page[] {
    return this.pages;
  }

  getTotalPages(): number {
    return this.pages.length;
  }

  getPage(pageNumber: number): Page | undefined {
    return this.pages[pageNumber - 1];
  }
}
