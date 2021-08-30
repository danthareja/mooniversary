import lune from "lune";
import { add } from "date-fns";

export function getNextFullMoon() {
  const phaseList = lune.phase_range(
    new Date(),
    add(new Date(), { days: 30 }),
    lune.PHASE_FULL
  );

  return phaseList[0];
}
