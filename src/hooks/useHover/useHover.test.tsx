import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import useHover from "./useHover";

afterEach(() => {
  onHover.mockReset();
  onLeave.mockReset();
});

describe("TESTING useHover", () => {
  describe("GIVEN the coorect args for hte hook", () => {
    describe("WHEN the hook is invoked", () => {
      it('should initially be "Not hovering"', () => {
        const { result } = renderHook(() => useHover());
        expect(result.current[0]).toBeFalsy();
      });

      it('should change to "Hovering" on hover', () => {
        customHookRenderer();
        const hoverDiv = screen.getByTestId("hoverDiv");
        fireEvent.mouseOver(hoverDiv);
        expect(screen.getByText("Hovering")).toBeInTheDocument();
        expect(onHover).toHaveBeenCalledTimes(1);
      });

      it('should change back to "Not hovering" on mouseout', () => {
        customHookRenderer();
        const hoverDiv = screen.getByTestId("hoverDiv");
        fireEvent.mouseOver(hoverDiv);
        expect(onHover).toHaveBeenCalledTimes(1);
        fireEvent.mouseOut(hoverDiv);
        expect(screen.getByText("Not hovering")).toBeInTheDocument();
        expect(onLeave).toHaveBeenCalledTimes(1);
      });
    });
  });
});

const HoverTestComponent = () => {
  const [isHovering, ref] = useHover({ onHover, onLeave });
  return (
    <div ref={ref} data-testid="hoverDiv">
      {isHovering ? "Hovering" : "Not hovering"}
    </div>
  );
};

const customHookRenderer = () => {
  render(<HoverTestComponent />);
};

const onHover = jest.fn();
const onLeave = jest.fn();
