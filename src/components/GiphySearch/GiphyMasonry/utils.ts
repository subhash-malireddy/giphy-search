export const GIF_FIXED_WIDTH = 200;

export const DEFAULT_COLUMN_COUNT = 1;
export const COLUMN_GAP = 8;

export function getContainerPadding({
  columnCount,
  columnGap,
  containerOffsetWidth,
  includeScrollBarWidthBuffer = false,
}: {
  columnCount: number;
  columnGap: number;
  containerOffsetWidth: number;
  includeScrollBarWidthBuffer?: boolean;
}) {
  if (columnCount === 0) return "0";

  // const containerWidth = containerDiv.offsetWidth;
  const totalColumnGap = (columnCount - 1) * columnGap;
  const totalColumnsWidth = columnCount * GIF_FIXED_WIDTH;
  const possibleHorizontalPadding =
    containerOffsetWidth - totalColumnsWidth - totalColumnGap;
  const WINDOW_SCROLLBAR_WIDTH_BUFFER = 20;

  const totalHorizontalPadding = includeScrollBarWidthBuffer
    ? possibleHorizontalPadding - WINDOW_SCROLLBAR_WIDTH_BUFFER
    : possibleHorizontalPadding;
  const containerPadding =
    Math.sign(totalHorizontalPadding) === 1
      ? `0 ${totalHorizontalPadding / 2}px`
      : "0";
  return containerPadding;
}

export function calculateColumnProperties(containerOffsetWidth: number) {
  if (containerOffsetWidth === 0)
    return { columnCount: 0, columnGap: 0, columnWidth: GIF_FIXED_WIDTH };

  const columnsCountDecimal = containerOffsetWidth / GIF_FIXED_WIDTH - 1;
  const columnCount =
    Math.sign(columnsCountDecimal) === 1
      ? Math.floor(columnsCountDecimal)
      : DEFAULT_COLUMN_COUNT;

  return {
    columnCount,
    columnGap: COLUMN_GAP,
    columnWidth: GIF_FIXED_WIDTH,
  };
}
