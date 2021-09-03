import React from "react";
import { useNextMooniversary } from "@/lib/hooks";
import { MoonSlider, EventInput } from "@/components";
import styles from "@/styles/Home.module.css";

export default function Index() {
  const {
    nextMooniversaryDate,
    nextMooniversaryDateText,
    nextMooniversaryNumberText,
  } = useNextMooniversary();

  return (
    <MoonSlider>
      <div className={styles.container}>
        <main className={styles.main} data-test="next-mooniversary">
          <h1 className={styles.title} data-test="next-mooniversary-date">
            {nextMooniversaryDateText}
          </h1>
          <p
            className={styles.description}
            data-test="next-mooniversary-number"
          >
            will be our{" "}
            <span className={styles.emphasis}>
              {nextMooniversaryNumberText}
            </span>{" "}
            Mooniversary
          </p>
          {/* <EventInput date={nextMooniversaryDate} /> */}
        </main>
      </div>
    </MoonSlider>
  );
}
