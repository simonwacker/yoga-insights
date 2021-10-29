export function assertNotUndefined<T>(x: T | undefined, message?: string): T {
  if (x === undefined) {
    throw new Error(
      `Value expected to not be undefined, but it is undefined.${message ? ` ${message}` : ""}`,
    )
  }
  return x
}
