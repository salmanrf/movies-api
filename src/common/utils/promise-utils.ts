export async function promiseTuplify<T>(promisified: Promise<T>): Promise<[T, Error]> {
  try {
    const res = await promisified;

    return [res, null];
  } catch (error) {
    return [null, error as Error];
  }
}
