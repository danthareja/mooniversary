import React from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

import { format } from "date-fns";
import { Moon, LunarPhase } from "@/lib/moon";
import { Background, MoonSlider } from "@/components";

export default function Home({ nextFullMoon }) {
  return (
    <React.Fragment>
      <Head>
        <title>Mooniversary</title>
        <meta name="description" content="Mooniversary tracking app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Background />
      <MoonSlider>
        <div className={styles.container}>
          <main className={styles.main}>
            <h1 className={styles.title}>{nextFullMoon}</h1>
            <p className={styles.description}>is our next Mooniversary</p>
          </main>
        </div>
      </MoonSlider>
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
