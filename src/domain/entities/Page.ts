export class Page {
  private readonly CHARS_PER_LINE = 20;
  private readonly LINES_PER_PAGE = 20;
  private readonly content: string;
  private readonly pageNumber: number;

  constructor(content: string, pageNumber: number) {
    this.content = content;
    this.pageNumber = pageNumber;
  }

  getContent(): string {
    return this.content;
  }

  getPageNumber(): number {
    return this.pageNumber;
  }

  isValidLength(): boolean {
    return this.content.length <= this.CHARS_PER_LINE * this.LINES_PER_PAGE;
  }
}
