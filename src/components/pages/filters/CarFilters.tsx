/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import { InputField } from "../inputField/InputField";
import { SelectField } from "../selectField/SelectField";
import SearchInput from "../searchInput/SearchInput";
import { enumToOptionsWithLabels } from "@/utility/enumHelpers";
import { CarStatus, CarType, EngineType, GearType } from "@/@types/Status";

export interface CarSearchParams {
  pageNumber: number;
  pageSize: number;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  carType?: string;
  engineType?: string;
  gearType?: string;
  carStatus?: string;
  sortBy?: string;
  brandId?: string; // ถ้าอนาคตอยากกรองตามแบรนด์เพิ่ม
}

interface CarFiltersProps {
  filters: CarSearchParams;
  setFilters: React.Dispatch<React.SetStateAction<CarSearchParams>>;
  search: string;
  setSearch: (value: string) => void;
}

const sortOptions = [
  { value: "id", label: "ล่าสุด" },
  { value: "price", label: "ราคาต่ำ -> สูง" },
  { value: "price_desc", label: "ราคาสูง -> ต่ำ" },
  { value: "year", label: "ปีน้อย -> มาก" },
  { value: "yearDesc", label: "ปีมาก -> น้อย" },
  { value: "mileageAsc", label: "ไมล์น้อย -> มาก" },
  { value: "mileageDesc", label: "ไมล์มาก -> น้อย" },
];

export const engineTypeLabels = {
  Gasoline: "น้ำมันเบนซิน",
  Diesel: "ดีเซล",
  Electric: "ไฟฟ้า",
  Hybrid: "ลูกผสม",
};
export const GearTypeLabels = {
  Manual: "ธรรมดา",
  Automatic: "อัตโนมัติ",
};
export const carTypeLabels = {
  FourDoorSedan: "รถเก๋ง 4 ประตู",
  PickUpTruck: "รถกระบะ",
  CarSUV: "รถ SUV",
  CarVan: "รถตู้",
};
export const statusLabels = {
  Available: "ว่าง",
  Booked: "จองแล้ว",
  Sold: "ขายแล้ว",
};

const CarFilters: FC<CarFiltersProps> = ({
  filters,
  setFilters,
  search,
  setSearch,
}) => {
  const handleChange = (field: keyof CarSearchParams, value: any) => {
    let parsedValue: any;

    if (
      field === "minPrice" ||
      field === "maxPrice" ||
      field === "minYear" ||
      field === "maxYear" ||
      field === "minMileage" ||
      field === "maxMileage"
    ) {
      parsedValue = value === "" ? undefined : Number(value);
      if (isNaN(parsedValue)) parsedValue = undefined;
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
        <h2 className="text-lg font-semibold text-gray-700">🔍 ค้นหารถยนต์</h2>
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

        <InputField
          label="ราคาเริ่มต้น"
          type="number"
          value={filters.minPrice !== undefined ? filters.minPrice.toString() : ""}
          onChange={(e) => handleChange("minPrice", e.target.value)}
        />
        <InputField
          label="ราคาสูงสุด"
          type="number"
          value={filters.maxPrice !== undefined ? filters.maxPrice.toString() : ""}
          onChange={(e) => handleChange("maxPrice", e.target.value)}
        />

        <InputField
          label="ปีเริ่มต้น"
          type="number"
          value={filters.minYear !== undefined ? filters.minYear.toString() : ""}
          onChange={(e) => handleChange("minYear", e.target.value)}
        />
        <InputField
          label="ปีสูงสุด"
          type="number"
          value={filters.maxYear !== undefined ? filters.maxYear.toString() : ""}
          onChange={(e) => handleChange("maxYear", e.target.value)}
        />

        <InputField
          label="ไมล์ต่ำสุด"
          type="number"
          value={filters.minMileage !== undefined ? filters.minMileage.toString() : ""}
          onChange={(e) => handleChange("minMileage", e.target.value)}
        />
        <InputField
          label="ไมล์สูงสุด"
          type="number"
          value={filters.maxMileage !== undefined ? filters.maxMileage.toString() : ""}
          onChange={(e) => handleChange("maxMileage", e.target.value)}
        />

        <SelectField
          label="ประเภทรถ"
          value={filters.carType}
          onChange={(v) => handleChange("carType", v === "" ? undefined : v)}
          options={enumToOptionsWithLabels(CarType, carTypeLabels)}
          placeholder="เลือกประเภทรถ"
        />

        <SelectField
          label="เครื่องยนต์"
          value={filters.engineType}
          onChange={(v) => handleChange("engineType", v === "" ? undefined : v)}
          options={enumToOptionsWithLabels(EngineType, engineTypeLabels)}
          placeholder="เลือกเครื่องยนต์"
        />

        <SelectField
          label="เกียร์"
          value={filters.gearType}
          onChange={(v) => handleChange("gearType", v === "" ? undefined : v)}
          options={enumToOptionsWithLabels(GearType, GearTypeLabels)}
          placeholder="เลือกระบบเกียร์"
        />

        <SelectField
          label="สถานะ"
          value={filters.carStatus}
          onChange={(v) => handleChange("carStatus", v === "" ? undefined : v)}
          options={enumToOptionsWithLabels(CarStatus, statusLabels)}
          placeholder="เลือกสถานะรถ"
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

export default CarFilters;