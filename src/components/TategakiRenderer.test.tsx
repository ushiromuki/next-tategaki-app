import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerticalTextApp from "./VerticalTextApp";

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
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  test("初期レンダリング", () => {
    render(<VerticalTextApp />);

    // 基本的なUI要素の存在確認
    expect(
      screen.getByRole("heading", { name: /縦書きテキストエディター/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText(/1ページ20文字×20行/)).toBeInTheDocument();
  });

  test("テキスト入力の動作確認", async () => {
    const user = userEvent.setup();
    render(<VerticalTextApp />);

    const textarea = screen.getByRole("textbox");
    const newText = "テストテキスト";

    await user.clear(textarea);
    await user.type(textarea, newText);

    expect(textarea).toHaveValue(newText);
  });

  test("ページナビゲーションの動作確認", async () => {
    const user = userEvent.setup();
    render(<VerticalTextApp />);

    // 長いテキストを入力して複数ページを作成
    const textarea = screen.getByRole("textbox");
    const longText = "一".repeat(1000); // 400文字以上のテキスト

    await user.clear(textarea);
    await user.type(textarea, longText);

    const nextButton = screen.getByRole("button", { name: /次のページ/i });
    const prevButton = screen.getByRole("button", { name: /前のページ/i });

    // 初期状態では前へボタンは無効
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    // 次のページへ移動
    await user.click(nextButton);
    expect(screen.getByText(/2 \/ /)).toBeInTheDocument();

    // 前のページへ戻る
    await user.click(prevButton);
    expect(screen.getByText(/1 \/ /)).toBeInTheDocument();
  });

  test("現在のページのダウンロード機能", async () => {
    const user = userEvent.setup();
    render(<VerticalTextApp />);

    const downloadButton = screen.getByRole("button", {
      name: /現在のページをダウンロード/i,
    });
    await user.click(downloadButton);

    // SVGファイルの生成とダウンロードの確認
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  test("全ページのダウンロード機能", async () => {
    const user = userEvent.setup();
    render(<VerticalTextApp />);

    // 長いテキストを入力して複数ページを作成
    const textarea = screen.getByRole("textbox");
    const longText = "一".repeat(1000);

    await user.clear(textarea);
    await user.type(textarea, longText);

    const downloadAllButton = screen.getByRole("button", {
      name: /全ページをダウンロード/i,
    });
    await user.click(downloadAllButton);

    // 複数ページのダウンロードが実行されたことを確認
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
  });

  test("ページ分割の正確性", () => {
    render(<VerticalTextApp />);

    // 400文字ちょうどのテキストを入力
    const text400 = "一".repeat(400);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: text400 } });

    // 1ページに収まることを確認
    expect(screen.getByText(/1 \/ 1/)).toBeInTheDocument();

    // 401文字のテキストを入力
    const text401 = "一".repeat(401);
    fireEvent.change(textarea, { target: { value: text401 } });

    // 2ページになることを確認
    expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument();
  });

  test("禁則処理のレンダリング", () => {
    render(<VerticalTextApp />);

    // 句読点を含むテキストを入力
    const textWithPunctuation = "今日は、良い天気です。";
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: textWithPunctuation } });

    // vertical-textクラスを持つ要素に適切なスタイルが適用されていることを確認
    const verticalTextElement = screen.getByText(textWithPunctuation);
    expect(verticalTextElement).toHaveStyle({
      "writing-mode": "vertical-rl",
      "text-orientation": "mixed",
    });
  });

  test("エラー処理", async () => {
    // URLの作成に失敗するケースをシミュレート
    mockCreateObjectURL.mockImplementationOnce(() => {
      throw new Error("URL creation failed");
    });

    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<VerticalTextApp />);

    const downloadButton = screen.getByRole("button", {
      name: /現在のページをダウンロード/i,
    });
    await user.click(downloadButton);

    // エラーがログに記録されることを確認
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
