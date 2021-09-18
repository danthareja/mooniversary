import { add, sub, parseISO, compareAsc, compareDesc } from "date-fns";

describe("index page", () => {
  // We cannot load JSON file using "cy.fixture"
  // because it means the test is already running.
  // Same with using "before" hook - new tests cannot be created from "before" hook.
  // Instead we need to load JSON file using "require" at the start time
  // and generate tests.
  const mooniversaries = require("../../fixtures/mooniversaries");

  mooniversaries.forEach((mooniversary) => {
    const mooniversaryDate = parseISO(mooniversary.date);

    it(`should show '${mooniversary.dateText} will be our ${mooniversary.numberText}' mooniversary the day before`, () => {
      const dayBeforeMooniversary = sub(parseISO(mooniversary.date), {
        days: 1,
      });
      cy.clock(dayBeforeMooniversary, ["Date"]);
      cy.visit("/");
      cy.dragMoon();
      cy.checkMooniversary({
        dateText: mooniversary.dateText,
        numberText: `will be our ${mooniversary.numberText} Mooniversary`,
      });
    });

    it(`should show 'today is our ${mooniversary.numberText}' mooniversary the day of`, () => {
      cy.clock(mooniversaryDate, ["Date"]);
      cy.visit("/");
      cy.dragMoon();
      cy.checkMooniversary({
        dateText: "Today",
        numberText: `is our ${mooniversary.numberText} Mooniversary`,
      });
    });

    it(`should show '${mooniversary.dateText} was our ${mooniversary.numberText}' mooniversary the day after`, () => {
      const dayAfterMooniversary = add(parseISO(mooniversary.date), {
        days: 1,
      });
      cy.clock(dayAfterMooniversary, ["Date"]);
      cy.visit("/");
      cy.dragMoon();

      cy.updateMooniversary(`${mooniversary.number}{enter}`);
      cy.checkMooniversary({
        dateText: mooniversary.dateText,
        numberText: `was our ${mooniversary.numberText} Mooniversary`,
      });
    });
  });

  it("should show the correct future mooniversary when typing in the input", () => {
    const earliestMooniversary = mooniversaries.sort((a, b) =>
      compareAsc(parseISO(a.date), parseISO(b.date))
    )[0];

    cy.clock(sub(parseISO(earliestMooniversary.date), { days: 2 }), ["Date"]);
    cy.visit("/");
    cy.dragMoon();
    cy.checkMooniversary({
      dateText: earliestMooniversary.dateText,
      numberText: `will be our ${earliestMooniversary.numberText} Mooniversary`,
    });

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

    mooniversaries.forEach((mooniversary) => {
      cy.updateMooniversary(`${mooniversary.number}{enter}`);
      cy.checkMooniversary({
        dateText: mooniversary.dateText,
        numberText: `will be our ${mooniversary.numberText} Mooniversary`,
      });
    });
  });

  it("should show the correct past mooniversary when typing in the input", () => {
    const latestMooniversary = mooniversaries.sort((a, b) =>
      compareDesc(parseISO(a.date), parseISO(b.date))
    )[0];

    cy.clock(add(parseISO(latestMooniversary.date), { days: 2 }), ["Date"]);
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
});
