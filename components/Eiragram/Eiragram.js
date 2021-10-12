import React, { useReducer, useEffect, useRef } from "react";
import Alert from "@reach/alert";
import VisuallyHidden from "@reach/visually-hidden";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import { useProgress } from "@/lib/hooks";

import { slides } from "./slides";
import classes from "./Eiragram.module.css";

const SLIDE_DURATION = 3000;

export function Eiragram() {
  let [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "PROGRESS":
        case "NEXT":
          return {
            ...state,
            takeFocus: false,
            isPlaying: action.type === "PROGRESS",
            currentIndex: (state.currentIndex + 1) % slides.length,
          };
        case "PREV":
          return {
            ...state,
            takeFocus: false,
            isPlaying: false,
            currentIndex:
              (state.currentIndex - 1 + slides.length) % slides.length,
          };
        case "PLAY":
          return {
            ...state,
            takeFocus: false,
            isPlaying: true,
          };
        case "PAUSE":
          return {
            ...state,
            takeFocus: false,
            isPlaying: false,
          };
        case "GOTO":
          return {
            ...state,
            takeFocus: true,
            currentIndex: action.index,
          };
        default:
          return state;
      }
    },
    {
      currentIndex: 0,
      isPlaying: false,
      takeFocus: false,
    }
  );

  useEffect(() => {
    if (state.isPlaying) {
      let timeout = setTimeout(() => {
        dispatch({ type: "PROGRESS" });
      }, SLIDE_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [state.currentIndex, state.isPlaying]);

  return (
    <Carousel aria-label="Images of Eira">
      <Slides>
        {slides.map((image, index) => (
          <Slide
            key={index}
            id={`image-${index}`}
            image={image.img}
            title={image.title}
            isCurrent={index === state.currentIndex}
            takeFocus={state.takeFocus}
          >
            {image.content}
          </Slide>
        ))}
      </Slides>

      <SlideNav>
        {slides.map((slide, index) => (
          <SlideNavItem
            key={index}
            isCurrent={index === state.currentIndex}
            aria-label={`Slide ${index + 1}`}
            onClick={() => {
              dispatch({ type: "GOTO", index });
            }}
          />
        ))}
      </SlideNav>

      <Controls>
        {state.isPlaying ? (
          <IconButton
            aria-label="Pause"
            onClick={() => {
              dispatch({ type: "PAUSE" });
            }}
          >
            <FaPause />
          </IconButton>
        ) : (
          <IconButton
            aria-label="Play"
            onClick={() => {
              dispatch({ type: "PLAY" });
            }}
          >
            <FaPlay />
          </IconButton>
        )}
        <SpacerGif width="10px" />
        <IconButton
          aria-label="Previous Slide"
          onClick={() => {
            dispatch({ type: "PREV" });
          }}
        >
          <FaBackward />
        </IconButton>
        <IconButton
          aria-label="Next Slide"
          onClick={() => {
            dispatch({ type: "NEXT" });
          }}
        >
          <FaForward />
        </IconButton>
      </Controls>

      <ProgressBar
        key={state.currentIndex + state.isPlaying}
        time={SLIDE_DURATION}
        animate={state.isPlaying}
      />

      <VisuallyHidden>
        <Alert>
          Item {state.currentIndex + 1} of {slides.length}
        </Alert>
      </VisuallyHidden>
    </Carousel>
  );
}

function Carousel(props) {
  return <section className={classes.Carousel} {...props} />;
}

function Slides(props) {
  return <ul {...props} />;
}

function Slide({ isCurrent, takeFocus, image, id, title, children }) {
  let ref = useRef();

  useEffect(() => {
    if (isCurrent && takeFocus) {
      ref.current.focus();
    }
  }, [isCurrent, takeFocus]);

  return (
    <li
      ref={ref}
      aria-hidden={!isCurrent}
      tabIndex="-1"
      aria-labelledby={id}
      className={classes.Slide}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className={classes.SlideContent}>
        <h2 id={id}>{title}</h2>
        {children}
      </div>
    </li>
  );
}

function SlideNav(props) {
  return <ul className={classes.SlideNav} {...props} />;
}

function SlideNavItem({ isCurrent, ...props }) {
  return (
    <li className={classes.SlideNavItem}>
      <button {...props} aria-current={isCurrent}>
        <span />
      </button>
    </li>
  );
}

function Controls(props) {
  return <div className={classes.Controls} {...props} />;
}

function IconButton(props) {
  return <button {...props} className={classes.IconButton} />;
}

function ProgressBar({ animate, time }) {
  let progress = useProgress(animate, time);

  return (
    <div className={classes.ProgressBar}>
      <div style={{ width: `${progress * 100}%` }} />
    </div>
  );
}

function SpacerGif({ width }) {
  return <div style={{ display: "inline-block", width }} />;
}
