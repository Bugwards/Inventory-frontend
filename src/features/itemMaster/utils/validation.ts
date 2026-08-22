export const isMin3 = (val: string) => val.length >= 3;

export const isUppercaseOnly = (val: string) =>
  /^[A-Z]+$/.test(val);

export const isAlphaNumeric = (val: string) =>
  /^[a-zA-Z0-9]+$/.test(val);

export const isAlphaNumericMandatory = (val: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(val);