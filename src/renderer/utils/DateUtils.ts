export function dateToYYYYMMDD(date: Date) {
  return date.toISOString().slice(0, 10);
}