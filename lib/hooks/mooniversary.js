import React from "react";
import { format, isSameYear } from "date-fns";
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
    if (isSameYear(today, mooniversaryDate)) {
      return format(mooniversaryDate, "MMMM do");
    } else {
      return format(mooniversaryDate, "MMMM do yyyy");
    }
  }, [mooniversaryDate]);

  return {
    mooniversaryNumber,
    mooniversaryNumberText,
    mooniversaryDate,
    mooniversaryDateText,
    setMooniversaryNumber,
  };
};
