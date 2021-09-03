import React from "react";
import { format } from "date-fns";
import {
  getNextMooniversary,
  getNextMooniversaryNumber,
  numberToWordWithOrdinal,
} from "@/lib/utils";

export const useNextMooniversary = (dateFormat = "MMMM do") => {
  const [
    nextMooniversaryDate,
    nextMooniversaryNumber,
    nextMooniversaryNumberText,
  ] = React.useMemo(() => {
    const date = getNextMooniversary();
    const number = getNextMooniversaryNumber();
    const numberText = numberToWordWithOrdinal(number);
    return [date, number, numberText];
  }, []);

  const nextMooniversaryDateText = React.useMemo(() => {
    return format(nextMooniversaryDate, dateFormat);
  }, [nextMooniversaryDate, dateFormat]);

  return {
    nextMooniversaryDate,
    nextMooniversaryDateText,
    nextMooniversaryNumber,
    nextMooniversaryNumberText,
  };
};
