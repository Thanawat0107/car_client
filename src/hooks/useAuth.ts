/* eslint-disable @typescript-eslint/no-unused-vars */
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useAppDispatch } from "./useAppHookState";
import { setCredentials, logout } from "../stores/slices/authSlice";
import { RegisterResponse } from "@/@types/Responsts/RegisterResponse";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/navigation";

const path = "/login";
const MySwal = withReactContent(Swal);

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<RegisterResponse & { exp: number }>(token);

        // เช็คเวลาหมดอายุ (exp เป็นวินาที → ต้องคูณ 1000)
        if (decoded.exp * 1000 < Date.now()) {
          dispatch(logout());

          MySwal.fire({
            icon: "warning",
            title: "Session หมดอายุ",
            text: "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
            confirmButtonText: "ตกลง",
          }).then(() => {
            router.push(path);
          });
          return;
        }

        dispatch(
          setCredentials({
            ...decoded,
            userName: decoded.userName,
            token,
          })
        );
      } catch (error) {
        localStorage.removeItem("token");
        dispatch(logout());
        router.push(path);
      }
    }
  }, [dispatch, router]);
};
