import React from "react";
import { useMooniversary } from "@/lib/hooks";
import { MoonSlider, EditText, EventInput } from "@/components";
import styles from "@/styles/Home.module.css";

export default function Index() {
  const {
    mooniversaryNumber,
    mooniversaryNumberText,
    mooniversaryNumberTextVerb,
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
          <div
            className={styles.description}
            data-test="next-mooniversary-number"
          >
            {mooniversaryNumberTextVerb}{" "}
            <EditText
              className={styles.number}
              name="mooniversary"
              type="number"
              min="1"
              max="999"
              required
              size={3}
              defaultValue={mooniversaryNumber.toString()}
              label={mooniversaryNumberText}
              onSave={({ value }) => {
                const number = parseInt(value);
                setMooniversaryNumber(number);
              }}
            />{" "}
            Mooniversary
          </div>
          {/* <EventInput date={mooniversaryDate} /> */}
        </main>
      </div>
    </MoonSlider>
  );
}
