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
  mileage: Yup.number().required("กรุณากรอกระยะทาง"),
  color: Yup.string().required("กรุณากรอกสี"),

  engineType: Yup.number().required("กรุณาเลือกประเภทเครื่องยนต์"),
  gearType: Yup.number().required("กรุณาเลือกประเภทเกียร์"),
  carType: Yup.number().required("กรุณาเลือกประเภทของรถ"),
  status: Yup.number().required("กรุณาเลือกสถานะ"),

  description: Yup.string().nullable(),
  imageFile: Yup.mixed().nullable(),
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
  mileage: Yup.number().required("กรุณากรอกระยะทาง"),
  color: Yup.string().required("กรุณากรอกสี"),

  engineType: Yup.number().required("กรุณาเลือกประเภทเครื่องยนต์"),
  gearType: Yup.number().required("กรุณาเลือกประเภทเกียร์"),
  carType: Yup.number().required("กรุณาเลือกประเภทของรถ"),
  status: Yup.number().required("กรุณาเลือกสถานะ"),

  description: Yup.string().nullable(),
  imageFile: Yup.mixed().nullable(),

  isUsed: Yup.boolean().required(),
  isDeleted: Yup.boolean().required(),
});
