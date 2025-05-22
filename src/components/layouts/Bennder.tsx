import Link from "next/link";
import React from "react";

export default function Bennder() {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://cdn.pixabay.com/photo/2015/12/15/09/20/car-1093927_1280.jpg)",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-4 text-5xl font-bold">
            ระบบบริหารจัดการรถยนต์มือสองในชุมชน
          </h1>
          <p className="text-lg mb-6">
            เชื่อมต่อข้อมูล ซื้อขายรถยนต์มือสองใน ต.หนองกุ่ม จ.กาญจนบุรี
          </p>
          <Link href="#">
            <button className="btn btn-primary">เข้าสู่ระบบ</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
