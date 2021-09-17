import { format } from "date-fns";
import { findMooniversaryByNumber } from "../../../lib/utils/mooniversary";

const mooniversaries = [
  {
    number: 1,
    date: "2021-05-26",
  },
  {
    number: 10,
    date: "2022-02-16",
  },
  {
    number: 99,
    date: "2029-04-28",
  },
  {
    number: 100,
    date: "2029-05-27",
  },
  {
    number: 999,
    date: "2102-02-03",
  },
  {
    number: 1000,
    date: "2102-03-04",
  },
  {
    number: 9999,
    date: "2829-10-03",
  },
];

describe("mooniversary", () => {
  describe("#findMooniversaryByNumber", () => {
    mooniversaries.forEach((mooniversary) => {
      it(`should find mooniversary number ${mooniversary.number}`, () => {
        expect(
          format(findMooniversaryByNumber(mooniversary.number), "yyyy-MM-dd")
        ).to.equal(mooniversary.date);
      });
    });
  });
});
