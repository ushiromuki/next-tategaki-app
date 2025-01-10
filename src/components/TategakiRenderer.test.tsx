import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TategakiRenderer from "../components/TategakiRenderer";

describe("TategakiRenderer", () => {
  it("renders without crashing", () => {
    render(<TategakiRenderer />);
    // コンポーネントが正常にレンダリングされることを確認
    expect(document.querySelector("canvas")).toBeTruthy();
  });
});
