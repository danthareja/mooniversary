import { parseISO } from "date-fns";
import { findMooniversaryDate } from "../../../lib/utils";

describe("utils", () => {
  describe("#findMooniversaryDate", () => {
    // We cannot load JSON file using "cy.fixture"
    // because it means the test is already running.
    // Same with using "before" hook - new tests cannot be created from "before" hook.
    // Instead we need to load JSON file using "require" at the start time
    // and generate tests.
    const mooniversaries = require("../../fixtures/mooniversaries");

    mooniversaries.forEach((mooniversary) => {
      it(`should find mooniversary number ${mooniversary.number}`, () => {
        const actualDate = findMooniversaryDate(mooniversary.number);
        const expectedDate = parseISO(mooniversary.date);
        expect(actualDate.toString()).to.equal(expectedDate.toString());
      });
    });
  });
});
