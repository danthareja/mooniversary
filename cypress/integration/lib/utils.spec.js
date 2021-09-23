import { parseISO } from "date-fns";
import { findMooniversaryDate } from "../../../lib/utils";

describe("utils", () => {
  describe("#findMooniversaryDate", () => {
    const mooniversaries = require("../../fixtures/mooniversaries");

    mooniversaries.forEach((mooniversary) => {
      it(`should find mooniversary #${mooniversary.number}`, () => {
        const actualDate = findMooniversaryDate(mooniversary.number);
        const expectedDate = parseISO(mooniversary.date);
        expect(actualDate.toString()).to.equal(expectedDate.toString());
      });
    });
  });
});
