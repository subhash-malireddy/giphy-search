import { getGiphyImgAttributes } from ".";

const dummyImgData: Parameters<typeof getGiphyImgAttributes>[0]["imgData"] = {
  url: "url",
  width: "30",
  height: "30",
  size: "900",
};

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
