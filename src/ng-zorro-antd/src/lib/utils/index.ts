function useDefaultIfUnset<T>(value: T, defaultValue: T): T {
  return value !== void 0 ? value : defaultValue;
}

function useExist<T>(...args: T[]): T | null {
  return args.find(item => item !== void 0 && item !== null) || null;
}

export { useExist,  useDefaultIfUnset };
