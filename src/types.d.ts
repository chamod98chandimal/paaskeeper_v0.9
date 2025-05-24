export {};

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (...args: unknown[]) => void;
      removeListener?: (...args: unknown[]) => void;
    };
  }
}
