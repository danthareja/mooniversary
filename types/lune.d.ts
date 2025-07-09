declare module "lune" {
  export const PHASE_FULL: number;

  export function phase_range(start: Date, end: Date, phase: number): Date[];

  const lune: {
    PHASE_FULL: number;
    phase_range: typeof phase_range;
  };

  export default lune;
}
