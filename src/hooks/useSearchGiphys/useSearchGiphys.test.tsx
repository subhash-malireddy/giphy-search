import axiosInstance from "../../api/axiosInstance";
import useSearchGiphys from "./useSearchGiphys";
import { GiphySearchResponse } from "./types";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useState } from "react";

jest.mock("../../api/axiosInstance");

describe("TESTING useSearchForGifs hook", () => {
  describe("GIVEN the required args", () => {
    describe("WHEN the queryString is falsy and shouldSearch is false", () => {
      it("THEN doesn't call api and retruns correct data", () => {
        const { result } = renderHook(() => {
          const [shouldSearch, setShouldSearch] = useState(false);
          const resetShouldSearch = () => {
            setShouldSearch(false);
          };
          const allowSearch = () => {
            setShouldSearch(true);
          };
          return useSearchGiphys({
            queryString: "",
            shouldSearch,
            resetShouldSearch,
            allowSearch,
          });
        });
        expect(result.current.response).toBeNull();
        expect(result.current.loading).toBeFalsy();
        expect(result.current.error).toBeNull();
      });
    });

    describe("WHEN an error occurs during fetching api", () => {
      it("THEN handle error during search", async () => {
        const mockAxiosInstance = {
          get: jest.fn().mockRejectedValueOnce(new Error("Network Error")),
        };
        jest
          .spyOn(axiosInstance, "get")
          .mockImplementation(() => mockAxiosInstance.get());

        const { result } = renderHook(() => {
          const [shouldSearch, setShouldSearch] = useState(true);
          const resetShouldSearch = () => {
            setShouldSearch(false);
          };
          const allowSearch = () => {
            setShouldSearch(true);
          };
          return useSearchGiphys({
            queryString,
            shouldSearch,
            resetShouldSearch,
            allowSearch,
          });
        });

        expect(result.current.loading).toBeTruthy();

        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(result.current.loading).toBeFalsy());
        expect(result.current.error).toBeDefined();
      });
    });

    describe("WHEN the queryString valid/truthy and shouldSearch is true", () => {
      it("THEN returns loading's value as true and calls the api and returns correct data", async () => {
        const mockAxiosInstance = {
          get: jest.fn().mockResolvedValueOnce({ data: mockData }),
        };
        jest
          .spyOn(axiosInstance, "get")
          .mockImplementation(() => mockAxiosInstance.get());

        const { result } = renderHook(() => {
          const [shouldSearch, setShouldSearch] = useState(true);
          const resetShouldSearch = () => {
            setShouldSearch(false);
          };
          const allowSearch = () => {
            setShouldSearch(true);
          };
          return useSearchGiphys({
            queryString,
            shouldSearch,
            resetShouldSearch,
            allowSearch,
          });
        });

        expect(result.current.loading).toBeTruthy();
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);

        await waitFor(() => expect(result.current.loading).toBeFalsy());

        expect(result.current.error).toBeNull();
        expect(result.current.response).not.toBeNull();
        expect(result.current.response).toEqual(mockData);
      });
    });
    describe("WHEN the loadMore function is called", () => {
      it("THEN fetches more data and calls the api one more time", async () => {
        const mockAxiosInstance = {
          get: jest.fn().mockResolvedValueOnce({ data: mockData }),
        };
        jest
          .spyOn(axiosInstance, "get")
          .mockImplementation(() => mockAxiosInstance.get());

        const { result } = renderHook(() => {
          const [shouldSearch, setShouldSearch] = useState(true);
          const resetShouldSearch = () => {
            setShouldSearch(false);
          };
          const allowSearch = () => {
            setShouldSearch(true);
          };
          return useSearchGiphys({
            queryString,
            shouldSearch,
            resetShouldSearch,
            allowSearch,
          });
        });

        expect(result.current.loading).toBeTruthy();
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);

        await waitFor(() => expect(result.current.loading).toBeFalsy());

        expect(result.current.response).not.toBeNull();
        expect(result.current.response).toEqual(mockData);

        mockAxiosInstance.get.mockResolvedValueOnce({
          data: {
            data: [{ id: "2", url: "https://giphy.com/gifs/2" }],
            meta: { status: 200, msg: "OK", response_id: "abc1234" },
            pagination: { count: 1, offset: 50, total_count: 100 },
          },
        });

        act(() => {
          result.current.loadMore();
        });

        () => expect(result.current.loading).toBeTruthy();

        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);

        await waitFor(() => expect(result.current.loading).toBeFalsy());

        expect(result.current.response).not.toBeNull();
      });
    });

    describe("WHEN the queryString changes ", () => {
      it("THEN resets the local state in the hook", async () => {
        const mockAxiosInstance = {
          get: jest.fn().mockResolvedValueOnce({ data: mockData }),
        };
        jest
          .spyOn(axiosInstance, "get")
          .mockImplementation(() => mockAxiosInstance.get());

        const { result, rerender } = renderHook(
          ({
            queryString,
          }: Pick<Parameters<typeof useSearchGiphys>[0], "queryString">) => {
            const [shouldSearch, setShouldSearch] = useState(true);
            const resetShouldSearch = () => {
              setShouldSearch(false);
            };
            const allowSearch = () => {
              setShouldSearch(true);
            };
            return useSearchGiphys({
              queryString,
              shouldSearch,
              resetShouldSearch,
              allowSearch,
            });
          },
          {
            initialProps: {
              queryString,
            },
          },
        );

        expect(result.current.loading).toBeTruthy();
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);

        await waitFor(() => expect(result.current.loading).toBeFalsy());

        rerender({ queryString: "angry dogs" });

        await waitFor(() => {
          expect(result.current.response).toBeNull();
          expect(result.current.loading).toBeFalsy();
          expect(result.current.error).toBeNull();
        });
      });
    });
  });
});

const queryString = "funny cats";
const mockData: GiphySearchResponse = {
  data: [{ id: "1", url: "https://giphy.com/gifs/1" }],
  meta: { status: 200, msg: "OK", response_id: "abc123" },
  pagination: { count: 1, offset: 0, total_count: 100 },
};

process.env.REACT_APP_giphy_api_key = "fake-key";
