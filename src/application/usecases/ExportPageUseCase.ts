import { Page } from "../../domain/entities/Page";
import type { IDocumentRepository } from "../../domain/repositories/IDocumentRepository";

export class ExportPageUseCase {
  constructor(private documentRepository: IDocumentRepository) {}

  async execute(page: Page): Promise<string> {
    return await this.documentRepository.exportPage(page);
  }
}
