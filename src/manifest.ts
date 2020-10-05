
export function manifestValue<T = string>(
    manifest: string,
    key: string,
    parser?: (dat: string) => T
  ): T {
    const value = new RegExp(`${key}=(.*)`).exec(manifest)![1];
    return (parser ? parser(value) : value) as T;
  }
  