import lune from "lune";
import { add } from "date-fns";

export const FIRST_DATE = new Date("2021-04-25T14:00-0600");

export function getNextMooniversaryDate() {
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

export function getNextMooniversaryNumber() {
  const pastMooniversaries = getPastMooniversaryDates();
  return pastMooniversaries.length + 1;
}

export function getPastMooniversaryDates() {
  const today = new Date();

  const [firstMoon, ...pastMooniversaries] = lune.phase_range(
    FIRST_DATE,
    today,
    lune.PHASE_FULL
  );

  return pastMooniversaries;
}

export function findMooniversaryDate(number) {
  if (number <= 0) {
    throw new Error(`Exepcted '${number}' to be a number greater than 0`);
  }

  const targetDate = add(new Date(), { months: number });

  const [firstMoon, ...mooniversaries] = lune.phase_range(
    FIRST_DATE,
    targetDate,
    lune.PHASE_FULL
  );

  if (mooniversaries.length < number) {
    throw new Error(
      `Expected at least ${number} full moon(s) between ${FIRST_DATE} and ${targetDate}`
    );
  }

  return mooniversaries[number - 1];
}
