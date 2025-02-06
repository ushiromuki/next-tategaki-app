import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerticalTextApp from "./TategakiRenderer";
import React from "react";

// URLオブジェクトのモック
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// ダウンロードリンクのクリックをモック
const mockClick = vi.fn();
HTMLAnchorElement.prototype.click = mockClick;

describe("VerticalTextApp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("初期レンダリング", () => {
    render(<VerticalTextApp />);

    expect(
      screen.getByRole("heading", { name: /縦書きテキストエディター/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText(/1ページ20文字×20行/)).toBeInTheDocument();
    expect(screen.getByText("0 / 0 ページ")).toBeInTheDocument();
  });

  test("テキスト入力", async () => {
    const user = userEvent.setup();
    render(<VerticalTextApp />);

    const textarea = screen.getByRole("textbox");
    const testText = "これはテストです。";

    await user.type(textarea, testText);
    expect(textarea).toHaveValue(testText);
    expect(screen.getByText("1 / 1 ページ")).toBeInTheDocument();
  });

  test("ページナビゲーション", async () => {
    const user = userEvent.setup();
    render(<VerticalTextApp />);

    const textarea = screen.getByRole("textbox");
    const longText = "一".repeat(1000); // 複数ページになる長さ

    await user.type(textarea, longText);

    const nextButton = screen.getByRole("button", { name: /次のページ/i });
    const prevButton = screen.getByRole("button", { name: /前のページ/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    await user.click(nextButton);
    expect(screen.getByText(/2 \//)).toBeInTheDocument();
    expect(prevButton).not.toBeDisabled();
  });

  test("現在のページのダウンロード", async () => {
    const user = userEvent.setup();
    render(<VerticalTextApp />);

    await user.type(screen.getByRole("textbox"), "テストテキスト");

    const downloadButton = screen.getByRole("button", {
      name: /現在のページをダウンロード/i,
    });
    await user.click(downloadButton);

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  test("全ページのダウンロード", async () => {
    const user = userEvent.setup();
    render(<VerticalTextApp />);

    await user.type(screen.getByRole("textbox"), "一".repeat(1000));

    const downloadAllButton = screen.getByRole("button", {
      name: /全ページをダウンロード/i,
    });
    await user.click(downloadAllButton);

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
  });

  test("エラー処理", async () => {
    mockCreateObjectURL.mockImplementationOnce(() => {
      throw new Error("URL creation failed");
    });

    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<VerticalTextApp />);
    await user.type(screen.getByRole("textbox"), "テストテキスト");

    const downloadButton = screen.getByRole("button", {
      name: /現在のページをダウンロード/i,
    });
    await user.click(downloadButton);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
