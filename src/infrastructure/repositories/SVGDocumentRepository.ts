import type { IDocumentRepository } from "../../domain/repositories/IDocumentRepository";
import { Document } from "../../domain/entities/Document";
import { Page } from "../../domain/entities/Page";

export class SVGDocumentRepository implements IDocumentRepository {
  private createSVGData(content: string): string {
    return `
		<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">
		  <foreignObject width="100%" height="100%">
			<div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;padding:2rem;background:white;">
			  <div style="writing-mode:vertical-rl;text-orientation:mixed;font-family:'Noto Serif JP',serif;line-height:1.7;height:800px;width:680px;font-size:1.25rem;">
				${content}
			  </div>
			</div>
		  </foreignObject>
		</svg>
	  `;
  }

  async save(document: Document): Promise<void> {
    // 実際のアプリケーションでは永続化処理を実装
    console.log(document);
    return Promise.resolve();
  }

  async exportPage(page: Page): Promise<string> {
    const svgData = this.createSVGData(page.getContent());
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    return URL.createObjectURL(blob);
  }

  async exportAllPages(document: Document): Promise<string[]> {
    const urls: string[] = [];
    for (const page of document.getPages()) {
      const url = await this.exportPage(page);
      urls.push(url);
    }
    return urls;
  }
}
