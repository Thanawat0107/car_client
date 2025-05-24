import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("กรุณากรอกชื่อแบรนด์"),
  imageFile: Yup.mixed().nullable(),
});