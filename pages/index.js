import React from "react";
import { format, parse } from "date-fns";
import { Moon, LunarPhase } from "@/lib/moon";
import { MoonSlider, EventInput } from "@/components";
import styles from "@/styles/Home.module.css";

const DATE_FORMAT = "yyyy/MM/dd";

export default function Home() {
  const nextFullMoon = format(
    Moon.nextLunarPhase(LunarPhase.FULL),
    DATE_FORMAT
  );

  return (
    <MoonSlider>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>{nextFullMoon}</h1>
          <p className={styles.description}>is our next Mooniversary</p>
          <EventInput date={parse(nextFullMoon, DATE_FORMAT, new Date())} />
        </main>
      </div>
    </MoonSlider>
  );
}
