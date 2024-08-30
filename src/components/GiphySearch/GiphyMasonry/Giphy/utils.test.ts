import { getGiphyImgAttributes, getImageForConnectionType } from "./utils";
import { GiphyObject } from "../../../../hooks/useSearchGiphys/types";

const dummyImgData: Parameters<typeof getGiphyImgAttributes>[0]["imgData"] = {
  url: "url",
  width: "30",
  height: "30",
  size: "900",
};

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

describe("TESTING getGiphyImgAttributes", () => {
  describe("GIVEN the required arg imgData", () => {
    describe("WHEN the imgData doesn't have webp property", () => {
      it("THEN simply returns the img url as source", () => {
        const { src, srcSet } = getGiphyImgAttributes({
          imgData: dummyImgData,
        });
        expect(src).toBe(dummyImgData.url);
        expect(srcSet).toBe("");
      });
    });

    describe("WHEN the imgData have webp property", () => {
      it("THEN simply returns the img url as source", () => {
        const dummyWebpData = { webp: "webp" };
        const { src, srcSet } = getGiphyImgAttributes({
          imgData: { ...dummyImgData, ...dummyWebpData },
        });

        expect(src).toBe(dummyWebpData.webp);
        expect(srcSet).toBe(`${dummyWebpData.webp}, ${dummyImgData.url}`);
      });
    });
  });
});

describe("TESTING getImageForConnectionType", () => {
  describe("GIVEN the required args connectionType & images", () => {
    describe("WHEN the connectionType is `unknown`", () => {
      it("THEN returns the fixed_width imgData", () => {
        const imgData = getImageForConnectionType({
          connectionType: "unknown",
          images: dummyImagesData,
        });

        expect(imgData).toBe(dummyImagesData.fixed_width);
      });
    });

    describe("WHEN the connectionType is `slow-2g` or `2g`", () => {
      it("THEN returns the fixed_width_still imgData", () => {
        const imgData = getImageForConnectionType({
          connectionType: "slow-2g",
          images: dummyImagesData,
        });

        expect(imgData).toBe(dummyImagesData.fixed_width_still);

        const imgData2 = getImageForConnectionType({
          connectionType: "2g",
          images: dummyImagesData,
        });

        expect(imgData2).toBe(dummyImagesData.fixed_width_still);
      });
    });

    describe("WHEN the connectionType is `3g` or `4g`", () => {
      it("THEN returns the fixed_width imgData", () => {
        const imgData3g = getImageForConnectionType({
          connectionType: "3g",
          images: dummyImagesData,
        });

        expect(imgData3g).toBe(dummyImagesData.fixed_width);

        const imgData4g = getImageForConnectionType({
          connectionType: "4g",
          images: dummyImagesData,
        });

        expect(imgData4g).toBe(dummyImagesData.fixed_width);
      });
    });
  });
});
