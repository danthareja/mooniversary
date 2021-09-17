import React from "react";
import { useMooniversary } from "@/lib/hooks";
import { MoonSlider, EditText, EventInput } from "@/components";
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
          <div
            className={styles.description}
            data-test="next-mooniversary-number"
          >
            will be our{" "}
            <EditText
              className={styles.number}
              name="mooniversary"
              type="tel"
              minLength="1"
              maxLength="3"
              pattern="[1-9][0-9]{0,2}"
              required
              size={3}
              inline={true}
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
