import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  identityNumber: Yup.string()
    .required("กรุณากรอกเลขประจำตัวประชาชน")
    .matches(/^[0-9]{13}$/, "เลขประจำตัวประชาชนต้องเป็นตัวเลข 13 หลักเท่านั้น"),
    
  address: Yup.string()
    .required("กรุณากรอกที่อยู่สำหรับติดต่อ")
    .min(10, "ที่อยู่สั้นเกินไป กรุณากรอกรายละเอียดให้ชัดเจนขึ้น"), // 🚀 เพิ่ม min() ป้องกันการพิมพ์มั่วๆ เช่น "กทม"

  // 🚀 เพิ่ม isVerified แบบ optional เข้ามา เพื่อรองรับหน้า SellerForm (ของ Admin) ที่มีการติ๊กเปิด/ปิดสถานะ
  // ส่วนหน้า RegisterSellerForm ผู้ใช้จะไม่ได้กรอกฟิลด์นี้ แต่ระบบยัดค่า false ให้เอง จึงให้เป็น optional ได้ครับ
  isVerified: Yup.boolean().optional(),
});