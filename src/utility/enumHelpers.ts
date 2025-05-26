/* eslint-disable @typescript-eslint/no-explicit-any */

export const enumToOptionsWithLabels = (
  enumObj: any,
  labels: Record<string, string>
): { label: string; value: string }[] => {
  return Object.keys(enumObj)
    .filter((key) => !isNaN(Number(key))) // รับเฉพาะ numeric keys
    .map((key) => {
      const enumKey = enumObj[key]; // eg. "Manual"
      return {
        value: key, // eg. "0"
        label: labels[enumKey] || enumKey, // eg. "ด้วยมือ"
      };
    });
};