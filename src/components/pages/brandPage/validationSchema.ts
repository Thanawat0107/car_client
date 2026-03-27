import * as Yup from "yup";

export const createValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("กรุณากรอกชื่อแบรนด์")
    .max(100, "ชื่อแบรนด์ยาวเกินไป (ไม่เกิน 100 ตัวอักษร)"), // เผื่อไว้กัน Error จากฝั่ง Database
  
  imageFile: Yup.mixed<File>()
    .nullable()
    .optional(), // ระบุให้ตรงกับ Interface ว่าส่งเป็น undefined หรือ null ก็ได้
  
  isUsed: Yup.boolean()
    .required("กรุณาระบุสถานะการใช้งาน"),
});

export const updateValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("กรุณากรอกชื่อแบรนด์")
    .max(100, "ชื่อแบรนด์ยาวเกินไป (ไม่เกิน 100 ตัวอักษร)"),
  
  imageFile: Yup.mixed<File>()
    .nullable()
    .optional(),
  
  isUsed: Yup.boolean()
    .required("กรุณาระบุสถานะการใช้งาน"),
  
  isDelete: Yup.boolean()
    .required("กรุณาระบุสถานะการลบ"),
});