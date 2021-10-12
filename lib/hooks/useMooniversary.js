import React from "react";
import {
  format,
  formatRelative,
  parse,
  formatISO,
  isThisYear,
  isSameDay,
  isBefore,
  isAfter,
} from "date-fns";
import {
  findMooniversaryDate,
  getNextMooniversaryDate,
  getNextMooniversaryNumber,
  numberToWordWithOrdinal,
  capitalizeFirstLetter,
} from "@/lib/utils";

export const useMooniversary = () => {
  const [nextMooniversaryNumber, nextMooniversaryDate] = React.useMemo(() => {
    return [getNextMooniversaryNumber(), getNextMooniversaryDate()];
  }, []);

  const [mooniversaryNumber, setMooniversaryNumber] = React.useState(
    nextMooniversaryNumber
  );
  const [mooniversaryDate, setMooniversaryDate] =
    React.useState(nextMooniversaryDate);

  const mooniversaryNumberText = React.useMemo(
    () => numberToWordWithOrdinal(mooniversaryNumber),
    [mooniversaryNumber]
  );

  // Recalculate mooniversary date when the number changes
  React.useEffect(() => {
    if (mooniversaryNumber === nextMooniversaryNumber) {
      setMooniversaryDate(nextMooniversaryDate);
    } else {
      setMooniversaryDate(findMooniversaryDate(mooniversaryNumber));
    }
  }, [
    mooniversaryNumber,
    nextMooniversaryNumber,
    nextMooniversaryDate,
    setMooniversaryDate,
  ]);

  const mooniversaryDateText = React.useMemo(() => {
    const today = new Date();
    const relativeDate = formatRelative(mooniversaryDate, today);
    if (relativeDate.includes("at")) {
      const relativeDay = relativeDate.split(" at ")[0];
      return capitalizeFirstLetter(relativeDay);
    } else if (isThisYear(mooniversaryDate)) {
      return format(mooniversaryDate, "MMMM do");
    } else {
      return format(mooniversaryDate, "MMMM do yyyy");
    }
  }, [mooniversaryDate]);

  const mooniversaryNumberTextVerb = React.useMemo(() => {
    const today = new Date();
    if (isSameDay(mooniversaryDate, today)) {
      return "is our";
    } else if (isBefore(mooniversaryDate, today)) {
      return "was our";
    } else if (isAfter(mooniversaryDate, today)) {
      return "will be our";
    } else {
      console.warn(
        `Could not find pre text for mooniversary date ${mooniversaryDate}, defaulting to 'will be'`
      );
      return "will be our";
    }
  }, [mooniversaryDate]);

  return {
    mooniversaryNumber,
    mooniversaryNumberText,
    mooniversaryNumberTextVerb,
    mooniversaryDate,
    mooniversaryDateText,
    setMooniversaryNumber,
  };
};
