import React from "react";
import {
  format,
  formatRelative,
  formatDistanceToNow,
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
  const { hasGlobalFormat, formatWithGlobal, logGlobalFormatInstructions } =
    useGlobalDateFormat();

  const [nextMooniversaryNumber, nextMooniversaryDate] = React.useMemo(() => {
    return [getNextMooniversaryNumber(), getNextMooniversaryDate()];
  }, []);

  const [mooniversaryNumber, setMooniversaryNumber] = React.useState(
    nextMooniversaryNumber
  );
  const [mooniversaryDate, setMooniversaryDate] =
    React.useState(nextMooniversaryDate);

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
    if (hasGlobalFormat) {
      return formatWithGlobal(mooniversaryDate);
    }

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
  }, [mooniversaryDate, hasGlobalFormat, formatWithGlobal]);

  const mooniversaryNumberText = React.useMemo(
    () => numberToWordWithOrdinal(mooniversaryNumber),
    [mooniversaryNumber]
  );

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
    logGlobalFormatInstructions,
    mooniversaryNumber,
    mooniversaryNumberText,
    mooniversaryNumberTextVerb,
    mooniversaryDate,
    mooniversaryDateText,
    setMooniversaryNumber,
  };
};

const useGlobalDateFormat = () => {
  const [dateFormat, setDateFormat] = React.useState(null);

  React.useEffect(() => {
    const dateFormats = {
      "stupid american": "MM/dd/yyyy",
      "proper south african": "dd/MM/yyyy",
      "with the time": "MMMM do yyyy 'at' pp",
      "nerdy programmer": (date) => {
        return date.toISOString();
      },
      "from now": (date) => {
        return formatDistanceToNow(date, { addSuffix: true });
      },
      original: null,
    };

    const allowedDateFormats = Object.keys(dateFormats);

    const changeDateFormatTo = (key) => {
      if (!(key in dateFormats)) {
        console.log(
          [
            `Oops! You entered an invalid date format into this function:`,
            "",
            `  "${key}"`,
            "",
            "Try again with of the strings listed in the `mooniversary.allowedDateFormats` array",
          ].join("\n")
        );
      } else {
        // https://stackoverflow.com/questions/55621212/is-it-possible-to-react-usestate-in-react
        setDateFormat(() => dateFormats[key]);
      }
    };

    window.mooniversary = {
      allowedDateFormats,
      changeDateFormatTo,
    };
  }, []);

  return {
    hasGlobalFormat: dateFormat !== null,
    formatWithGlobal: (date) => {
      if (typeof dateFormat === "string") {
        return format(date, dateFormat);
      } else if (typeof dateFormat === "function") {
        return dateFormat(date);
      }
    },
    logGlobalFormatInstructions: () => {
      console.log(
        [
          "Well hello there curious one, you found a hidden feature!",
          "",
          "You can change the way the mooniversary date is displayed by calling a function inside this console",
          "",
          ">  mooniversary.changeDateFormatTo('stupid american')",
          "",
          "There are a few different options you can pass into this function. Can you find them all?",
        ].join("\n")
      );
    },
  };
};
