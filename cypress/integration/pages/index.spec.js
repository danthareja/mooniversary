import { add, sub, parseISO, compareAsc, compareDesc } from "date-fns";

describe("index page", () => {
  const mooniversaries = require("../../fixtures/mooniversaries");

  const earliestMooniversary = mooniversaries.sort((a, b) =>
    compareAsc(parseISO(a.date), parseISO(b.date))
  )[0];

  const latestMooniversary = mooniversaries.sort((a, b) =>
    compareDesc(parseISO(a.date), parseISO(b.date))
  )[0];

  it(`should show the correct mooniversary way before`, () => {
    const wayBeforeMooniversary = sub(parseISO(earliestMooniversary.date), {
      days: 7, // Subtract 7 days so relative dates don't come up
    });
    cy.clock(wayBeforeMooniversary, ["Date"]);
    cy.visit("/");
    cy.dragMoon();
    cy.checkMooniversary({
      dateText: earliestMooniversary.dateText,
      numberText: `will be our ${earliestMooniversary.numberText} Mooniversary`,
    });
  });

  it(`should show the correct mooniversary the day before`, () => {
    const dayBeforeMooniversary = sub(parseISO(earliestMooniversary.date), {
      days: 1,
    });
    cy.clock(dayBeforeMooniversary, ["Date"]);
    cy.clock(parseISO(earliestMooniversary.date), ["Date"]);
    cy.visit("/");
    cy.dragMoon();
    cy.checkMooniversary({
      dateText: "Tomorrow",
      numberText: `will be our ${earliestMooniversary.numberText} Mooniversary`,
    });
  });

  it(`should show the correct mooniversary the day of`, () => {
    cy.clock(parseISO(earliestMooniversary.date), ["Date"]);
    cy.visit("/");
    cy.dragMoon();
    cy.checkMooniversary({
      dateText: "Today",
      numberText: `is our ${earliestMooniversary.numberText} Mooniversary`,
    });
  });

  it(`should show the correct mooniversary the day after`, () => {
    const dayAfterMooniversary = add(parseISO(earliestMooniversary.date), {
      days: 1,
    });
    cy.clock(dayAfterMooniversary, ["Date"]);
    cy.visit("/");
    cy.dragMoon();

    cy.updateMooniversary(`${earliestMooniversary.number}{enter}`);
    cy.checkMooniversary({
      dateText: "Yesterday",
      numberText: `was our ${earliestMooniversary.numberText} Mooniversary`,
    });
  });

  it(`should show the correct mooniversary way after`, () => {
    const wayAfterMooniversary = add(parseISO(earliestMooniversary.date), {
      days: 7, // Add 7 days so relative dates don't come up
    });
    cy.clock(wayAfterMooniversary, ["Date"]);
    cy.visit("/");
    cy.dragMoon();

    cy.updateMooniversary(`${earliestMooniversary.number}{enter}`);
    cy.checkMooniversary({
      dateText: earliestMooniversary.dateText,
      numberText: `was our ${earliestMooniversary.numberText} Mooniversary`,
    });
  });

  it("should change to a future mooniversary when typing in the input", () => {
    // Subtract 7 days so relative dates don't come up
    cy.clock(sub(parseISO(earliestMooniversary.date), { days: 7 }), ["Date"]);
    cy.visit("/");
    cy.dragMoon();

    mooniversaries.forEach((mooniversary) => {
      cy.updateMooniversary(`${mooniversary.number}{enter}`);
      cy.checkMooniversary({
        dateText: mooniversary.dateText,
        numberText: `will be our ${mooniversary.numberText} Mooniversary`,
      });
    });
  });

  it("should change to a past mooniversary when typing in the input", () => {
    // Add 7 days so relative dates don't come up
    cy.clock(add(parseISO(latestMooniversary.date), { days: 7 }), ["Date"]);
    cy.visit("/");
    cy.dragMoon();

    mooniversaries.forEach((mooniversary) => {
      cy.updateMooniversary(`${mooniversary.number}{enter}`);
      cy.checkMooniversary({
        dateText: mooniversary.dateText,
        numberText: `was our ${mooniversary.numberText} Mooniversary`,
      });
    });
  });

  it("should not change the mooniversary when typing an invalid input", () => {
    // Subtract 7 days so relative dates don't come up
    cy.clock(sub(parseISO(earliestMooniversary.date), { days: 7 }), ["Date"]);
    cy.visit("/");
    cy.dragMoon();

    // Label should not change when the escape key is pressed
    cy.updateMooniversary("{esc}");
    cy.checkMooniversary({
      dateText: earliestMooniversary.dateText,
      numberText: `will be our ${earliestMooniversary.numberText} Mooniversary`,
    });

    // Label should not change if an invalid input entered
    cy.updateMooniversary("-1{enter}");
    cy.checkMooniversary({
      dateText: earliestMooniversary.dateText,
      numberText: `will be our ${earliestMooniversary.numberText} Mooniversary`,
    });

    // Label should not change if an invalid input entered
    cy.updateMooniversary("9999{enter}");
    cy.checkMooniversary({
      dateText: earliestMooniversary.dateText,
      numberText: `will be our ${earliestMooniversary.numberText} Mooniversary`,
    });
  });

  it.only("should change the mooniversary date format with a global method call", () => {
    // Subtract 7 days so relative dates don't come up
    cy.clock(sub(parseISO(earliestMooniversary.date), { days: 7 }), ["Date"]);
    cy.visit("/");
    cy.dragMoon();

    cy.checkMooniversary({
      dateText: earliestMooniversary.dateText,
    });

    cy.window().then((win) => {
      win.mooniversary.changeDateFormatTo("not a valid format");
      cy.checkMooniversary({
        dateText: earliestMooniversary.dateText,
      });
    });

    cy.window().then((win) => {
      win.mooniversary.changeDateFormatTo("stupid american");
      cy.checkMooniversary({
        dateText: "05/26/2021",
      });
    });

    cy.window().then((win) => {
      win.mooniversary.changeDateFormatTo("proper south african");
      cy.checkMooniversary({
        dateText: "26/05/2021",
      });
    });

    cy.window().then((win) => {
      win.mooniversary.changeDateFormatTo("with the time");
      cy.checkMooniversary({
        dateText: "May 26th 2021 at 5:14:51 AM",
      });
    });

    cy.window().then((win) => {
      win.mooniversary.changeDateFormatTo("nerdy programmer");
      cy.checkMooniversary({
        dateText: "2021-05-26T11:14:51.093Z",
      });
    });

    cy.window().then((win) => {
      win.mooniversary.changeDateFormatTo("from now");
      cy.checkMooniversary({
        dateText: "in 7 days",
      });
    });

    cy.window().then((win) => {
      win.mooniversary.changeDateFormatTo("original");
      cy.checkMooniversary({
        dateText: earliestMooniversary.dateText,
      });
    });
  });
});
