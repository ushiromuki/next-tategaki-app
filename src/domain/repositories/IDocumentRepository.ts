import { Document } from "../entities/Document";
import { Page } from "../entities/Page";

export interface IDocumentRepository {
  save(document: Document): Promise<void>;
  exportPage(page: Page): Promise<string>;
  exportAllPages(document: Document): Promise<string[]>;
}
