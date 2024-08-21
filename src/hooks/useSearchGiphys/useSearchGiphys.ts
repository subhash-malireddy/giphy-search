import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { GiphySearchResponse } from "./types";
import { Maybe } from "../../utility/utilityTypes";

interface UseSearchForGifsArgs {
  queryString?: string;
  shouldSearch?: boolean;
  resetShouldSearch?: () => void;
}

const useSearchForGifs = ({
  queryString = "",
  shouldSearch = false,
  resetShouldSearch,
}: UseSearchForGifsArgs) => {
  const [response, setResponse] = useState<Maybe<GiphySearchResponse>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!queryString || !shouldSearch) return;
    const searchGiphys = async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("api_key", process.env.REACT_APP_giphy_api_key);
      searchParams.append("q", queryString);
      searchParams.append("offset", offset.toString());

      try {
        setLoading(true);
        const { data } = await axiosInstance.get("", {
          params: searchParams,
        });
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
        setError(err.message);
      } finally {
        setLoading(false);
        if (resetShouldSearch) {
          resetShouldSearch();
        }
      }
    };

    searchGiphys();
  }, [queryString, shouldSearch, offset, resetShouldSearch]);

  useEffect(
    function resetAllState() {
      setResponse(null);
      setLoading(false);
      setError(undefined);
      setOffset(0);
    },
    [queryString],
  );

  const loadMore = () => {
    setOffset(offset + 20);
  };

  return { response, loading, error, loadMore } as const;
};

export default useSearchForGifs;
