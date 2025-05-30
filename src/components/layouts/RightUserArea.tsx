/* eslint-disable @next/next/no-img-element */
"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useAppHookState";
import { logout } from "@/stores/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const pathLogin = "/login";

export default function RightUserArea() {
  const { userName, token } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push(pathLogin);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      {token ? (
        <>
          <span className="hidden md:inline">👋 สวัสดี {userName}</span>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[var(--color-neutral)] rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a onClick={() => router.push("/profile")}>โปรไฟล์</a>
              </li>
              <li>
                <a onClick={() => router.push("/settings")}>ตั้งค่า</a>
              </li>
              <li>
                <a onClick={() => router.push("/register-seller")}>ลงทะเบียนขายรถ</a>
              </li>
              <li>
                <a onClick={handleLogout}>ออกจากระบบ</a>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
