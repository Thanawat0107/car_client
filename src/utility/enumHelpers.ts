/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Option {
  label: string;
  value: string;
}

export const enumToOptions = (e: any): { label: string; value: string }[] => {
  return Object.keys(e)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: key,
      value: e[key].toString(),
    }));
};