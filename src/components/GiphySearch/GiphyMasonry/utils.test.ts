import {
  calculateColumnProperties,
  GIF_FIXED_WIDTH,
  DEFAULT_COLUMN_COUNT,
  COLUMN_GAP,
  getContainerPadding,
} from "./utils";

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

describe("TESTING calculateColumnProperties", () => {
  describe("GIVEN he correct args for the function", () => {
    describe("WHEN the container offset width is zero", () => {
      it("should return default values", () => {
        const result = calculateColumnProperties(0);
        expect(result.columnCount).toBe(0);
        expect(result.columnGap).toBe(0);
        expect(result.columnWidth).toBe(GIF_FIXED_WIDTH);
      });
    });

    describe("WHEN the offset width can contain only one column", () => {
      it("should return one column for container width that fits exactly one column", () => {
        const containerOffsetWidth = GIF_FIXED_WIDTH;
        const result = calculateColumnProperties(containerOffsetWidth);
        expect(result.columnCount).toBe(DEFAULT_COLUMN_COUNT);
        expect(result.columnGap).toBe(COLUMN_GAP);
        expect(result.columnWidth).toBe(GIF_FIXED_WIDTH);
      });
    });

    describe("WHEN the conatiner can fit multiple columns", () => {
      it("should return multiple columns minus 1", () => {
        const possibleMultipleColumnCount = 3;
        const containerOffsetWidth =
          GIF_FIXED_WIDTH * possibleMultipleColumnCount +
          COLUMN_GAP * possibleMultipleColumnCount -
          1; // 3 columns with 2 gaps
        const result = calculateColumnProperties(containerOffsetWidth);
        expect(result.columnCount).toBe(possibleMultipleColumnCount - 1);
        expect(result.columnGap).toBe(COLUMN_GAP);
        expect(result.columnWidth).toBe(GIF_FIXED_WIDTH);
      });
    });

    describe("WHEN the calculated column count results in a float/decimal", () => {
      it("should round down column count", () => {
        const containerOffsetWidth = GIF_FIXED_WIDTH * 2.5;
        const result = calculateColumnProperties(containerOffsetWidth);
        expect(result.columnCount).toBe(1);
        expect(result.columnGap).toBe(COLUMN_GAP);
        expect(result.columnWidth).toBe(GIF_FIXED_WIDTH);
      });
    });

    describe("WHEN the container width is too small for a single column", () => {
      it("should return default values for", () => {
        const containerOffsetWidth = GIF_FIXED_WIDTH - 1;
        const result = calculateColumnProperties(containerOffsetWidth);
        expect(result.columnCount).toBe(DEFAULT_COLUMN_COUNT);
        expect(result.columnGap).toBe(COLUMN_GAP);
        expect(result.columnWidth).toBe(GIF_FIXED_WIDTH);
      });
    });
  });
});
