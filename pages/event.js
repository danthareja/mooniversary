import React from "react";
import { useNextMooniversary } from "@/lib/hooks";
import { EventInput } from "@/components";
import styles from "@/styles/Home.module.css";

export default function Event() {
  const {
    nextMooniversaryDate,
    nextMooniversaryDateText,
    nextMooniversaryNumberText,
  } = useNextMooniversary();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>{nextMooniversaryDateText}</h1>
        <p className={styles.description}>
          will be our{" "}
          <span className={styles.emphasis}>{nextMooniversaryNumberText}</span>{" "}
          Mooniversary
        </p>
        <EventInput date={nextMooniversaryDate} />
      </main>
    </div>
  );
}
