import * as Yup from "yup";

export const createValidationSchema = Yup.object().shape({
  name: Yup.string().required("กรุณากรอกชื่อแบรนด์"),
  imageFile: Yup.mixed().nullable(),
  isUsed: Yup.boolean()
});

export const updateValidationSchema = Yup.object().shape({
  name: Yup.string().required("กรุณากรอกชื่อแบรนด์"),
  imageFile: Yup.mixed().nullable(),
  isUsed: Yup.boolean(),
  isDelete: Yup.boolean(),
});