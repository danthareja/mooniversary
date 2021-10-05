import React from "react";
import classes from "@/styles/Pop.module.css";
import { SuperGif } from "@/lib/libgif";

export default function Pop() {
  const [loaded, setLoaded] = React.useState(false);
  const [popped, setPopped] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    let gif = new SuperGif({
      gif: ref.current,
      progressbar_height: 0,
      auto_play: false,
      max_width: document.body.getBoundingClientRect().width,
      loop_mode: false,
      on_end: () => console.log("on_end"),
    });

    let moveNextFrame = false;
    let lastDeltaY = 0;

    gif.load_url("/pinch_me.gif", function () {
      console.log("oh hey, now the gif is loaded");

      const Hammer = require("hammerjs");
      const hammertime = new Hammer(gif.get_canvas());
      hammertime.get("pinch").set({ enable: true });
      hammertime.on("pinch", (e) => {
        if (e.deltaY > lastDeltaY) {
          moveNextFrame = true;
        } else if (e.deltaY < lastDeltaY) {
          moveNextFrame = false;
        }
        lastDeltaY = e.deltaY;
      });

      requestAnimationFrame(update);
      gif.get_canvas().style.display = "block";
      setLoaded(true);
    });

    gif.get_canvas().style.display = "none";

    function update() {
      let frame = gif.get_current_frame();
      if (moveNextFrame && frame <= 27) {
        gif.move_to(Math.min(frame + 1, 27));
      } else if (moveNextFrame && frame < gif.get_length()) {
        gif.move_to(Math.max(frame - 1, 27));
      } else if (frame >= 27) {
        gif.move_to(frame + 1);
      } else if (frame > 0) {
        gif.move_to(frame - 1);
      }
      if (moveNextFrame && frame === 27) {
        setPopped(true);
      }
      requestAnimationFrame(update);
    }
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.main}>
        <div className={classes.topText}>
          {loaded ? "Pop me!" : "Loading... (it's super worth it)"}
        </div>
        <div ref={ref}></div>
        <div className={classes.bottomText}>
          {popped ? "(now you don't need me anymore)" : ""}
        </div>
      </div>
    </div>
  );
}
