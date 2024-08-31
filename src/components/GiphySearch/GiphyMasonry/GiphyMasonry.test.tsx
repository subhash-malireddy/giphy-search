import { render, screen } from "@testing-library/react";
import GiphyMasonry from "./GiphyMasonry";
import useSearchForGifs from "../../../hooks/useSearchGiphys";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";
import useNetworkSpeed from "../../../hooks/useNetworkSpeed";
import { calculateColumnProperties, getContainerPadding } from "./utils";
import { GiphySearchResponse } from "../../../hooks/useSearchGiphys/types";

jest.mock("../../../hooks/useSearchGiphys");
jest.mock("../../../hooks/useIntersectionObserver");
jest.mock("../../../hooks/useNetworkSpeed");
jest.mock("./utils");
jest.mock("./Giphy", () => () => (
  <div data-testid="mock-giphy">Mock Giphy</div>
));

const mockResetShouldSearch = jest.fn();
const mockAllowSearch = jest.fn();

beforeEach(() => {
  (useSearchForGifs as jest.Mock).mockReturnValue({
    response: { ...mockResponse },
    loading: false,
    error: null,
    loadMore: jest.fn(),
  });

  (useIntersectionObserver as jest.Mock).mockReturnValue(jest.fn());
  (useNetworkSpeed as jest.Mock).mockReturnValue({
    effectiveType: "4g",
  });

  (calculateColumnProperties as jest.Mock).mockReturnValue({
    columnCount: 3,
    columnGap: 20,
    columnWidth: 200,
  });

  (getContainerPadding as jest.Mock).mockReturnValue("20px");
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("TESTING GiphyMasonry component", () => {
  describe("GIVEN the required props", () => {
    describe("WHEN the data fetching is successful", () => {
      it("THEN displays the mocked Giphy components", () => {
        render(
          <GiphyMasonry
            queryString="funny cats"
            shouldSearch={true}
            resetShouldSearch={mockResetShouldSearch}
            allowSearch={mockAllowSearch}
          />,
        );

        const giphyItems = screen.getAllByTestId("mock-giphy");
        expect(giphyItems).toHaveLength(mockResponse.data.length);

        const containerDiv = screen.getByTestId("giphys-masonry-container");
        expect(containerDiv).toHaveStyle({
          columnCount: "3",
          columnWidth: "200px",
          columnGap: "20px",
          padding: "20px",
        });
      });
    });

    describe("WHEN the data fetching is successful and all the resutls are returned", () => {
      it("THEN displays text saying `That's all we have!!`", () => {
        render(
          <GiphyMasonry
            queryString="funny cats"
            shouldSearch={true}
            resetShouldSearch={mockResetShouldSearch}
            allowSearch={mockAllowSearch}
          />,
        );
        expect(screen.getByText("That's all we have!!")).toBeInTheDocument();
      });
    });

    describe("WHEN an error occurs", () => {
      it("THEN displays the error message", () => {
        (useSearchForGifs as jest.Mock).mockReturnValueOnce({
          response: null,
          loading: false,
          error: { message: "Failed to fetch gifs" },
          loadMore: jest.fn(),
        });

        render(
          <GiphyMasonry
            queryString="funny cats"
            shouldSearch={true}
            resetShouldSearch={mockResetShouldSearch}
            allowSearch={mockAllowSearch}
          />,
        );

        const errorMessage = screen.getByText("error: Failed to fetch gifs");
        expect(errorMessage).toBeInTheDocument();
      });
    });

    describe("WHEN loading is true", () => {
      it("THEN displays the loading message", () => {
        (useSearchForGifs as jest.Mock).mockReturnValueOnce({
          response: null,
          loading: true,
          error: null,
          loadMore: jest.fn(),
        });

        render(
          <GiphyMasonry
            queryString="funny cats"
            shouldSearch={true}
            resetShouldSearch={mockResetShouldSearch}
            allowSearch={mockAllowSearch}
          />,
        );

        const loadingMessage = screen.getByText("Loading ...");
        expect(loadingMessage).toBeInTheDocument();
      });
    });
    describe("WHEN there are no results for the given queryString", () => {
      it("THEN display correct UI", () => {
        (useSearchForGifs as jest.Mock).mockReturnValueOnce({
          response: {
            data: [],
            meta: mockResponse.meta,
            pagination: {
              total_count: 0,
              count: 0,
              offset: 0,
            },
          },
          loading: false,
          error: null,
          loadMore: jest.fn(),
        });

        render(
          <GiphyMasonry
            queryString="funny cats"
            shouldSearch={true}
            resetShouldSearch={mockResetShouldSearch}
            allowSearch={mockAllowSearch}
          />,
        );

        expect(
          screen.getByText(`Sorry, no reults for - \`funny cats\``),
        ).toBeInTheDocument();
      });
    });
  });
});

const mockResponse: GiphySearchResponse = {
  data: [
    {
      type: "gif",
      id: "MC6eSuC3yypCU",
      url: "https://giphy.com/gifs/MC6eSuC3yypCU",
      bitly_gif_url: "http://gph.is/28RsTeX",
      bitly_url: "http://gph.is/28RsTeX",
      title: "matrix GIF",
      rating: "g",
      images: {
        fixed_width: {
          height: "108",
          width: "200",
          size: "174192",
          url: "https://media4.giphy.com/media/MC6eSuC3yypCU/200w.gif?cid=42d8d9dbyn99bjf03owecm4vnko3k2xf2bizsy2v0fx581jz&ep=v1_gifs_search&rid=200w.gif&ct=g",
          mp4_size: "111436",
          mp4: "https://media4.giphy.com/media/MC6eSuC3yypCU/200w.mp4?cid=42d8d9dbyn99bjf03owecm4vnko3k2xf2bizsy2v0fx581jz&ep=v1_gifs_search&rid=200w.mp4&ct=g",
          webp_size: "101110",
          webp: "https://media4.giphy.com/media/MC6eSuC3yypCU/200w.webp?cid=42d8d9dbyn99bjf03owecm4vnko3k2xf2bizsy2v0fx581jz&ep=v1_gifs_search&rid=200w.webp&ct=g",
        },
        fixed_width_downsampled: {
          height: "108",
          width: "200",
          size: "49365",
          url: "https://media4.giphy.com/media/MC6eSuC3yypCU/200w_d.gif?cid=42d8d9dbyn99bjf03owecm4vnko3k2xf2bizsy2v0fx581jz&ep=v1_gifs_search&rid=200w_d.gif&ct=g",
          webp_size: "40896",
          webp: "https://media4.giphy.com/media/MC6eSuC3yypCU/200w_d.webp?cid=42d8d9dbyn99bjf03owecm4vnko3k2xf2bizsy2v0fx581jz&ep=v1_gifs_search&rid=200w_d.webp&ct=g",
        },
        fixed_width_still: {
          height: "108",
          width: "200",
          size: "182083",
          url: "https://media2.giphy.com/media/10zxDv7Hv5RF9C/100w.gif?cid=42d8d9dbyn99bjf03owecm4vnko3k2xf2bizsy2v0fx581jz&ep=v1_gifs_search&rid=100w.gif&ct=g",
        },
      },
      alt_text: "",
    },
    {
      type: "gif",
      id: "10zxDv7Hv5RF9C",
      url: "https://giphy.com/gifs/loop-computer-matrix-10zxDv7Hv5RF9C",
      bitly_gif_url: "http://gph.is/11DYjH3",
      bitly_url: "http://gph.is/11DYjH3",
      title: "Coding The Matrix GIF",
      rating: "g",
      images: {
        fixed_width: {
          height: "84",
          width: "200",
          size: "536704",
          url: "https://media2.giphy.com/media/10zxDv7Hv5RF9C/200w.gif?cid=42d8d9dbyn99bjf03owecm4vnko3k2xf2bizsy2v0fx581jz&ep=v1_gifs_search&rid=200w.gif&ct=g",
          mp4_size: "315465",
          mp4: "https://media2.giphy.com/media/10zxDv7Hv5RF9C/200w.mp4?cid=42d8d9dbyn99bjf03owecm4vnko3k2xf2bizsy2v0fx581jz&ep=v1_gifs_search&rid=200w.mp4&ct=g",
          webp_size: "365108",
          webp: "https://media2.giphy.com/media/10zxDv7Hv5RF9C/200w.webp?cid=42d8d9dbyn99bjf03owecm4vnko3k2xf2bizsy2v0fx581jz&ep=v1_gifs_search&rid=200w.webp&ct=g",
        },
        fixed_width_downsampled: {
          height: "84",
          width: "200",
          size: "33772",
          url: "https://media2.giphy.com/media/10zxDv7Hv5RF9C/200w_d.gif?cid=42d8d9dbyn99bjf03owecm4vnko3k2xf2bizsy2v0fx581jz&ep=v1_gifs_search&rid=200w_d.gif&ct=g",
          webp_size: "28752",
          webp: "https://media2.giphy.com/media/10zxDv7Hv5RF9C/200w_d.webp?cid=42d8d9dbyn99bjf03owecm4vnko3k2xf2bizsy2v0fx581jz&ep=v1_gifs_search&rid=200w_d.webp&ct=g",
        },
        fixed_width_still: {
          height: "42",
          width: "100",
          size: "182083",
          url: "https://media2.giphy.com/media/10zxDv7Hv5RF9C/100w.gif?cid=42d8d9dbyn99bjf03owecm4vnko3k2xf2bizsy2v0fx581jz&ep=v1_gifs_search&rid=100w.gif&ct=g",
        },
      },
      alt_text: "",
    },
  ],
  meta: {
    status: 200,
    msg: "OK",
    response_id: "yn99bjf03owecm4vnko3k2xf2bizsy2v0fx581jz",
  },
  pagination: {
    total_count: 2,
    count: 2,
    offset: 0,
  },
};
