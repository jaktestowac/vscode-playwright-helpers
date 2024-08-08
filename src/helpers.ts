export function compareEnums<T extends Record<string, string | number>>(
  a: T | undefined,
  b: T | undefined
): boolean {
  return a === b;
}
