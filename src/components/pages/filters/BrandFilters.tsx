/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrandSearchParams } from "@/@types/RequestHelpers/BrandSearchParams";
import { FC } from "react";
import { SelectField } from "../selectField/SelectField";
import SearchInput from "../searchInput/SearchInput";

interface BrandFiltersProps {
  filters: BrandSearchParams;
  setFilters: React.Dispatch<React.SetStateAction<BrandSearchParams>>;
  search: string;
  setSearch: (value: string) => void;
}

const BrandFilters: FC<BrandFiltersProps> = ({
  filters,
  setFilters,
  search,
  setSearch,
}) => {
  const handleChange = (field: keyof BrandSearchParams, value: any) => {
    setFilters({ ...filters, [field]: value, pageNumber: 1 });
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
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-700">🔍 ค้นหาแบรนด์รถยนต์</h2>
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
        <SearchInput value={search} onChange={setSearch} />

        <SelectField
          label="สถานะการใช้งาน"
          value={filters.isUsed !== undefined ? String(filters.isUsed) : ""}
          onChange={(v) =>
            handleChange("isUsed", v === "" ? undefined : v === "true")
          }
          options={[
            { label: "ทั้งหมด", value: "" },
            { label: "ปิดการใช้งาน", value: "false" },
            { label: "เปิดใช้งาน", value: "true" },
          ]}
        />

        <SelectField
          label="เรียงตาม"
          value={filters.sortBy}
          onChange={(v: any) => handleChange("sortBy", v)}
          options={[
            { label: "ค่าเริ่มต้น", value: "id" },
            { label: "ชื่อ (A-Z)", value: "name" },
            { label: "ชื่อ (Z-A)", value: "nameDesc" },
          ]}
        />
      </div>
    </div>
  );
};

export default BrandFilters;
