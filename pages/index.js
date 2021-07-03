import React from "react";
import { format } from "date-fns";
import { Moon, LunarPhase } from "@/lib/moon";
import { MoonSlider, EventInput } from "@/components";
import styles from "@/styles/Home.module.css";

export default function Home({ nextFullMoon }) {
  return (
    <MoonSlider>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>{nextFullMoon}</h1>
          <p className={styles.description}>is our next Mooniversary</p>
          <EventInput />
        </main>
      </div>
    </MoonSlider>
  );
}

export function getStaticProps() {
  const nextFullMoon = format(
    Moon.nextLunarPhase(LunarPhase.FULL),
    "yyyy/MM/dd"
  );

  return {
    props: {
      nextFullMoon,
    },
    revalidate: 60 * 60, // 1 hour
  };
}
