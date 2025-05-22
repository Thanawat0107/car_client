/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { GrCar } from "react-icons/gr";
import { useRouter } from "next/navigation";

export default function Navber() {
    const router = useRouter();
  return (
    <div className="sticky top-0 z-50 flex justify-between bg-[var(--foreground)] p-5 items-center text-white shadow-md">
      <div className="flex items-center gap-2 text-3xl font-semibold text-[var(--color-accent)]">
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
              <ul className="p-2 bg-[var(--color-neutral)]">
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

      <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
    </div>
  );
}
