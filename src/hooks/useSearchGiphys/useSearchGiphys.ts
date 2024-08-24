import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance";
import { GiphySearchResponse } from "./types";
import { Maybe } from "../../utility/utilityTypes";

interface UseSearchForGifsArgs {
  queryString?: string;
  shouldSearch?: boolean;
  resetShouldSearch?: () => void;
}

const DEFAULT_SERVER_RETURN_GIPHS_COUNT = 50;
const useSearchForGifs = ({
  queryString = "",
  shouldSearch = false,
  resetShouldSearch,
}: UseSearchForGifsArgs) => {
  const [response, setResponse] = useState<Maybe<GiphySearchResponse>>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Maybe<Error>>(undefined);

  const [pageNumber, setPageNumber] = useState(1);

  const offset = pageNumber * DEFAULT_SERVER_RETURN_GIPHS_COUNT;

  const prevQueryString = useRef(queryString);

  useEffect(
    function fetchData() {
      if (!queryString || !shouldSearch || loading) return;
      const getGiphs = async () => {
        const apiKey = process.env.REACT_APP_giphy_api_key;
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
          if (offset === 0) {
            setResponse(data);
          } else {
            setResponse((prev) => ({
              data: [...(prev?.data || []), ...data.data],
              meta: data.meta,
              pagination: data.pagination,
            }));
          }
        } catch (err) {
          //@ts-ignore
          setError(Error(err));
        } finally {
          setLoading(false);
          if (resetShouldSearch) {
            resetShouldSearch();
          }
        }
      };

      getGiphs();
    },
    [queryString, offset, loading, shouldSearch, resetShouldSearch],
  );

  useEffect(
    function resetAllState() {
      if (prevQueryString.current === queryString) return;
      setResponse(null);
      setLoading(false);
      setError(undefined);
      setPageNumber(0);
    },
    [queryString],
  );

  const loadMore = useCallback(() => {
    setPageNumber((pageNumber) => pageNumber + 1);
  }, []);

  return { response, loading, error, loadMore } as const;
};

export default useSearchForGifs;
