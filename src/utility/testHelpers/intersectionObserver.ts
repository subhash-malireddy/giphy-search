// istanbul ignore file
// adapted from https://github.com/thebuilder/react-intersection-observer/blob/d35365990136bfbc99ce112270e5ff232cf45f7f/src/test-helper.ts
// found on https://jaketrent.com/post/test-intersection-observer-react/
const observerMap = new Map();
const instanceMap = new Map();

beforeEach(() => {
  //@ts-expect-error because type of jest.fn() cannot be assigned to global.IntersectionObserver. But this is fine here as it this is meant to be used in testing environments only.
  global.IntersectionObserver = jest.fn((cb, options = {}) => {
    const instance = {
      thresholds: Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold],
      root: options.root,
      rootMargin: options.rootMargin,
      observe: jest.fn((element: Element) => {
        instanceMap.set(element, instance);
        observerMap.set(element, cb);
      }),
      unobserve: jest.fn((element: Element) => {
        instanceMap.delete(element);
        observerMap.delete(element);
      }),
      disconnect: jest.fn(),
    };
    return instance;
  });
});

afterEach(() => {
  (global.IntersectionObserver as jest.Mock).mockReset();
  instanceMap.clear();
  observerMap.clear();
});

export function intersect(element: Element, isIntersecting: boolean) {
  const cb = observerMap.get(element);
  if (!isIntersecting || !cb) return;

  cb([
    {
      isIntersecting,
      target: element,
      intersectionRatio: isIntersecting ? 1 : -1,
    },
  ]);
}

export function getObserverOf(element: Element): IntersectionObserver {
  return instanceMap.get(element);
}
