import { getContainerPadding } from ".";

describe("TESTING getContainerPadding", () => {
  describe("GIVEN he correct args for the function", () => {
    describe("WHEN the column count is 0", () => {
      it('should return "0"', () => {
        const padding = getContainerPadding({
          columnCount: 0,
          columnGap: 10,
          containerOffsetWidth: 300,
        });
        expect(padding).toBe("0");
      });
    });

    describe("WHEN there is more space that that is required to fit the colummns", () => {
      it("should return positive padding", () => {
        const containerOffsetWidth = 500; // Set container width

        const padding = getContainerPadding({
          columnCount: 2,
          columnGap: 10,
          containerOffsetWidth,
        });
        expect(padding).toBe("0 45px"); // Assuming GIF_FIXED_WIDTH is 150
      });
    });

    describe("WHEN `includeScrollBarWidthBuffer` ", () => {
      it("should include scroll bar width buffer if specified", () => {
        const containerOffsetWidth = 500; // Set container width

        const padding = getContainerPadding({
          columnCount: 2,
          columnGap: 10,
          containerOffsetWidth,
          includeScrollBarWidthBuffer: true,
        });
        expect(padding).toBe("0 35px"); // Assuming GIF_FIXED_WIDTH is 150
      });
    });

    describe("WHEN there is just enough space for columns to fit", () => {
      it('should return "0"', () => {
        const containerOffsetWidth = 320; // Set container width

        const padding = getContainerPadding({
          columnCount: 2,
          columnGap: 10,
          containerOffsetWidth,
        });
        expect(padding).toBe("0");
      });
    });

    describe("WHEN the actually calculated padding results in negavtive number", () => {
      it('should return "0"', () => {
        const containerOffsetWidth = 200; // Set container width

        const padding = getContainerPadding({
          columnCount: 3,
          columnGap: 10,
          containerOffsetWidth,
        });
        expect(padding).toBe("0");
      });
    });
  });
});
