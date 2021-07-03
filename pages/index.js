import React from "react";
import { format, parse } from "date-fns";
import { Moon, LunarPhase, LunarEmoji } from "@/lib/moon";
import { MoonSlider, EventInput } from "@/components";
import styles from "@/styles/Home.module.css";
import { emojiForLunarPhase } from "@/lib/moon/Moon";

const DATE_FORMAT = "yyyy/MM/dd";

export default function Home({ nextFullMoon, emoji }) {
  return (
    <MoonSlider>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>{nextFullMoon}</h1>
          <p className={styles.description}>is our next Mooniversary</p>
          <EventInput
            summary={`Full Moooooon ${emoji}`}
            date={parse(nextFullMoon, DATE_FORMAT, new Date())}
          />
        </main>
      </div>
    </MoonSlider>
  );
}

export function getStaticProps() {
  const nextFullMoon = format(
    Moon.nextLunarPhase(LunarPhase.FULL),
    DATE_FORMAT
  );

  return {
    props: {
      nextFullMoon,
      emoji: emojiForLunarPhase(LunarPhase.FULL),
    },
    revalidate: 60 * 60, // 1 hour
  };
}
