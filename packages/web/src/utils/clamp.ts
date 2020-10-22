export const clamp = (min: number, preferred: number, max: number): number => {
  return Math.max(min, Math.min(max, preferred))
}
