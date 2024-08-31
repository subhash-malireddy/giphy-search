import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance";
import { GiphySearchResponse } from "./types";
import { Maybe } from "../../utility/utilityTypes";
import axios, { AxiosError, isAxiosError } from "axios";

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
  const [error, setError] = useState<Maybe<AxiosError | Error>>(null);

  const [pageNumber, setPageNumber] = useState(INITIAL_PAGE);

  const offset =
    pageNumber === 1 ? INITIAL_OFFSET : (pageNumber - 1) * NEXT_OFFSET;

  const prevQueryString = useRef(queryString);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(
    function fetchData() {
      if (!queryString || !shouldSearch || loading) return;
      const getGiphs = async () => {
        const apiKey = process.env.REACT_APP_giphy_api_key;
        /* istanbul ignore next */
        if (!apiKey) return;
        /* istanbul ignore next */
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        const searchParams = new URLSearchParams();
        searchParams.append("api_key", apiKey);
        searchParams.append("q", queryString);
        searchParams.append("offset", offset.toString());

        try {
          setLoading(true);
          const { data } = await axiosInstance.get("", {
            params: searchParams,
            signal: abortControllerRef.current.signal,
          });
          prevQueryString.current = queryString;
          const giphySearchResponse =
            /* istanbul ignore next */ !!data && data
              ? (data as GiphySearchResponse)
              : null;
          /* istanbul ignore next */
          if (!giphySearchResponse) return;

          setResponse((prev) => ({
            data: [...(prev?.data || []), ...giphySearchResponse.data],
            meta: data.meta,
            pagination: data.pagination,
          }));
        } catch (err) {
          /* istanbul ignore next */
          if (!!error) return;
          /* istanbul ignore next */
          if (axios.isCancel(err)) {
            console.log("Request canceled", err.message);
          }

          if (isAxiosError(err) || err instanceof Error) {
            setError(err);
            return;
          }

          /* istanbul ignore next */
          console.error("Unexpected error:", err);
          /* istanbul ignore next */
          setError(
            new Error("An unexpected error occurred.", {
              cause: err,
            }),
          );
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
