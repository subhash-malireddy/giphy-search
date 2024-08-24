import useSearchForGifs from "../../../hooks/useSearchGiphys";
import "./GiphysMasonary.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Giphy from "./Giphy";
import { caclulateColumnProperties, getContainerPadding } from "./Giphy/utils";
import useIntersectionObserver from "../../../hooks/useSearchGiphys/useIntersectionObserver";

interface GifsGridProps {
  queryString: string;
  shouldSearch: boolean;
  resetShouldSearch: () => void;
  allowSearch: () => void;
}

const GifsGrid = ({
  queryString,
  shouldSearch,
  resetShouldSearch,
  allowSearch,
}: GifsGridProps) => {
  const { response, loading, error, loadMore } = useSearchForGifs({
    queryString,
    shouldSearch,
    resetShouldSearch,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const hasGiphyData = Boolean(response && response.data.length);

  const hasMoreGiphysToLoad =
    hasGiphyData && response.data.length < response.pagination.total_count;

  const fetchMoreGiphsOnIntersection: IntersectionObserverCallback =
    useCallback(
      (entries) => {
        if (
          !!entries[0] &&
          entries[0].isIntersecting &&
          hasMoreGiphysToLoad &&
          !loading
        ) {
          allowSearch();
          loadMore();
        }
      },
      [hasMoreGiphysToLoad, loading, loadMore, allowSearch],
    );

  const lastGiphyElementRef = useIntersectionObserver<HTMLDivElement>({
    callback: fetchMoreGiphsOnIntersection,
  });

  useEffect(function setInitialContainerStyling() {
    if (containerRef.current === null) return;

    const containerDiv = containerRef.current;
    const { columnCount, columnGap, columnWidth } =
      caclulateColumnProperties(containerDiv);

    containerDiv.style.columnCount = `${columnCount}`;
    containerDiv.style.columnWidth = `${columnWidth}px`;
    containerDiv.style.columnGap = `${columnGap}px`;

    const hasWindowScrollBar = Boolean(
      window.innerWidth - document.documentElement.clientWidth,
    );
    const containerPadding = getContainerPadding({
      columnCount,
      columnGap,
      containerDiv,
      includeScrollBarWidthBuffer: hasWindowScrollBar ? false : true,
    });
    containerDiv.style.padding = containerPadding;
  });

  if (error) return <>`error: ${error.message}`</>;

  return (
    <>
      <div ref={containerRef} className="giphys-masonry-container">
        {hasGiphyData && (
          <>
            {response.data.map((giphy, index, thisArray) => {
              const isLastItem = index === thisArray.length - 1;
              return (
                <Giphy
                  {...giphy}
                  key={giphy.id}
                  index={index}
                  ref={isLastItem ? lastGiphyElementRef : null}
                />
              );
            })}
          </>
        )}
      </div>
      <>{loading && <>Loading ...</>}</>
    </>
  );
};
export default GifsGrid;
