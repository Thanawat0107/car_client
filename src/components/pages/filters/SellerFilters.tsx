"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC } from "react";
import { InputField } from "../inputField/InputField";
import { SelectField } from "../selectField/SelectField";
import SearchInput from "../searchInput/SearchInput";

export interface SellerSearchParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  identityNumber?: string;
  address?: string;
  isVerified?: boolean;
  sortBy?: string;
}

interface SellerFiltersProps {
  filters: SellerSearchParams;
  setFilters: React.Dispatch<React.SetStateAction<SellerSearchParams>>;
  search: string;
  setSearch: (value: string) => void;
}

const statusOptions = [
  { value: "", label: "ทั้งหมด" },
  { value: "true", label: "ยืนยันแล้ว" },
  { value: "false", label: "ยังไม่ยืนยัน" },
];

const sortOptions = [
  { value: "id", label: "ล่าสุด" },
  { value: "userid", label: "รหัสผู้ใช้ น้อย → มาก" },
  { value: "userid_desc", label: "รหัสผู้ใช้ มาก → น้อย" },
  { value: "identitynumber", label: "เลขบัตร น้อย → มาก" },
  { value: "identitynumber_desc", label: "เลขบัตร มาก → น้อย" },
  { value: "isverified", label: "สถานะ: ยังไม่ยืนยัน → ยืนยันแล้ว" },
  { value: "isverified_desc", label: "สถานะ: ยืนยันแล้ว → ยังไม่ยืนยัน" },
];

const SellerFilters: FC<SellerFiltersProps> = ({
  filters,
  setFilters,
  search,
  setSearch,
}) => {
  const handleChange = (field: keyof SellerSearchParams, value: any) => {
    let parsedValue: any;

    if (field === "isVerified") {
      parsedValue = value === "" ? undefined : value === "true";
    } else {
      parsedValue = value === "" ? undefined : value;
    }

    setFilters({ ...filters, [field]: parsedValue, pageNumber: 1 });
  };

  const handleReset = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 10,
      sortBy: "id",
    });
    setSearch("");
  };

  return (
    // 🚀 เพิ่ม mb-6 เหมือนใน Car/Brand Filters
    <div className="bg-white shadow-md rounded-lg p-6 w-full mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-700">🔍 ค้นหาผู้ขาย</h2>
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-sm"
          >
            ♻️ รีเซต
          </button>
          {/* 🚀 นำปุ่ม 'ค้นหา' ออก เพราะเราใช้ on change trigger อัตโนมัติเหมือนหน้าอื่นๆ */}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* ค้นหาด้วยชื่อผู้ใช้/ชื่อเต็ม */}
        <SearchInput value={search} onChange={setSearch} />

        {/* บัตรประชาชน */}
        <InputField
          label="เลขบัตรประชาชน"
          type="text"
          value={filters.identityNumber ?? ""}
          onChange={(e) => handleChange("identityNumber", e.target.value)} // 🚀 แก้ไขเป็น e.target.value ให้ตรงกับ Component InputField
        />

        {/* ที่อยู่ */}
        <InputField
          label="ที่อยู่"
          type="text"
          value={filters.address ?? ""}
          onChange={(e) => handleChange("address", e.target.value)} // 🚀 แก้ไขเป็น e.target.value
        />

        {/* สถานะยืนยันตัวตน */}
        <SelectField
          label="สถานะยืนยันตัวตน"
          value={filters.isVerified !== undefined ? String(filters.isVerified) : ""}
          onChange={(v) => handleChange("isVerified", v)}
          options={statusOptions}
          placeholder="เลือกสถานะ"
        />

        {/* เรียงตาม */}
        <SelectField
          label="เรียงตาม"
          value={filters.sortBy || "id"}
          onChange={(v: any) => handleChange("sortBy", v)}
          options={sortOptions}
          placeholder="เลือกการเรียง"
        />
      </div>
    </div>
  );
};

export default SellerFilters;