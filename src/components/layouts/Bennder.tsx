import Link from "next/link";
import React from "react";

export default function Bennder() {
  return (
    <div
      className="hero min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://cdn.pixabay.com/photo/2015/12/15/09/20/car-1093927_1280.jpg)",
      }}
    >
      <div className="hero-overlay bg-opacity-50" />
      <div className="hero-content text-center text-neutral-content px-4">
        <div className="max-w-md">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            ระบบบริหารจัดการรถยนต์มือสองในชุมชน
          </h1>
          <p className="text-base md:text-lg mb-6">
            เชื่อมต่อข้อมูล ซื้อขายรถยนต์มือสองใน ต.หนองกุ่ม จ.กาญจนบุรี
          </p>
          <Link href="/login">
            <button className="btn btn-primary">เข้าสู่ระบบ</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
