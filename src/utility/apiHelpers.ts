import type { ApiResponse } from "@/@types/Responsts/ApiResponse";

/**
 * แกะ result ออกจาก ApiResponse<T>
 * ใช้ใน transformResponse แทนการเขียน if/throw ซ้ำๆ
 */
export const unwrapResult = <T,>(response: ApiResponse<T>): T => {
  if (response.result !== undefined && response.result !== null) {
    return response.result;
  }
  throw new Error(response.message || "Unknown error");
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function isFile(value: unknown): value is File | Blob {
  return value instanceof File || value instanceof Blob;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !isFile(value) &&
    !(value instanceof Date)
  );
}

/**
 * แปลง object → FormData แบบรองรับ:
 * - primitive: string / number / boolean
 * - Date: แปลงเป็น ISO string
 * - File / Blob
 * - array ของไฟล์: ใช้ key เดิมซ้ำ (สำหรับ IFormFile[])
 * - array ของ object: ใช้ key แบบ field[0].Property
 * - nested object: ใช้ key แบบ parent.child
 *
 * ใช้กับ ASP.NET Core [FromForm] / DTO ที่มี List<> / nested object ได้
 */
export function toFormData<T extends Record<string, any>>(data: T): FormData {
  const formData = new FormData();

  const append = (value: any, key: string) => {
    if (value === undefined || value === null) return;

    if (isFile(value)) {
      formData.append(key, value);
      return;
    }

    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (isFile(item)) {
          formData.append(key, item);
        } else if (isPlainObject(item)) {
          Object.entries(item).forEach(([childKey, childValue]) => {
            const cap = childKey.charAt(0).toUpperCase() + childKey.slice(1);
            append(childValue, `${key}[${index}].${cap}`);
          });
        } else {
          formData.append(`${key}[${index}]`, String(item));
        }
      });
      return;
    }

    if (isPlainObject(value)) {
      Object.entries(value).forEach(([childKey, childValue]) => {
        const cap = childKey.charAt(0).toUpperCase() + childKey.slice(1);
        append(childValue, `${key}.${cap}`);
      });
      return;
    }

    formData.append(key, String(value));
  };

  Object.entries(data).forEach(([key, value]) => {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    append(value, capitalizedKey);
  });

  return formData;
}
