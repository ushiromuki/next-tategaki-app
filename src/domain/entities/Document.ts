import { Page } from "./Page";

export class Document {
  private readonly CHARS_PER_PAGE = 400;
  private pages: Page[];
  private content: TextContent;

  constructor(content: TextContent) {
    this.content = content;
    this.pages = this.splitIntoPages(content.getValue());
  }

  private splitIntoPages(text: string): Page[] {
    const pages: Page[] = [];
    let currentPage = "";
    let pageNumber = 1;
    let charCount = 0;

    for (const char of text) {
      if (charCount >= this.CHARS_PER_PAGE) {
        pages.push(new Page(currentPage, pageNumber));
        currentPage = "";
        charCount = 0;
        pageNumber++;
      }

      if (char === "\n") {
        const remainingInLine = 20 - (charCount % 20);
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
