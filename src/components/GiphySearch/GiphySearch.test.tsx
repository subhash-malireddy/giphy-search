import { render, screen } from "@testing-library/react";
import GiphySearch from ".";
import GiphyMasonry from "./GiphyMasonry";
jest.mock("./GiphyMasonry", () => ({
  __esModule: true,
  default: () => <div data-testid="giphy_search_output"></div>,
}));
GiphyMasonry;
describe("Testing GiphySearch", () => {
  it("Then redners the component properly", () => {
    renderComponent();

    const searchInput = screen.getByTestId("giphy_search_input");
    const searchOutput = screen.getByTestId("giphy_search_output");

    expect(searchInput).toBeInTheDocument();
    expect(searchOutput).toBeInTheDocument();
  });
});

function renderComponent() {
  render(<GiphySearch />);
}
