/**
 * Get percentage value of a number
 */
export const getPercentage = (val: number, total: number) => {
  const value = (val + 1) / total;
  const percentage = value * 100;
  const rounded = Math.round(percentage);
  return rounded;
};
