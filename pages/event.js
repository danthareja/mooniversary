import React from "react";
import { format } from "date-fns";
import {
  getNextMooniversary,
  getNextMooniversaryNumber,
  numberWithOrdinal,
} from "@/lib/utils";
import { EventInput } from "@/components";
import styles from "@/styles/Home.module.css";

export default function Event() {
  const [nextMooniversary, nextMooniversaryWord] = React.useMemo(() => {
    return [
      getNextMooniversary(),
      numberWithOrdinal(getNextMooniversaryNumber()),
    ];
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {format(nextMooniversary, "yyyy/MM/dd")}
        </h1>
        <p className={styles.description}>
          will be our{" "}
          <span className={styles.emphasis}>{nextMooniversaryWord}</span>{" "}
          Mooniversary
        </p>
        <EventInput date={nextMooniversary} />
      </main>
    </div>
  );
}
