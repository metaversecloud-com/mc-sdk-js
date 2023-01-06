/**
 * Returns a random whole number within range of (original number - scatterBy) to (original number + scatterBy)
 */
export const scatterVisitors = (original: number, scatterBy: number) => {
  const min = original - scatterBy;
  const max = original + scatterBy;
  return Math.floor(Math.random() * (max - min) + min);
};
