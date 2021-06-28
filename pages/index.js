import React from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

import { format } from "date-fns";
import { Moon, LunarPhase } from "@/lib/moon";
import {
  Background,
  MoonSliderBall,
  MoonSliderBasket,
  useMoonSlider,
} from "@/components";

export default function Home({ nextFullMoon }) {
  const { isComplete } = useMoonSlider();

  return (
    <React.Fragment>
      <Head>
        <title>Mooniversary</title>
        <meta name="description" content="Mooniversary tracking app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Background />
      <MoonSliderBasket className={styles.basket} />
      <div className={styles.container}>
        <main className={styles.main}>
          <h1
            className={styles.title}
            style={{
              opacity: isComplete ? 1 : 0,
              transition: "opacity 1000ms",
            }}
          >
            {nextFullMoon}
          </h1>
          <p
            className={styles.description}
            style={{
              opacity: isComplete ? 1 : 0,
              transition: "opacity 1000ms",
            }}
          >
            is our next Mooniversary
          </p>
          <MoonSliderBall className={styles.ball} />
          <p
            className={styles.description}
            style={{
              opacity: isComplete ? 0 : 1,
              transition: "opacity 1000ms",
            }}
          >
            Drag the moon into the sky to see the date of our next Mooniversary
          </p>
        </main>
      </div>
    </React.Fragment>
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
