"use client";

import React from "react";
import { GrCar } from "react-icons/gr";
import { useRouter } from "next/navigation";

export default function Navber() {
    const router = useRouter();
  return (
    <div className="sticky top-0 z-50 flex justify-between bg-white p-5 items-center text-gray-800 shadow-md">
      <div className="flex items-center gap-2 text-3xl font-semibold text-emerald-600">
        <GrCar size={34} />
        <div>รถยนต์มือสอง</div>
      </div>

      <div className="navbar-center hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
        <ul className="menu menu-horizontal px-1">
          <li>
             <a onClick={() => router.push("/")}>หน้าแรก</a>
          </li>
          <li>
            <a  onClick={() => router.push("/")} >ซื้อรถยนต์</a>
          </li>
          <li>
            <a  onClick={() => router.push("/")}>ขายรถยนต์</a>
          </li>
          <li>
            <a  onClick={() => router.push("/")}>คำนวณค่างวด</a>
          </li>
          <li>
            <details>
              <summary>การจัดการ</summary>
              <ul className="p-2">
                <li>
                  <a  onClick={() => router.push("/manages/brand")}>จัดการยี่ห่อ</a>
                </li>
                <li>
                  <a  onClick={() => router.push("/manages/car")}>จัดการรถยนต์</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <a className="btn">เข้าสู่ระบบ</a>
      </div>
    </div>
  );
}
