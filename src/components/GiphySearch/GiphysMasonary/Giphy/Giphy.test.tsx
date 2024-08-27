import React from "react";
import { render } from "@testing-library/react";
import Giphy from "./Giphy";
import { getGiphyImgAttributes, getImageForConnectionType } from "./utils";
import { GiphyObject } from "../../../../hooks/useSearchGiphys/types";

// Mocking utility functions
jest.mock("./utils", () => ({
  getGiphyImgAttributes: jest.fn(),
  getImageForConnectionType: jest.fn(),
}));

const dummyImagesData = {
  fixed_width: {
    height: "112",
    width: "200",
    size: "128590",
    url: "https://media2.giphy.com/media/sIPQWTzGEfqbwGm4pv/200w.gif?cid=42d8d9dbqv42oct0h9mi16jxjd7wgw14rf74salsxhhzjea8&ep=v1_gifs_search&rid=200w.gif&ct=g",
    mp4_size: "39849",
    mp4: "https://media2.giphy.com/media/sIPQWTzGEfqbwGm4pv/200w.mp4?cid=42d8d9dbqv42oct0h9mi16jxjd7wgw14rf74salsxhhzjea8&ep=v1_gifs_search&rid=200w.mp4&ct=g",
    webp_size: "64664",
    webp: "https://media2.giphy.com/media/sIPQWTzGEfqbwGm4pv/200w.webp?cid=42d8d9dbqv42oct0h9mi16jxjd7wgw14rf74salsxhhzjea8&ep=v1_gifs_search&rid=200w.webp&ct=g",
  },
  fixed_width_downsampled: {
    height: "112",
    width: "200",
    size: "36190",
    url: "https://media2.giphy.com/media/sIPQWTzGEfqbwGm4pv/200w_d.gif?cid=42d8d9dbqv42oct0h9mi16jxjd7wgw14rf74salsxhhzjea8&ep=v1_gifs_search&rid=200w_d.gif&ct=g",
    webp_size: "29228",
    webp: "https://media2.giphy.com/media/sIPQWTzGEfqbwGm4pv/200w_d.webp?cid=42d8d9dbqv42oct0h9mi16jxjd7wgw14rf74salsxhhzjea8&ep=v1_gifs_search&rid=200w_d.webp&ct=g",
    mp4: "uknown",
    mp4_size: "uknown",
  },
  fixed_width_still: {
    height: "112",
    width: "200",
    size: "6567",
    url: "https://media2.giphy.com/media/sIPQWTzGEfqbwGm4pv/200w_s.gif?cid=42d8d9dbqv42oct0h9mi16jxjd7wgw14rf74salsxhhzjea8&ep=v1_gifs_search&rid=200w_s.gif&ct=g",
  },
} satisfies GiphyObject["images"];
const dummyGiphyObject: Partial<GiphyObject> = {
  id: "test-id",
  url: "https://test-url.com",
  images: dummyImagesData,
  title: "Test Giphy",
  alt_text: "Test Alt Text",
};

beforeEach(() => {
  (getImageForConnectionType as jest.Mock).mockReturnValue(
    dummyImagesData.fixed_width,
  );
  (getGiphyImgAttributes as jest.Mock).mockReturnValue({
    src: dummyImagesData.fixed_width.url,
    srcSet: "",
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("TESTING Giphy component", () => {
  describe("GIVEN all required props", () => {
    describe("WHEN the images prop is provided", () => {
      it("THEN renders the component with correct attributes", () => {
        const { getByAltText } = render(
          <Giphy {...dummyGiphyObject} connectionType="4g" />,
        );

        const imgElement = getByAltText("Test Alt Text") as HTMLImageElement;

        expect(getImageForConnectionType).toHaveBeenCalledWith({
          connectionType: "4g",
          images: dummyGiphyObject.images,
        });

        expect(getGiphyImgAttributes).toHaveBeenCalledWith({
          imgData: dummyImagesData.fixed_width,
        });

        expect(imgElement).toHaveAttribute(
          "src",
          dummyImagesData.fixed_width.url,
        );
        expect(imgElement).toHaveAttribute("srcSet", "");
        expect(imgElement).toHaveAttribute("alt", "Test Alt Text");
      });
    });

    describe("WHEN the images prop is not provided", () => {
      it("THEN renders null", () => {
        const { container } = render(
          <Giphy
            {...dummyGiphyObject}
            images={undefined}
            connectionType="4g"
          />,
        );

        expect(container.firstChild).toBeNull();
      });
    });

    describe("WHEN a callbackRef", () => {
      it("THEN correctly assigns the ref to the div element", () => {
        const mockRefCallback = jest.fn();
        const { container } = render(
          <Giphy
            {...dummyGiphyObject}
            callbackRef={mockRefCallback}
            connectionType="4g"
          />,
        );

        expect(mockRefCallback).toHaveBeenCalledWith(
          container.firstChild as HTMLDivElement,
        );
      });
    });
  });
});
