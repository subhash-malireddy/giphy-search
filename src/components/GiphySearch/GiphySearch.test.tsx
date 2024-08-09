import { render, screen } from "@testing-library/react"
import GiphySearch from ".";

describe('Testing GiphySearch', () => {
    it('Then redners the component properly', () => {
        renderComponent();

        const searchInput = screen.getByTestId('giphy_search_input');
        const searchOutput = screen.getByTestId('giphy_search_output');

        expect(searchInput).toBeInTheDocument();
        expect(searchOutput).toBeInTheDocument();
    });
})

function renderComponent() {
    render(<GiphySearch />)
}