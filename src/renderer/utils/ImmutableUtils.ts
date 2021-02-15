export function addItemToArray<T>(array: T[], item: T): T[] {
  const result: T[] = [...array];
  result.push(item);
  return result;
}
