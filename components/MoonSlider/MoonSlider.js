import React from "react";
import Image from "next/image";
import Draggable from "react-draggable";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import styles from "./MoonSlider.module.css";
import transitionStyles from "./MoonSliderTransition.module.css";

const MoonContext = React.createContext();

const createEmptyBoundingClientRect = () => {
  return {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  };
};

export function MoonSlider({ size, children }) {
  const ref = React.useRef(null);
  return (
    <MoonSliderProvider size={size}>
      <MoonContext.Consumer>
        {({ isComplete }) => {
          return (
            <SwitchTransition>
              <CSSTransition
                timeout={500}
                key={isComplete ? "children" : "slider"}
                addEndListener={(done) => {
                  ref.current.addEventListener("transitionend", done, false);
                }}
                classNames={{
                  ...transitionStyles,
                }}
                nodeRef={ref}
              >
                {isComplete ? (
                  React.cloneElement(children, { ref })
                ) : (
                  <div ref={ref} className={styles.container}>
                    <main className={styles.main}>
                      <MoonSliderBasket className={styles.basket} />
                      <MoonSliderBall className={styles.ball} />
                      <p className={styles.description}>
                        Drag the moon into the sky to see the date of our next
                        Mooniversary
                      </p>
                    </main>
                  </div>
                )}
              </CSSTransition>
            </SwitchTransition>
          );
        }}
      </MoonContext.Consumer>
    </MoonSliderProvider>
  );
}

export function MoonSliderProvider({ size = 100, children }) {
  const [basket, setBasket] = React.useState(createEmptyBoundingClientRect());
  const [ball, setBall] = React.useState(createEmptyBoundingClientRect());
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

  return <MoonContext.Provider value={value}>{children}</MoonContext.Provider>;
}

export function MoonSliderBall({ threshold = 10, className }) {
  const context = React.useContext(MoonContext);
  if (context === undefined) {
    throw new Error("MoonSliderBall must be used within a MoonSliderProvider");
  }

  const { size, basket, ball, setBall, isComplete, complete } = context;
  const ballRef = React.useRef(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  // Initialize ball location
  React.useEffect(() => {
    setBall(
      ballRef
        ? ballRef.current.getBoundingClientRect()
        : createEmptyBoundingClientRect()
    );
  }, [setBall, ballRef]);

  // Snap to center of basket once within threshold
  React.useEffect(() => {
    if (isComplete) {
      setPosition({ x: basket.x - ball.x, y: basket.y - ball.y });
    }
  }, [isComplete, basket.x, ball.x, basket.y, ball.y]);

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
          cursor: isComplete ? "cursor" : "pointer",
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

  const { size, setBasket } = context;
  const basketRef = React.useRef(null);

  // Initialize basket location
  React.useEffect(() => {
    setBasket(
      basketRef
        ? basketRef.current.getBoundingClientRect()
        : createEmptyBoundingClientRect()
    );
  }, [setBasket, basketRef]);

  return (
    <div
      ref={basketRef}
      className={className}
      style={{
        zIndex: 2,
        height: `${size}px`,
        width: `${size}px`,
        borderRadius: `${size}px`,
        border: `4px dashed rgba(255, 255, 255, 0.9)`,
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
