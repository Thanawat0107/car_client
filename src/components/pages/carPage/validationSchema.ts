import * as Yup from "yup";

export const createValidationSchema = Yup.object().shape({
  brandId: Yup.string().required("กรุณาเลือกยี่ห้อรถยนต์").nullable(),
  sellerId: Yup.number().required("กรุณาเลือกผู้ขาย"),

  carRegistrationNumber: Yup.string().required("กรุณากรอกหมายเลขทะเบียนรถ"),
  carIdentificationNumber: Yup.string().nullable(),
  engineNumber: Yup.string().nullable(),
  model: Yup.string().required("กรุณากรอกรุ่นรถ"),
  year: Yup.number().required("กรุณากรอกปีที่ผลิต"),
  price: Yup.number().required("กรุณากรอกราคา"),
  bookingPrice: Yup.number().min(0, "ราคามัดจำต้องไม่ติดลบ").required("กรุณาระบุราคามัดจำ"),
  mileage: Yup.number().required("กรุณากรอกระยะทาง"),
  color: Yup.string().required("กรุณากรอกสี"),

  // 🚀 แก้ไขจาก number() เป็น string()
  engineType: Yup.string().required("กรุณาเลือกประเภทเครื่องยนต์"),
  gearType: Yup.string().required("กรุณาเลือกประเภทเกียร์"),
  carType: Yup.string().required("กรุณาเลือกประเภทของรถ"),
  
  // 🚀 เปลี่ยนชื่อจาก status เป็น carStatus และใช้ string()
  carStatus: Yup.string().required("กรุณาเลือกสถานะ"),

  description: Yup.string().nullable(),
  
  // 🚀 เพิ่มฟิลด์ใหม่ตาม DTO
  isCollisionHistory: Yup.boolean().default(false),
  insurance: Yup.string().nullable(),
  act: Yup.string().nullable(),

  // 🚀 เปลี่ยนชื่อจาก imageFile เป็น newImages
  newImages: Yup.mixed().nullable(),
});

export const updateValidationSchema = Yup.object().shape({
  brandId: Yup.string().required("กรุณาเลือกยี่ห้อรถยนต์").nullable(),
  sellerId: Yup.number().required("กรุณาเลือกผู้ขาย"),

  carRegistrationNumber: Yup.string().required("กรุณากรอกหมายเลขทะเบียนรถ"),
  carIdentificationNumber: Yup.string().nullable(),
  engineNumber: Yup.string().nullable(),
  model: Yup.string().required("กรุณากรอกรุ่นรถ"),
  year: Yup.number().required("กรุณากรอกปีที่ผลิต"),
  price: Yup.number().required("กรุณากรอกราคา"),
  bookingPrice: Yup.number().min(0, "ราคามัดจำต้องไม่ติดลบ").required("กรุณาระบุราคามัดจำ"),
  mileage: Yup.number().required("กรุณากรอกระยะทาง"),
  color: Yup.string().required("กรุณากรอกสี"),

  // 🚀 แก้ไขจาก number() เป็น string()
  engineType: Yup.string().required("กรุณาเลือกประเภทเครื่องยนต์"),
  gearType: Yup.string().required("กรุณาเลือกประเภทเกียร์"),
  carType: Yup.string().required("กรุณาเลือกประเภทของรถ"),
  
  // 🚀 เปลี่ยนชื่อจาก status เป็น carStatus และใช้ string()
  carStatus: Yup.string().required("กรุณาเลือกสถานะ"),

  description: Yup.string().nullable(),

  // 🚀 เพิ่มฟิลด์ใหม่ตาม DTO
  isCollisionHistory: Yup.boolean().default(false),
  insurance: Yup.string().nullable(),
  act: Yup.string().nullable(),

  // 🚀 เปลี่ยนชื่อจาก imageFile เป็น newImages
  newImages: Yup.mixed().nullable(),

  isUsed: Yup.boolean().required(),
  isDeleted: Yup.boolean().required(),
});