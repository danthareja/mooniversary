import React from "react";
import { format } from "date-fns";
import { getNextFullMoon } from "@/lib/moon";
import { MoonSlider, EventInput } from "@/components";
import styles from "@/styles/Home.module.css";

export default function Index() {
  const nextFullMoon = getNextFullMoon();

  return (
    <MoonSlider>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>{format(nextFullMoon, "yyyy/MM/dd")}</h1>
          <p className={styles.description}>is our next Mooniversary</p>
          <EventInput date={nextFullMoon} />
        </main>
      </div>
    </MoonSlider>
  );
}
