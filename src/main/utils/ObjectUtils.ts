export function removeUndefinedKeys(obj: any): any {
  const result: {[index:string]: any} = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function haveSameEnumerableKeys(obj1: any, obj2: any): boolean {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  return Object.keys(obj1).every(function(prop) {
    return obj2.hasOwnProperty(prop);
  });
}

export const isNullOrUndefined = (obj: any): boolean => obj == null || obj == undefined;
export const isNeitherNullNorUndefined = (obj: any): boolean => !isNullOrUndefined(obj);