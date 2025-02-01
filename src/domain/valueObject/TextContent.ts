export class TextContent {
  private readonly value: string;

  constructor(value: string) {
    this.value = this.validateContent(value);
  }

  private validateContent(content: string): string {
    if (!content) {
      throw new Error("Content cannot be empty");
    }
    return content;
  }

  getValue(): string {
    return this.value;
  }
}
