import useSearchForGifs from "../../../hooks/useSearchGiphys";
import "./GiphyMasonry.css";
import { useCallback, useEffect, useRef } from "react";
import { calculateColumnProperties, getContainerPadding } from "./utils";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";
import useNetworkSpeed from "../../../hooks/useNetworkSpeed";
import { AxiosError } from "axios";
import Giphy from "./Giphy";

interface GiphyMasonryProps {
  queryString: string;
  shouldSearch: boolean;
  resetShouldSearch: () => void;
  allowSearch: () => void;
}

const GiphyMasonry = ({
  queryString,
  shouldSearch,
  resetShouldSearch,
  allowSearch,
}: GiphyMasonryProps) => {
  const { response, loading, error, loadMore } = useSearchForGifs({
    queryString,
    shouldSearch,
    resetShouldSearch,
    allowSearch,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const hasGiphyData = response && response.data.length;

  /* istanbul ignore next */
  const hasMoreGiphysToLoad = Boolean(
    !!hasGiphyData &&
      response?.pagination.total_count &&
      response?.data.length < response?.pagination.total_count,
  );

  const fetchMoreGiphsOnIntersection: IntersectionObserverCallback =
    useCallback(
      /* istanbul ignore next */
      //* Ignored because the firing of the callback is tested with useIntersectionObserver
      //* perhaps a better candidate for an integration/E2E test
      (entries) => {
        if (
          !!entries[0] &&
          entries[0].isIntersecting &&
          hasMoreGiphysToLoad &&
          !loading
        ) {
          loadMore();
        }
      },
      [hasMoreGiphysToLoad, loading, loadMore],
    );

  const lastGiphyElementRef = useIntersectionObserver<HTMLDivElement>({
    callback: fetchMoreGiphsOnIntersection,
  });

  const networkSpeed = useNetworkSpeed();

  useEffect(function setContainerStyling() {
    if (containerRef.current === null) return;

    const containerDiv = containerRef.current;

    const containerOffsetWidth = containerDiv.offsetWidth;
    const { columnCount, columnGap, columnWidth } =
      calculateColumnProperties(containerOffsetWidth);

    containerDiv.style.columnCount = `${columnCount}`;
    containerDiv.style.columnWidth = `${columnWidth}px`;
    containerDiv.style.columnGap = `${columnGap}px`;

    const hasWindowScrollBar = Boolean(
      window.innerWidth - document.documentElement.clientWidth,
    );
    /* istanbul ignore next */
    const includeScrollBarWidthBuffer = hasWindowScrollBar ? false : true;
    const containerPadding = getContainerPadding({
      columnCount,
      columnGap,
      containerOffsetWidth,
      includeScrollBarWidthBuffer,
    });
    containerDiv.style.padding = containerPadding;
  });

  if (error) return <SearchError error={error} />;

  return (
    <>
      <div
        ref={containerRef}
        className="giphys-masonry-container"
        data-testid="giphys-masonry-container"
      >
        {!!hasGiphyData && (
          <>
            {response.data.map((giphy, index, thisArray) => {
              const isLastItem = index === thisArray.length - 1;
              return (
                <Giphy
                  {...giphy}
                  key={giphy.id}
                  callbackRef={isLastItem ? lastGiphyElementRef : null}
                  connectionType={networkSpeed.effectiveType}
                />
              );
            })}
          </>
        )}
      </div>
      {loading && <>Loading ...</>}
      {!!hasGiphyData &&
        response.data.length === response.pagination.total_count && (
          <>That's all we have!!</>
        )}
    </>
  );
};
export default GiphyMasonry;

// istanbul ignore next
function SearchError({ error }: { error: AxiosError | Error }) {
  return (
    <>{`error: ${
      error.message.includes("414")
        ? "Search Text Should be less than 50 characters"
        : error.message
    }`}</>
  );
}
