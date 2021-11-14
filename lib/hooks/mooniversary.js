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
        return;
      }
      const value = window.mooniversary.getVariable(dateFormats, key);
      // console.log("value", value);
      if (!value) {
        // not implemented yet
        return;
      } else {
        console.log("Cool! check out the date above now!");
        // https://stackoverflow.com/questions/55621212/is-it-possible-to-react-usestate-in-react
        setDateFormat(() => value);
      }
    };

    const getVariableImpelementationIsCorrect = (fn) => {
      if (typeof fn !== "function") {
        console.log("Hmm, it looks like you are trying to reassign this.");
        return false;
      }

      const test = fn({ a: 1 }, "a") === 1;
      const test2 = fn({ b: 2 }, "b") === 2;
      return test && test2;
    };

    var mooniversary = {
      dateFormats,
      allowedDateFormats,
      changeDateFormatTo,
      _getVariable() {
        console.log(`
You thought I'd just give this one to you that easily? Haha yeah right.

Now that you're a badass coder, you're going to have to help finish this feature.

There's a function on this 'mooniversary' object that you need to define

It's called 'mooniversary.getVariable', and its job is to get the value of an object
given a key string

// Dan's TODO: Add some copy here
// For Alex, just copy the correct implementation here

mooniversary.getVariable = (object, key) => {
  return object[key]
};
        
`);
      },
      get getVariable() {
        return this._getVariable;
      },
      set getVariable(fn) {
        // Test some shit
        if (getVariableImpelementationIsCorrect(fn)) {
          console.log(
            [
              "Yay, you've completed the feature!",
              "",
              "Now try seeing the fruit of your work by pasing the original function into the console",
              "",
              ">  mooniversary.changeDateFormatTo('stupid american')",
              "",
              "There are a few different options you can pass into this function. Can you find them all?",
            ].join("\n")
          );
          this._getVariable = fn;
        }
        return undefined;
      },
    };

    window.mooniversary = mooniversary;
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
      if (!window.Cypress) {
        console.log(
          [
            "Well hello there curious one, you found a hidden feature!",
            "",
            "You can change the way the mooniversary date is displayed by calling a function inside this console",
            "",
            ">  mooniversary.changeDateFormatTo('stupid american')",
            "",
            "Try pasing copying and pasting the line above to see this feature in action",
          ].join("\n")
        );
      }
    },
  };
};
