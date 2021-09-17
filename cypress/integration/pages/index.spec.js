import { sub } from "date-fns";

describe("index page", () => {
  // We cannot load JSON file using "cy.fixture"
  // because it means the test is already running.
  // Same with using "before" hook - new tests cannot be created from "before" hook.
  // Instead we need to load JSON file using "require" at the start time
  // and generate tests.
  const mooniversaries = require("../../fixtures/mooniversaries").slice(0, 1);

  mooniversaries.forEach((mooniversary) => {
    it(`should show the ${mooniversary.numberText} mooniversary the day before ${mooniversary.date}`, () => {
      const dayBeforeMooniversary = sub(new Date(mooniversary.date), {
        days: 1,
      });

      cy.clock(dayBeforeMooniversary, ["Date"]);
      cy.visit("/");

      cy.getEl("moon-ball").should("be.visible").as("ball");
      cy.getEl("moon-basket").should("be.visible").as("basket");

      // Drag and drop moon
      cy.get("@ball").then(($ball) => {
        cy.get("@basket").then(($basket) => {
          const basket = $basket[0].getBoundingClientRect();
          const offset = $ball.width() / 2;
          cy.wrap($ball)
            .trigger("mousedown", { button: 0 })
            .trigger("mousemove", {
              clientX: basket.x + offset,
              clientY: basket.y + offset,
            })
            // For some reason, we need at least two mouse move events
            // in order to trigger the screen correctly
            // no idea why this could be a problem for future dan
            .trigger("mousemove", {
              clientX: basket.x + offset,
              clientY: basket.y + offset,
            });
        });
      });

      cy.getEl("next-mooniversary")
        .findEl("next-mooniversary-date")
        .should("contain.text", mooniversary.dateText)
        .findEl("next-mooniversary-number")
        .should(
          "contain.text",
          `will be our ${mooniversary.numberText} Mooniversary`
        );
    });
  });
});
