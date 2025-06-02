"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { SellerSearchParams } from "@/@types/RequestHelpers/SellerSearchParams";
import { FC } from "react";
import { InputField } from "../inputField/InputField";
import { SelectField } from "../selectField/SelectField";
import SearchInput from "../searchInput/SearchInput";

interface SellerFiltersProps {
  filters: SellerSearchParams;
  setFilters: React.Dispatch<React.SetStateAction<SellerSearchParams>>;
  search: string;
  setSearch: (value: string) => void;
}

const statusOptions = [
  { value: "true", label: "ยืนยันแล้ว" },
  { value: "false", label: "ยังไม่ยืนยัน" },
];

const sortOptions = [
  { value: "id", label: "ล่าสุด" },                          // เรียงตาม Id ล่าสุด
  { value: "userid", label: "รหัสผู้ใช้ น้อย → มาก" },       // OrderBy(s => s.UserId)
  { value: "userid_desc", label: "รหัสผู้ใช้ มาก → น้อย" },  // OrderByDescending(s => s.UserId)
  { value: "identitynumber", label: "เลขบัตร น้อย → มาก" },  // OrderBy(s => s.IdentityNumber)
  { value: "identitynumber_desc", label: "เลขบัตร มาก → น้อย" }, // OrderByDescending(s => s.IdentityNumber)
  { value: "isverified", label: "สถานะ: ยังไม่ยืนยัน → ยืนยันแล้ว" }, // false → true
  { value: "isverified_desc", label: "สถานะ: ยืนยันแล้ว → ยังไม่ยืนยัน" }, // true → false
];

const SellerFilters: FC<SellerFiltersProps> = ({
  filters,
  setFilters,
  search,
  setSearch,
}) => {
  const handleChange = (field: keyof SellerSearchParams, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value, pageNumber: 1 }));
  };

  const handleReset = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 10,
      isVerified: false,
    });
    setSearch("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-700">🔍 ค้นหาผู้ขาย</h2>
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-sm"
          >
            ♻️ รีเซต
          </button>
          <button
            onClick={() => setFilters({ ...filters, pageNumber: 1 })}
            className="px-4 py-2 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm"
          >
            🔍 ค้นหา
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* ค้นหาด้วยชื่อผู้ใช้/ชื่อเต็ม */}
        <SearchInput value={search} onChange={setSearch} placeholder="ค้นหาชื่อผู้ใช้ หรือ ชื่อเต็ม" />

        {/* บัตรประชาชน */}
        <InputField
          label="เลขบัตรประชาชน"
          placeholder="ค้นหาเลขบัตรประชาชน"
          value={filters.identityNumber ?? ""}
          onChange={(v: any) => handleChange("identityNumber", v)}
        />

        {/* ที่อยู่ */}
        <InputField
          label="ที่อยู่"
          placeholder="ค้นหาที่อยู่"
          value={filters.address ?? ""}
          onChange={(v: any) => handleChange("address", v)}
        />

        {/* สถานะยืนยันตัวตน */}
        <SelectField
          label="สถานะยืนยันตัวตน"
          value={filters.isVerified?.toString()}
          onChange={(v) => handleChange("isVerified", v === "" ? undefined : v === "true")}
          options={statusOptions}
          placeholder="เลือกสถานะ"
        />

        {/* เรียงตาม */}
        <SelectField
          label="เรียงตาม"
          value={filters.sortBy ?? ""}
          onChange={(v: any) => handleChange("sortBy", v)}
          options={sortOptions}
          placeholder="เลือกการเรียง"
        />
      </div>
    </div>
  );
};

export default SellerFilters;
