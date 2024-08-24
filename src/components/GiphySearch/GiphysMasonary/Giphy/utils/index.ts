import { DEFAULT_COLUMN_COUNT, GIF_FIXED_SMALL_WIDTH } from "../../utils";

export function getContainerPadding({
  columnCount,
  columnGap,
  containerDiv,
  includeScrollBarWidthBuffer = false,
}: {
  columnCount: number;
  columnGap: number;
  containerDiv: HTMLDivElement;
  includeScrollBarWidthBuffer?: boolean;
}) {
  if (columnCount === 0) return "0";

  const containerWidth = containerDiv.offsetWidth;
  const totalColumnGap = (columnCount - 1) * columnGap;
  const totalColumnsWidth = columnCount * GIF_FIXED_SMALL_WIDTH;
  const possibleHorizontalPadding =
    containerWidth - totalColumnsWidth - totalColumnGap;
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
export function caclulateColumnProperties(containerDiv?: HTMLDivElement) {
  if (!containerDiv)
    return { columnCount: 0, columnGap: 0, columnWidth: GIF_FIXED_SMALL_WIDTH };

  const width = containerDiv.offsetWidth;
  const columnsCountDecimal = width / GIF_FIXED_SMALL_WIDTH - 1;
  const columnCount =
    Math.sign(columnsCountDecimal) === 1
      ? Math.floor(columnsCountDecimal)
      : DEFAULT_COLUMN_COUNT;
  const COLUMN_GAP = 8;

  return {
    columnCount,
    columnGap: COLUMN_GAP,
    columnWidth: GIF_FIXED_SMALL_WIDTH,
  };
}
