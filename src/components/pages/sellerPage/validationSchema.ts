import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  // identityNumber: Yup.string()
  //   .required("กรุณากรอกเลขบัตรประชาชน")
  //   .matches(/^[0-9]{13}$/, "เลขบัตรประชาชนต้องมี 13 หลัก"),
  // address: Yup.string().required("กรุณากรอกที่อยู่"),
});