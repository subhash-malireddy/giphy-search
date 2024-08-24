import { useCallback, useRef } from "react";

const useIntersectionObserver = <T extends Element>({
  callback,
  options,
}: {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
}) => {
  const observer = useRef<IntersectionObserver>(null);
  const lastGiphyElementRef: React.RefCallback<T> = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(callback, options);

      if (node) observer.current.observe(node);
    },
    [callback, options],
  );
  return lastGiphyElementRef;
};

export default useIntersectionObserver;
