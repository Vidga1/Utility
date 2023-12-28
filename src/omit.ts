/* eslint-disable @typescript-eslint/no-unused-vars */

export const omit = <T, K extends keyof T>(
  obj: T,
  keyToOmit: K,
): Omit<T, K> => {
  const { [keyToOmit]: _, ...withoutKey } = obj;
  return withoutKey;
};
