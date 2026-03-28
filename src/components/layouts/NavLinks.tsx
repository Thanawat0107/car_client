"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/hooks/useAppHookState";
import { SD_Roles } from "@/@types/Status";
import { useEffect, useState } from "react";

const publicMenu = [
  { name: "หน้าแรก", path: "/" },
  { name: "ซื้อรถยนต์", path: "/car" },
  { name: "คำนวณค่างวด", path: "/loan-calculator" },
];

const adminMenu = [
  { name: "จัดการยี่ห้อ", path: "/manages/brand" },
  { name: "จัดการรถยนต์", path: "/manages/car" },
  { name: "จัดการผู้จำหน่าย", path: "/manages/seller" },
  { name: "การจองทั้งระบบ", path: "/manages/admin-bookings" },
  { name: "ชำระเงินทั้งระบบ", path: "/manages/admin-payments" },
];

const sellerMenu = [
  { name: "จัดการรถยนต์", path: "/manages/car" },
  { name: "จัดการการจอง", path: "/manages/booking" },
  { name: "จัดการชำระเงิน", path: "/manages/payment" },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { role, isAuthenticated } = useAppSelector((state) => state.auth);
  const isAdminOrSeller =
    role === SD_Roles.Role_Admin || role === SD_Roles.Role_Seller;

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
     <>
      {publicMenu.map((item) => (
        <li key={item.path}>
          <Link
            className={pathname === item.path ? "active" : ""}
            href={item.path}
          >
            {item.name}
          </Link>
        </li>
      ))}

      {mounted && isAuthenticated && !isAdminOrSeller && (
        <li>
          <Link
            className={pathname === "/booking" ? "active" : ""}
            href="/booking"
          >
            การจองของฉัน
          </Link>
        </li>
      )}

      {mounted && isAdminOrSeller && (
        <li>
          <details>
            <summary>การจัดการ</summary>
            <ul className="p-2 bg-[var(--color-neutral)]">
              {(role === SD_Roles.Role_Admin ? adminMenu : sellerMenu).map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </details>
        </li>
      )}
    </>
  );
}