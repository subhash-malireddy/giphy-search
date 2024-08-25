// global.d.ts
export {};

declare global {
  interface NetworkInformation extends EventTarget {
    downlink: number;
    effectiveType: "slow-2g" | "2g" | "3g" | "4g" | "unknown";
    rtt: number;
    saveData: boolean;
    addEventListener(
      type: "change",
      listener: (this: NetworkInformation, ev: Event) => any,
    ): void;
  }

  interface Navigator {
    connection?: NetworkInformation;
  }
}
