/* eslint-disable @typescript-eslint/no-explicit-any */

export const enumToOptionsWithLabels = (
  enumObj: any,
  labels: Record<string, string>
): { label: string; value: string }[] => {
  // สำหรับ String Enum เราสามารถดึง Object.values ออกมาใช้เป็น value ได้เลย
  return Object.values(enumObj).map((enumValue: any) => {
    return {
      value: String(enumValue), // เช่น "Gasoline"
      label: labels[enumValue] || String(enumValue), // เช่น "น้ำมันเบนซิน" หรือถ้าไม่เจอใน label ก็แสดง "Gasoline"
    };
  });
};

// 🚀 ฟังก์ชันใหม่ สำหรับแปลค่า Enum คำเดียวให้เป็น Label ภาษาไทย
export const getEnumLabel = (
  value: string | undefined | null,
  labels: Record<string, string>
): string => {
  if (!value) return "-"; // ถ้าไม่มีค่า ส่งขีดกลับไป
  return labels[value] || value; // ถ้าเจอแปลไทยให้คืนค่าแปล ถ้าไม่เจอให้คืนค่าภาษาอังกฤษเดิม
};