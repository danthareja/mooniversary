import React from "react";
import { useMooniversary } from "@/lib/hooks";
import { MoonSlider, EventInput } from "@/components";
import styles from "@/styles/Home.module.css";

export default function Index() {
  const {
    mooniversaryNumber,
    mooniversaryNumberText,
    mooniversaryDate,
    mooniversaryDateText,
    setMooniversaryNumber,
  } = useMooniversary();

  return (
    <MoonSlider>
      <div className={styles.container}>
        <main className={styles.main} data-test="next-mooniversary">
          <h1 className={styles.title} data-test="next-mooniversary-date">
            {mooniversaryDateText}
          </h1>
          <p
            className={styles.description}
            data-test="next-mooniversary-number"
          >
            will be our{" "}
            <span className={styles.emphasis}>{mooniversaryNumberText}</span>{" "}
            Mooniversary
          </p>
          {/* <EventInput date={mooniversaryDate} /> */}
        </main>
      </div>
    </MoonSlider>
  );
}
