import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

interface NetworkSpeed {
  effectiveType: "slow-2g" | "2g" | "3g" | "4g" | "unknown";
  downlink: number; // in Mbps
  rtt: number; // in milliseconds
}

const useNetworkSpeed = (): NetworkSpeed => {
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>({
    effectiveType: "unknown",
    downlink: 0,
    rtt: 0,
  });

  useEffect(() => {
    const updateNetworkSpeed = () => {
      if (!!navigator.connection) {
        const connection = navigator.connection;

        setNetworkSpeed({
          effectiveType:
            connection.effectiveType as NetworkSpeed["effectiveType"],
          downlink: connection.downlink,
          rtt: connection.rtt,
        });
      } else {
        estimateNetworkSpeed();
      }
    };

    const estimateNetworkSpeed = async () => {
      // link to a known and smaller giphy still image.
      const imageUrl =
        "https://media0.giphy.com/media/l396DXqZ6Y0Y4WTde/100w_s.gif?cid=42d8d9dbd0v2iy1r52dm0zd4vry2apsx365szo7wkva5eaaz&ep=v1_gifs_search&rid=100w_s.gif&ct=g"; // Small file URL
      const startTime = performance.now();
      try {
        await axiosInstance.get(imageUrl, {
          headers: {
            "Cache-Control": "no-store",
          },
        });
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // in seconds
        const fileSizeInBytes = 272; // Observed size of the image in bytes
        const speedBps = fileSizeInBytes / duration;
        const speedKbps = speedBps / 1024;
        const speedMbps = speedKbps / 1024;

        const rtt = duration * 1000; // Convert to milliseconds
        const effectiveType = deriveEffectiveType(rtt, speedKbps);

        setNetworkSpeed({
          effectiveType,
          downlink: speedMbps,
          rtt,
        });
      } catch (error) {
        console.error("Network speed estimation failed:", error);
      }
    };
    /* istanbul ignore next */
    // ignored but does have a test for the first if condition
    const deriveEffectiveType = (
      rtt: number,
      downlinkKbps: number,
    ): NetworkSpeed["effectiveType"] => {
      if (rtt >= 2000 && downlinkKbps <= 50) {
        return "slow-2g";
      } else if (rtt >= 1400 && downlinkKbps <= 70) {
        return "2g";
      } else if (rtt >= 270 && downlinkKbps <= 700) {
        return "3g";
      } else {
        return "4g";
      }
    };

    updateNetworkSpeed();

    if (!!navigator.connection) {
      const connection = navigator.connection;
      connection.addEventListener("change", updateNetworkSpeed);

      return () => {
        connection.removeEventListener("change", updateNetworkSpeed);
      };
    }
  }, []);

  return networkSpeed;
};

export default useNetworkSpeed;
