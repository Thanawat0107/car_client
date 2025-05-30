import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  userName: Yup.string().required("กรุณากรอกชื่อผู้ใช้"),
  password: Yup.string().required("กรุณากรอกรหัสผ่าน"),
});