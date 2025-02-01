import { IDocumentRepository } from "../../domain/repositories/IDocumentRepository";
import { Document } from "../../domain/entities/Document";

export class ExportAllPagesUseCase {
  constructor(private documentRepository: IDocumentRepository) {}

  async execute(document: Document): Promise<string[]> {
    return await this.documentRepository.exportAllPages(document);
  }
}
