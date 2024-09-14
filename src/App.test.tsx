import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./components/GiphySearch", () => ({
  __esModule: true,
  default: () => <div>Giphy Search component</div>,
}));

describe("Testing App component", () => {
  it("renders GiphySearch component", () => {
    render(<App />);

    expect(screen.getByText("Giphy Search component")).toBeInTheDocument();
  });
});
