import { format } from "date-fns";
import { findMooniversaryDate } from "../../../lib/utils/mooniversary";

describe("mooniversary", () => {
  describe("#findMooniversaryDate", () => {
    // We cannot load JSON file using "cy.fixture"
    // because it means the test is already running.
    // Same with using "before" hook - new tests cannot be created from "before" hook.
    // Instead we need to load JSON file using "require" at the start time
    // and generate tests.
    const mooniversaries = require("../../fixtures/mooniversaries");

    mooniversaries.forEach((mooniversary) => {
      it(`should find mooniversary number ${mooniversary.number}`, () => {
        const mooniversaryDate = format(
          findMooniversaryDate(mooniversary.number),
          "yyyy-MM-dd"
        );
        expect(mooniversaryDate).to.equal(mooniversary.date);
      });
    });
  });
});
