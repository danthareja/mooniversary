import React from "react";
import Image from "next/image";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { useTransitionState } from "react-transition-state";
import { cn } from "@/lib/utils";

const createEmptyBoundingClientRect = (): DOMRect => {
  return {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  };
};

interface MoonSliderProps {
  size?: number;
  children: React.ReactElement;
}

export function MoonSlider({ size = 100, children }: MoonSliderProps) {
  const [basket, setBasket] = React.useState(createEmptyBoundingClientRect());
  const [ball, setBall] = React.useState(createEmptyBoundingClientRect());
  const [isComplete, setIsComplete] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const complete = React.useCallback(() => {
    if (!isComplete) {
      setIsComplete(true);
    }
  }, [isComplete]);

  const [{ status, isMounted }, toggle] = useTransitionState({
    timeout: 200,
    mountOnEnter: true,
    unmountOnExit: true,
    preEnter: true,
  });

  React.useEffect(() => {
    toggle(isComplete);
  }, [isComplete, toggle]);

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden">
      {(!isComplete || (isComplete && status !== "entered")) && (
        <main
          className={`flex-1 flex flex-col justify-end items-center absolute inset-0 transition-opacity duration-200 px-4 py-8${
            isComplete && (status === "entering" || status === "entered")
              ? " opacity-0"
              : " opacity-100"
          }`}
        >
          <MoonSliderBasket
            className="absolute top-8 right-8 z-20"
            size={size}
            onMount={setBasket}
            isDragging={isDragging}
            isComplete={isComplete}
          />

          <div className="flex flex-col items-center space-y-6 mb-28">
            <MoonSliderBall
              className="z-20"
              size={size}
              basket={basket}
              ball={ball}
              onMount={setBall}
              onComplete={complete}
              onDragStart={() => setIsDragging(true)}
              onDragStop={() => setIsDragging(false)}
              isComplete={isComplete}
            />
            <p className="text-center leading-relaxed text-xl text-white/90 px-1 sm:px-4 w-full max-w-lg [text-shadow:_-3px_-3px_0_#000,_3px_-3px_0_#000,_-3px_3px_0_#000,_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000,_2px_2px_0_#000]">
              Drag the moon into the sky to see the date of our next
              Mooniversary
            </p>
          </div>
        </main>
      )}

      {isMounted && (
        <div
          className={`absolute inset-0 transition-opacity duration-200${
            status === "preEnter" || status === "entering"
              ? " opacity-0"
              : " opacity-100"
          }`}
        >
          {React.cloneElement(children)}
        </div>
      )}
    </div>
  );
}

interface MoonSliderBallProps {
  threshold?: number;
  className?: string;
  size: number;
  basket: DOMRect;
  ball: DOMRect;
  onMount: (rect: DOMRect) => void;
  onComplete: () => void;
  onDragStart: () => void;
  onDragStop: () => void;
  isComplete: boolean;
}

export function MoonSliderBall({
  threshold = 15,
  className,
  size,
  basket,
  ball,
  onMount,
  onComplete,
  onDragStart,
  onDragStop,
  isComplete,
}: MoonSliderBallProps) {
  const ballRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  // Initialize ball location
  React.useEffect(() => {
    onMount(
      ballRef.current
        ? ballRef.current.getBoundingClientRect()
        : createEmptyBoundingClientRect(),
    );
  }, [onMount]);

  // Snap to center of basket once within threshold
  React.useEffect(() => {
    if (isComplete) {
      setPosition({ x: basket.x - ball.x, y: basket.y - ball.y });
    }
  }, [isComplete, basket.x, ball.x, basket.y, ball.y]);

  const handleDragStart = () => {
    onDragStart();
  };

  const handleDragStop = () => {
    onDragStop();
  };

  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    const ballRect = data.node.getBoundingClientRect();
    if (
      Math.abs(ballRect.top - basket.top) < threshold &&
      Math.abs(ballRect.left - basket.left) < threshold &&
      Math.abs(ballRect.bottom - basket.bottom) < threshold &&
      Math.abs(ballRect.right - basket.right) < threshold
    ) {
      onComplete();
      return false;
    } else {
      setPosition({ x: data.x, y: data.y });
    }
  };

  return (
    <Draggable
      disabled={isComplete}
      position={position}
      onStart={handleDragStart}
      onStop={handleDragStop}
      onDrag={handleDrag}
      nodeRef={ballRef}
    >
      <div
        data-test="moon-ball"
        className={cn(className)}
        ref={ballRef}
        style={{
          zIndex: 2,
          height: `${size}px`,
          width: `${size}px`,
          cursor: isComplete ? "default" : "pointer",
        }}
      >
        <Image
          alt="moon"
          draggable="false"
          src="/moon.png"
          width={size}
          height={size}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>
    </Draggable>
  );
}

interface MoonSliderBasketProps {
  className?: string;
  size: number;
  onMount: (rect: DOMRect) => void;
  isDragging: boolean;
  isComplete: boolean;
}

export function MoonSliderBasket({
  className,
  size,
  onMount,
  isComplete,
}: MoonSliderBasketProps) {
  const basketRef = React.useRef<HTMLDivElement>(null);

  // Initialize basket location
  React.useEffect(() => {
    onMount(
      basketRef.current
        ? basketRef.current.getBoundingClientRect()
        : createEmptyBoundingClientRect(),
    );
  }, [onMount]);

  return (
    <div
      ref={basketRef}
      data-test="moon-basket"
      className={cn(className, "transition-all duration-300", {
        "animate-pulse": !isComplete,
      })}
      style={{
        zIndex: 2,
        height: `${size}px`,
        width: `${size}px`,
        borderRadius: `${size}px`,
        border: `4px dashed rgba(255, 255, 255, 0.9)`,
        boxShadow: !isComplete ? "0 0 20px rgba(255, 255, 255, 0.3)" : "none",
      }}
    ></div>
  );
}
