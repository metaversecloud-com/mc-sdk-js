export const scatterVisitors = (original: number, scatterBy: number) => {
  const min = original - scatterBy;
  const max = original + scatterBy;
  return Math.floor(Math.random() * (max - min) + min);
};
