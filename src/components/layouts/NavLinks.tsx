"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/hooks/useAppHookState";
import { SD_Roles } from "@/@types/Enum";

const staticMenu = [
  { name: "หน้าแรก", path: "/" },
  { name: "ซื้อรถยนต์", path: "/buy" },
  { name: "ขายรถยนต์", path: "/sell" },
  { name: "คำนวณค่างวด", path: "/loan-calculator" },
];

const adminMenu = [
  { name: "จัดการยี่ห้อ", path: "/manages/brand" },
  { name: "จัดการรถยนต์", path: "/manages/car" },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { role } = useAppSelector((state) => state.auth);
  const isAdminOrSeller =
    role === SD_Roles.Role_Admin || role === SD_Roles.Role_Seller;

  return (
     <>
      {staticMenu.map((item) => (
        <li key={item.path}>
          <Link
            className={pathname === item.path ? "active" : ""}
            href={item.path}
          >
            {item.name}
          </Link>
        </li>
      ))}

      {isAdminOrSeller && (
        <li>
          <details>
            <summary>การจัดการ</summary>
            <ul className="p-2 bg-[var(--color-neutral)]">
              {adminMenu.map((item) => (
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