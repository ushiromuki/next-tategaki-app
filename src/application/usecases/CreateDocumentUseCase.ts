import { TextContent } from "../../domain/valueObject/TextContent";
import { Document } from "../../domain/entities/Document";
import type { IDocumentRepository } from "../../domain/repositories/IDocumentRepository";

export class CreateDocumentUseCase {
  constructor(private documentRepository: IDocumentRepository) {}

  async execute(
    content: string,
    charsPerPage: number,
    charsPerLine: number,
  ): Promise<Document> {
    const textContent = new TextContent(content);
    const document = new Document(textContent, charsPerPage, charsPerLine);
    await this.documentRepository.save(document);
    return document;
  }
}
