import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance";
import { GiphySearchResponse } from "./types";
import { Maybe } from "../../utility/utilityTypes";

interface UseSearchForGifsArgs {
  queryString: string;
  shouldSearch: boolean;
  resetShouldSearch: () => void;
  allowSearch: () => void;
}

const INITIAL_PAGE = 1;
const INITIAL_OFFSET = 0;
const NEXT_OFFSET = 50;

const useSearchForGifs = ({
  queryString,
  shouldSearch,
  resetShouldSearch,
  allowSearch,
}: UseSearchForGifsArgs) => {
  const [response, setResponse] = useState<Maybe<GiphySearchResponse>>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Maybe<Error>>(null);

  const [pageNumber, setPageNumber] = useState(INITIAL_PAGE);

  const offset =
    pageNumber === 1 ? INITIAL_OFFSET : (pageNumber - 1) * NEXT_OFFSET;

  const prevQueryString = useRef(queryString);

  useEffect(
    function fetchData() {
      if (!queryString || !shouldSearch || loading) return;
      const getGiphs = async () => {
        const apiKey = process.env.REACT_APP_giphy_api_key;
        /* istanbul ignore next */
        if (!apiKey) return;
        const searchParams = new URLSearchParams();
        searchParams.append("api_key", apiKey);
        searchParams.append("q", queryString);
        searchParams.append("offset", offset.toString());

        try {
          setLoading(true);
          const { data } = await axiosInstance.get("", {
            params: searchParams,
          });
          prevQueryString.current = queryString;

          setResponse((prev) => ({
            data: [...(prev?.data || []), ...data.data],
            meta: data.meta,
            pagination: data.pagination,
          }));
        } catch (err) {
          /* istanbul ignore next */
          if (!!error) return;
          setError(err as Error);
        } finally {
          setLoading(false);
          if (resetShouldSearch) {
            resetShouldSearch();
          }
        }
      };

      getGiphs();
    },
    [queryString, offset, error, loading, shouldSearch, resetShouldSearch],
  );

  useEffect(
    function resetAllState() {
      if (prevQueryString.current === queryString) return;
      setResponse(null);
      setLoading(false);
      setError(null);
      setPageNumber(INITIAL_PAGE);
    },
    [queryString],
  );

  const loadMore = useCallback(() => {
    setPageNumber((pageNumber) => pageNumber + 1);
    allowSearch();
  }, [allowSearch]);

  return { response, loading, error, loadMore } as const;
};

export default useSearchForGifs;
