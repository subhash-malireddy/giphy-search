import { useState, useRef, useEffect } from "react";

interface UseHoverProps {
  onHover?: () => void;
  onLeave?: () => void;
}

const useHover = ({ onHover, onLeave }: UseHoverProps = {}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseOver = () => {
      setIsHovering(true);
      if (onHover) onHover();
    };

    const handleMouseOut = () => {
      setIsHovering(false);
      if (onLeave) onLeave();
    };

    const element = ref.current;
    if (!element) return;

    element.addEventListener("mouseover", handleMouseOver);
    element.addEventListener("mouseout", handleMouseOut);

    return () => {
      element.removeEventListener("mouseover", handleMouseOver);
      element.removeEventListener("mouseout", handleMouseOut);
    };
  }, [onHover, onLeave]);

  return [isHovering, ref] as const;
};

export default useHover;
