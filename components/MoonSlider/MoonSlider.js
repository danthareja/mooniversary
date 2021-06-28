import React from "react";
import Image from "next/image";
import Draggable from "react-draggable";

const MoonContext = React.createContext();

export function MoonSliderProvider({ size = 100, onComplete, children }) {
  const [basket, setBasket] = React.useState({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const [ball, setBall] = React.useState({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const [isComplete, setIsComplete] = React.useState(false);

  const value = {
    size,
    basket,
    setBasket,
    ball,
    setBall,
    isComplete,
    complete: () => {
      if (!isComplete) {
        setIsComplete(true);
      }
    },
  };

  React.useEffect(() => {
    if (isComplete) {
      if (typeof onComplete === "function") {
        onComplete();
      }
    }
  }, [isComplete]);

  return <MoonContext.Provider value={value}>{children}</MoonContext.Provider>;
}

export function MoonSliderBall({ threshold = 25, className }) {
  const context = React.useContext(MoonContext);
  if (context === undefined) {
    throw new Error("MoonSliderBall must be used within a MoonSliderProvider");
  }

  const { basket, ball, setBall, isComplete, complete, size } = context;
  const ballRef = React.useRef(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  // Initialize ball location
  React.useEffect(() => {
    setBall(ballRef.current.getBoundingClientRect());
  }, [size]);

  // Snap to center of basket once within threshold
  React.useEffect(() => {
    if (isComplete) {
      setPosition({ x: basket.x - ball.x, y: basket.y - ball.y });
    }
  }, [isComplete]);

  const handleDrag = (_, data) => {
    const ball = data.node.getBoundingClientRect();
    if (
      Math.abs(ball.top - basket.top) < threshold &&
      Math.abs(ball.left - basket.left) < threshold &&
      Math.abs(ball.bottom - basket.bottom) < threshold &&
      Math.abs(ball.right - basket.right) < threshold
    ) {
      complete();
      return false;
    } else {
      setPosition({ x: data.x, y: data.y });
    }
  };

  return (
    <Draggable
      disabled={isComplete}
      position={position}
      onDrag={handleDrag}
      nodeRef={ballRef}
    >
      <div
        className={className}
        ref={ballRef}
        style={{
          zIndex: 2,
          height: `${size}px`,
          width: `${size}px`,
          cursor: isComplete ? "default" : "pointer",
          opacity: isComplete ? 0 : 1,
          transition: "opacity 250ms",
        }}
      >
        <Image
          alt="moon"
          draggable="false"
          src="/moon.png"
          width={size}
          height={size}
        />
      </div>
    </Draggable>
  );
}

export function MoonSliderBasket({ className }) {
  const context = React.useContext(MoonContext);
  if (context === undefined) {
    throw new Error(
      "MoonSliderBasket must be used within a MoonSliderProvider"
    );
  }

  const { size, setBasket, isComplete } = context;
  const basketRef = React.useRef(null);

  // Initialize basket location
  React.useEffect(() => {
    setBasket(basketRef.current.getBoundingClientRect());
  }, [size]);

  return (
    <div
      ref={basketRef}
      className={className}
      style={{
        zIndex: 1,
        height: `${size}px`,
        width: `${size}px`,
        borderRadius: `${size}px`,
        border: `4px dashed rgba(255, 255, 255, 0.9)`,
        opacity: isComplete ? 0 : 1,
        transition: `opacity 250ms`,
      }}
    ></div>
  );
}

export function useMoonSlider() {
  const context = React.useContext(MoonContext);
  if (context === undefined) {
    throw new Error("useMoonSlider must be used within a MoonSliderProvider");
  }

  const { isComplete } = context;
  return { isComplete };
}
