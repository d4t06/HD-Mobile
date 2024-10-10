import {
   useEffect,
   useRef,
   useState,
   MouseEvent,
   DOMAttributes,
   TouchEvent,
} from "react";

type Props = {
   data: SliderImage[];
   autoSlide?: number;
   size?: number;
};

const SLIDER_BREAK_POINT = 768;

export default function useSlider({ data, autoSlide, size = 2 }: Props) {
   const LAST_INDEX =
      window.innerWidth >= SLIDER_BREAK_POINT
         ? data.length - (size - 1)
         : data.length;

   const [curIndex, setCurIndex] = useState(1);
   const [isEnter, setIsEnter] = useState(false);
   const [isDrag, setIsDrag] = useState(false);

   const prevScrollRef = useRef(0);
   const prevPageXRef = useRef(0);
   const scrollRef = useRef(0);
   const timerId = useRef<any>();

   const sliderRef = useRef<HTMLDivElement>(null);

   const getSliderWidth = () => {
      const sliderEle = sliderRef.current;
      if (!sliderEle) return 0;

      return Math.ceil(
         window.innerWidth >= SLIDER_BREAK_POINT
            ? sliderEle.clientWidth / size
            : sliderEle.clientWidth
      );
   };

   const startDrag = (pageX: number) => {
      if (pageX === undefined) return console.log("pageX is undefined");
      const isFinish = checkIsScrollFinish(curIndex);
      if (!isFinish) return;

      setIsDrag(true);
      prevPageXRef.current = pageX;

      const sliderEle = sliderRef.current;
      if (!sliderEle) return;

      sliderEle.style.scrollBehavior = "auto";
   };

   const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
      const pageX = e.changedTouches[0].pageX;
      if (!data.length || data.length === 1) return;
      startDrag(pageX);
   };

   const handleStartDrag = (
      e: MouseEvent<HTMLElement, globalThis.MouseEvent>
   ) => {
      e.preventDefault();

      if (!data.length || data.length === 1) return;
      startDrag(e.pageX);
   };

   const getNewIndex = () => {
      let newIndex = curIndex;
      if (!sliderRef.current) return newIndex;

      const distance = scrollRef.current - prevScrollRef.current;
      const minimum = sliderRef.current.clientWidth / 4;

      // console.log("check distance", distance);

      if (distance > 0) {
         if (newIndex === LAST_INDEX) newIndex -= 1;
         else if (Math.abs(distance) > minimum) newIndex += 1;
      } else if (distance < 0) {
         if (newIndex === 1) newIndex += 1;
         else if (Math.abs(distance) > minimum) newIndex -= 1;
      }

      return newIndex;
   };

   const handleMouseLeave = () => {
      setIsEnter(false);
      if (isDrag) handleStopDrag();
   };

   const drag = (pageX: number) => {
      if (!sliderRef.current) return;

      const sliderWidth = getSliderWidth();

      const distance = pageX - prevPageXRef.current;
      const newScrollLeft = prevScrollRef.current - distance;

      const isValid =
         newScrollLeft > 0 && newScrollLeft < sliderWidth * LAST_INDEX;

      if (isValid) {
         const sliderEle = sliderRef.current;
         if (!sliderEle) return;

         sliderEle.scrollLeft = newScrollLeft;
      }
      scrollRef.current = newScrollLeft;
   };

   const handleDrag = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
      if (!isDrag) return;
      setIsDrag(true);

      drag(e.pageX);
   };

   const handleTouchMove = (e: TouchEvent<HTMLElement>) => {
      if (!isDrag) return;
      setIsDrag(true);

      const pageX = e.changedTouches[0].pageX;

      drag(pageX);
   };

   const stopDrag = () => {
      if (!sliderRef.current) return;

      const sliderWidth = getSliderWidth();

      if (scrollRef.current === prevScrollRef.current) return;
      if (
         scrollRef.current === 0 ||
         scrollRef.current === sliderWidth * LAST_INDEX
      )
         return;

      const sliderEle = sliderRef.current;
      if (!sliderEle) return;

      sliderEle.style.scrollBehavior = "smooth";

      const newIndex = getNewIndex();

      if (newIndex === curIndex) {
         sliderEle.scrollLeft = prevScrollRef.current;
      } else {
         setCurIndex(newIndex);
      }
      scrollRef.current = 0;
   };

   const handleStopDrag = () => {
      if (!isDrag) return;
      setIsDrag(false);

      stopDrag();
   };

   // important function
   const checkIsScrollFinish = (curIndex: number) => {
      const sliderEle = sliderRef.current;
      if (!sliderEle) return;

      const width = getSliderWidth();

      const expectScroll = (curIndex - 1) * width;
      const diff = Math.ceil(sliderEle.scrollLeft) - Math.ceil(expectScroll);

      return !(Math.abs(diff) > 1);
   };

   const next = () => {
      const sliderEle = sliderRef.current;
      if (!sliderEle) return;
      sliderEle.style.scrollBehavior = "smooth";

      setCurIndex((prev) => {
         const isFinish = checkIsScrollFinish(prev);

         if (isFinish) {
            if (prev === LAST_INDEX) {
               return 1;
            } else {
               return prev + 1;
            }
         } else return prev;
      });
   };

   const previous = () => {
      const sliderEle = sliderRef.current;
      if (!sliderEle) return;

      sliderEle.style.scrollBehavior = "smooth";

      const isFinish = checkIsScrollFinish(curIndex);
      if (!isFinish) return;

      if (curIndex === 1) {
         setCurIndex(LAST_INDEX);
      } else {
         setCurIndex((prev) => prev - 1);
      }
   };

   const resetSlider = () => {
      setCurIndex(1);

      const sliderEle = sliderRef.current;
      if (sliderEle) {
         sliderEle.style.scrollBehavior = "auto";
         sliderEle.scrollLeft = 0;
      }
   };

   useEffect(() => {
      return () => {
         resetSlider();
      };
   }, [data]);

   useEffect(() => {
      const sliderEle = sliderRef.current;
      if (!sliderEle) return;

      const width = getSliderWidth();

      const needToScroll = (curIndex - 1) * width;
      sliderEle.scrollLeft = needToScroll;
      prevScrollRef.current = needToScroll;
   }, [curIndex]);

   // problem
   //   handle auto slider when user hover
   useEffect(() => {
      if (isEnter) return;
      if (!autoSlide) return;
      if (!data.length) return;

      timerId.current = setInterval(() => {
         console.log("auto slide");
         next();
      }, autoSlide);

      return () => {
         if (timerId.current) {
            console.log("clear");
            clearInterval(timerId.current);
         }
      };
   }, [isEnter, data]);

   const attributeObj: DOMAttributes<HTMLElement> = {
      onMouseDown: (e) => handleStartDrag(e),
      onTouchStart: (e) => handleTouchStart(e),

      onMouseMove: (e) => handleDrag(e),
      onTouchMove: (e) => handleTouchMove(e),

      onMouseUp: () => handleStopDrag(),
      onTouchEnd: () => handleStopDrag(),

      onMouseEnter: () => setIsEnter(true),
      onMouseLeave: () => handleMouseLeave(),
   };

   return {
      attributeObj,
      next,
      previous,
      curIndex,
      sliderRef,
   };
}
