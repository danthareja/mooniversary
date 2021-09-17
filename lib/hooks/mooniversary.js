import React from "react";
import { format } from "date-fns";
import {
  findMooniversaryDate,
  getNextMooniversaryNumber,
  numberToWordWithOrdinal,
} from "@/lib/utils";

export const useMooniversary = (dateFormat = "MMMM do") => {
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
    return format(mooniversaryDate, dateFormat);
  }, [mooniversaryDate, dateFormat]);

  return {
    mooniversaryNumber,
    mooniversaryNumberText,
    mooniversaryDate,
    mooniversaryDateText,
    setMooniversaryNumber,
  };
};
