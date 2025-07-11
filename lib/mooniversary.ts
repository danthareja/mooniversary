import lune from "lune";
import { add, parseISO } from "date-fns";

export const FIRST_DATE = parseISO("2021-04-25T14:00-0600");

export function getNextMooniversaryDate() {
  const today = getToday();
  const nextMonth = add(today, { days: 31 });

  const [nextMooniversary] = lune.phase_range(
    today,
    nextMonth,
    lune.PHASE_FULL,
  );

  if (!nextMooniversary) {
    throw new Error(
      `Expected at least one full moon between ${today} and ${nextMonth}`,
    );
  }

  return nextMooniversary;
}

export function getNextMooniversaryNumber() {
  const pastMooniversaries = getPastMooniversaryDates();
  return pastMooniversaries.length + 1;
}

export function getPastMooniversaryDates() {
  const today = getToday();

  const [, ...pastMooniversaries] = lune.phase_range(
    FIRST_DATE,
    today,
    lune.PHASE_FULL,
  );

  return pastMooniversaries;
}

export function findMooniversaryDate(number: number) {
  if (number <= 0) {
    throw new Error(`Exepcted '${number}' to be a number greater than 0`);
  }

  const targetDate = add(getToday(), { months: number });

  const [, ...mooniversaries] = lune.phase_range(
    FIRST_DATE,
    targetDate,
    lune.PHASE_FULL,
  );

  if (mooniversaries.length < number) {
    throw new Error(
      `Expected at least ${number} full moon(s) between ${FIRST_DATE} and ${targetDate}`,
    );
  }

  return mooniversaries[number - 1];
}

export function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
