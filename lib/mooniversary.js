import lune from "lune";
import { add } from "date-fns";

const FIRST_DATE = new Date("2021-04-05T14:00-0600");

export function getNextMooniversary() {
  const today = new Date();
  const nextMonth = add(new Date(), { months: 1 });

  const [nextMooniversary] = lune.phase_range(
    today,
    nextMonth,
    lune.PHASE_FULL
  );

  if (!nextMooniversary) {
    throw new Error(
      `Expected at least one full moon between ${today} and ${nextMonth}`
    );
  }

  return nextMooniversary;
}

export function getPastMooniversaries() {
  const today = new Date();

  const [firstMoon, ...pastMooniversaries] = lune.phase_range(
    FIRST_DATE,
    today,
    lune.PHASE_FULL
  );

  return pastMooniversaries;
}
