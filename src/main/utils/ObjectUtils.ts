export function removeUndefinedKeys(obj: any): any {
  const result: {[index:string]: any} = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}