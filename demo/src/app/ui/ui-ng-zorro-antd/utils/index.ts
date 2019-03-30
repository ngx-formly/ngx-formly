
  function isNzFields(key: string): boolean {
    return key.startsWith('nz');
  }

  function getNzFields(target: object): string[] {
    return Object.keys(target).filter(key => isNzFields(key));
  }

  export {
    isNzFields,
    getNzFields,
  };
