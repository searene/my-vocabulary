export function getStartOfToday() {
  const result = new Date();
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getEndOfToday() {
  const result = new Date();
  result.setHours(23, 59, 59, 59);
  return result;
}
