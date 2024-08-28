import { renderHook, act, waitFor } from "@testing-library/react";
import useNetworkSpeed from "./useNetworkSpeed";
import axiosInstance from "../../api/axiosInstance";

jest.mock("../../api/axiosInstance");

let mockConnection: any;

beforeEach(() => {
  mockConnection = {
    effectiveType: "4g",
    downlink: 10,
    rtt: 50,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };

  (global as any).navigator.connection = mockConnection;
});

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe("TESTING useNetworkSpeed hook", () => {
  describe("GIVEN a valid network connection object", () => {
    describe("WHEN the hook is rendered", () => {
      it("THEN returns the correct network speed based on the connection object", () => {
        const { result } = renderHook(() => useNetworkSpeed());

        expect(result.current).toEqual({
          effectiveType: "4g",
          downlink: 10,
          rtt: 50,
        });
      });
    });

    describe("WHEN the network connection changes", () => {
      it("THEN updates the network speed", () => {
        const { result } = renderHook(() => useNetworkSpeed());

        act(() => {
          mockConnection.effectiveType = "3g";
          mockConnection.downlink = 0.7;
          mockConnection.rtt = 300;

          mockConnection.addEventListener.mock.calls[0][1]();
        });

        expect(result.current).toEqual({
          effectiveType: "3g",
          downlink: 0.7,
          rtt: 300,
        });
      });
    });

    describe("WHEN the hook is unmounted", () => {
      it("THEN cleans up the event listener", () => {
        const { unmount } = renderHook(() => useNetworkSpeed());

        unmount();

        expect(mockConnection.removeEventListener).toHaveBeenCalled();
      });
    });
  });

  describe("GIVEN no network connection object", () => {
    describe("WHEN estimating network speed by downloading a small image", () => {
      it("THEN sets the network speed state correctly", async () => {
        (global as any).navigator.connection = undefined;
        const mockedAxios = axiosInstance.get as jest.Mock;
        mockedAxios.mockImplementationOnce((...args: any) => {
          return new Promise<{}>((resolve) => {
            setTimeout(() => {
              resolve({});
            }, 2000);
          });
        });

        const { result } = renderHook(() => useNetworkSpeed());

        await waitFor(
          () => {
            expect(result.current.effectiveType).toBeDefined();
            expect(result.current.downlink).toBeGreaterThan(0);
            expect(result.current.rtt).toBeGreaterThan(0);
          },
          { timeout: 2500 },
        );
      });

      it("THEN handles errors during network speed estimation", async () => {
        (global as any).navigator.connection = undefined;
        const mockedAxios = axiosInstance.get as jest.Mock;
        mockedAxios.mockRejectedValue(new Error("Network Error"));

        const { result } = renderHook(() => useNetworkSpeed());

        await waitFor(() => {
          expect(result.current.effectiveType).toBe("unknown");
          expect(result.current.downlink).toBe(0);
          expect(result.current.rtt).toBe(0);
        });
      });
    });
  });
});
