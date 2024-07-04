import { useState } from "react";

const useSwipe = () => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchVertStart, setTouchVertStart] = useState<number>(0);
  const [touchVertEnd, setTouchVertEnd] = useState<number>(0);
  const [touchDirection, setTouchDirection] = useState("");

  const minSwipeDistance = 50;

  const resetActions = () => {
    setTouchDirection("");
  };

  const onTouchStart = (e: any) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
    setTouchVertEnd(0);
    setTouchVertStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: any) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchVertEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    // const isRightSwipe = distance < -minSwipeDistance;

    if (
      Math.abs(touchStart - touchEnd) > Math.abs(touchVertStart - touchVertEnd)
    ) {
      isLeftSwipe ? setTouchDirection("left") : setTouchDirection("right");
    } else {
      isLeftSwipe ? setTouchDirection("top") : setTouchDirection("bottom");
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    touchDirection,
    resetActions,
  };
};

export { useSwipe };
