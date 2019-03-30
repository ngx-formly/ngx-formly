
  function useDefaultIfUnset<T>(value: T, defaultValue: T): T {
    return value !== void 0 ? value : defaultValue;
  }

  export {
    useDefaultIfUnset,
  };
