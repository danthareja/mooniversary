import React from "react";
import { format, isThisYear, isSameDay, isBefore, isAfter } from "date-fns";
import {
  findMooniversaryDate,
  getNextMooniversaryNumber,
  numberToWordWithOrdinal,
} from "@/lib/utils";

export const useMooniversary = () => {
  const [mooniversaryNumber, setMooniversaryNumber] = React.useState(
    getNextMooniversaryNumber()
  );

  const mooniversaryNumberText = React.useMemo(
    () => numberToWordWithOrdinal(mooniversaryNumber),
    [mooniversaryNumber]
  );

  const mooniversaryDate = React.useMemo(
    () => findMooniversaryDate(mooniversaryNumber),
    [mooniversaryNumber]
  );

  const mooniversaryDateText = React.useMemo(() => {
    const today = new Date();

    if (isSameDay(mooniversaryDate, today)) {
      return "Today";
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
