import React from "react";
import { format } from "date-fns";
import { getNextMooniversary } from "@/lib/mooniversary";

import { EventInput } from "@/components";
import styles from "@/styles/Home.module.css";

export default function Event() {
  const nextMooniversary = getNextMooniversary();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {format(nextMooniversary, "yyyy/MM/dd")}
        </h1>
        <p className={styles.description}>is our next Mooniversary</p>
        <EventInput date={nextMooniversary} />
      </main>
    </div>
  );
}
