/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import { SelectField } from "../selectField/SelectField";
import SearchInput from "../searchInput/SearchInput";

// 🚀 เพิ่ม Interface BrandSearchParams เข้ามาในไฟล์นี้เหมือนกับ CarFilters
export interface BrandSearchParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  isUsed?: boolean;
  sortBy?: string;
}

interface BrandFiltersProps {
  filters: BrandSearchParams;
  setFilters: React.Dispatch<React.SetStateAction<BrandSearchParams>>;
  search: string;
  setSearch: (value: string) => void;
}

const sortOptions = [
  { value: "id", label: "ค่าเริ่มต้น" },
  { value: "name", label: "ชื่อ (A-Z)" },
  { value: "nameDesc", label: "ชื่อ (Z-A)" },
];

const statusOptions = [
  { value: "", label: "ทั้งหมด" },
  { value: "true", label: "เปิดใช้งาน" },
  { value: "false", label: "ปิดการใช้งาน" },
];

const BrandFilters: FC<BrandFiltersProps> = ({
  filters,
  setFilters,
  search,
  setSearch,
}) => {
  const handleChange = (field: keyof BrandSearchParams, value: any) => {
    let parsedValue: any;

    if (field === "isUsed") {
      parsedValue = value === "" ? undefined : value === "true";
    } else {
      parsedValue = value;
    }

    setFilters({ ...filters, [field]: parsedValue, pageNumber: 1 });
  };

  const handleReset = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 10, // สมมติค่าเริ่มต้น
    });
    setSearch("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-700">🔍 ค้นหาแบรนด์รถยนต์</h2>
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-sm"
          >
            ♻️ รีเซต
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <SearchInput value={search} onChange={setSearch} />

        <SelectField
          label="สถานะการใช้งาน"
          value={filters.isUsed !== undefined ? String(filters.isUsed) : ""}
          onChange={(v) => handleChange("isUsed", v)}
          options={statusOptions}
          placeholder="เลือกสถานะ"
        />

        <SelectField
          label="เรียงตาม"
          value={filters.sortBy || "id"}
          onChange={(v: any) => handleChange("sortBy", v)}
          options={sortOptions}
        />
      </div>
    </div>
  );
};

export default BrandFilters;