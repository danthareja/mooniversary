import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// source: https://stackoverflow.com/questions/15998005/ordinals-in-words-javascript

export function numberToWordWithOrdinal(i: number): string {
  if (i < 100) {
    // This function can handle numbers higher than 100
    // But they are throttled here to be more predictable in the UI
    return wordWithOrdinalSuffix(i);
  } else {
    return numberWithOrdinalSuffix(i);
  }
}

export function numberWithOrdinalSuffix(i: number): string {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
}

export function wordWithOrdinalSuffix(i: number): string {
  const n = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const s = [
    "zeroth",
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
    "ninth",
    "tenth",
    "eleventh",
    "twelfth",
    "thirteenth",
    "fourteenth",
    "fifteenth",
    "sixteenth",
    "seventeenth",
    "eighteenth",
    "nineteenth",
  ];
  const p = [
    "twent",
    "thirt",
    "fourt",
    "fift",
    "sixt",
    "sevent",
    "eight",
    "ninet",
  ];
  const c = [
    "hundred",
    "thousand",
    "million",
    "billion",
    "trillion",
    "quadrillion",
    "quintillion",
  ];
  const b = Math.floor(Math.log10(i));
  if (i < 20) return s[i]; // Special case for sub-20
  if (b === 1) {
    // Between 21 and 99
    if (i % 10 === 0) return p[Math.floor(i / 10) - 2] + "ieth"; // On the tens, return p+"ieth"
    return p[Math.floor(i / 10) - 2] + "y-" + s[i % 10]; // Otherwise, return hyphenated
  }
  if (b === 2) {
    // Between 100 and 999
    const e = Math.floor(i / Math.pow(10, b)); // The first number
    // Special case for 'hundreth'
    if (i % 100 === 0) {
      return n[e - 1] + "-" + c[0] + "th";
    }
    return (
      n[e - 1] +
      "-" +
      c[0] +
      " " +
      wordWithOrdinalSuffix(i - e * Math.pow(10, b))
    );
  }
  // Greater than 1000 we break into groups of 10^3 followed by a multiplier
  const m = (b % 3) + 1; // Take the first m digits off
  const cm = Math.floor(b / 3);
  const x = Math.floor(i / Math.pow(10, b - m + 1));
  const numberToString = function (y: number): string {
    // Converts a number less than 1000 to its string representation as a multiplier
    if (y < 20) return n[y - 1];
    if (y < 100) return p[Math.floor(y / 10) - 2] + "y-" + n[(y % 10) - 1];
    return (
      n[Math.floor(y / 100) - 1] +
      " " +
      c[0] +
      " " +
      numberToString(y - Math.floor(y / 100) * 100)
    );
  };
  return (
    numberToString(x) +
    " " +
    c[cm] +
    " " +
    wordWithOrdinalSuffix(i - x * Math.pow(10, b - m + 1))
  );
}
