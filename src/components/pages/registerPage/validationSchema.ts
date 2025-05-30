import * as yup from "yup";

export const validationSchema = yup.object({
  userName: yup.string().required("กรุณากรอกชื่อผู้ใช้"),
  fullName: yup.string().required("กรุณากรอกชื่อ-นามสกุล"),
  email: yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมล"),
  phoneNumber: yup.string().required("กรุณากรอกเบอร์โทร"),
  password: yup.string().min(2, "รหัสผ่านต้องมีอย่างน้อย 6 ตัว").required("กรุณากรอกรหัสผ่าน"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "รหัสผ่านไม่ตรงกัน")
    .required("กรุณายืนยันรหัสผ่าน"),
});