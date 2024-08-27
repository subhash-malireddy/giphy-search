import { render } from "@testing-library/react";

import useIntersectionObserver from "./useIntersectionObserver";
import {
  getObserverOf,
  intersect,
} from "../../utility/testHelpers/intersectionObserver";

describe("TESTING useIntersectionObserver", () => {
  describe("GIVEN required props are provided", () => {
    describe("WHEN there is a previous reference to an HTMLElement", () => {
      it("THEN disconnects the observer on the previous element", () => {
        const callback = jest.fn();

        const { getByTestId, unmount } = render(
          <Observed callback={callback} />,
        );
        const wrapper = getByTestId("wrapper");
        unmount();
        expect(getObserverOf(wrapper).disconnect).toHaveBeenCalledTimes(1);
      });
    });

    describe("WHEN there is no previous reference to an HTMLElemnt", () => {
      it("THEN creates an observer", () => {
        const callback = jest.fn();
        const { getByTestId } = render(<Observed callback={callback} />);
        const wrapper = getByTestId("wrapper");
        const instance = getObserverOf(wrapper);

        expect(instance.observe).toHaveBeenCalledWith(wrapper);
      });

      it("THEN does not call the callback without intersection", () => {
        const callback = jest.fn();
        const { getByTestId } = render(<Observed callback={callback} />);

        const wrapper = getByTestId("wrapper");
        intersect(wrapper, false);

        expect(callback).not.toHaveBeenCalled();
      });

      it("THEN calls the callback on intersection", () => {
        const callback = jest.fn();
        const { getByTestId } = render(<Observed callback={callback} />);

        const wrapper = getByTestId("wrapper");
        intersect(wrapper, true);

        expect(callback).toHaveBeenCalledTimes(1);
      });

      it("THEN calls the callback only once", () => {
        const callback = jest.fn();
        const { getByTestId } = render(<Observed callback={callback} />);

        const wrapper = getByTestId("wrapper");
        intersect(wrapper, false);
        intersect(wrapper, false);
        intersect(wrapper, true);

        expect(callback).toHaveBeenCalledTimes(1);
      });
    });
  });
});

function Observed({ callback }: { callback: () => void }) {
  const ref = useIntersectionObserver({ callback });
  return <div data-testid="wrapper" ref={ref}></div>;
}
