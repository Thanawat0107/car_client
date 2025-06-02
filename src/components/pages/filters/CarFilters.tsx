/* eslint-disable @typescript-eslint/no-explicit-any */
import { CarSearchParams } from "@/@types/RequestHelpers/CarSearchParams";
import { FC } from "react";
import { InputField } from "../inputField/InputField";
import { SelectField } from "../selectField/SelectField";
import { CarType, EngineType, GearType, Status } from "@/@types/Enum";
import SearchInput from "../searchInput/SearchInput";
import { enumToOptionsWithLabels } from "@/utility/enumHelpers";

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
  Manual: "ด้วยมือ",
  Automatic: "อัตโนมัติ",
};
export const carTypeLabels = {
  FourDoorSedan: "รถเก๋งสี่ประตู",
  PickUpTruck: "รถปิกอัพ",
  CarSUV: "รถยนต์ SUV",
  CarVan: "รถตู้",
};
export const statusLabels = {
  Available: "มีอยู่",
  Sold: "ขายแล้ว",
  Reserved: "จองแล้ว",
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
      pageSize: 5,
    });
    setSearch("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-700">🔍 ค้นหารถยนต์</h2>

        {/* ปุ่มค้นหาและรีเซต */}
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

        <InputField
          label="ราคาเริ่มต้น"
          type="number"
          value={
            filters.minPrice !== undefined ? filters.minPrice.toString() : ""
          }
          onChange={(e) => handleChange("minPrice", e.target.value)}
        />
        <InputField
          label="ราคาสูงสุด"
          type="number"
          value={
            filters.maxPrice !== undefined ? filters.maxPrice.toString() : ""
          }
          onChange={(e) => handleChange("maxPrice", e.target.value)}
        />

        <InputField
          label="ปีเริ่มต้น"
          type="number"
          value={
            filters.minYear !== undefined ? filters.minYear.toString() : ""
          }
          onChange={(e) => handleChange("minYear", e.target.value)}
        />
        <InputField
          label="ปีสูงสุด"
          type="number"
          value={
            filters.maxYear !== undefined ? filters.maxYear.toString() : ""
          }
          onChange={(e) => handleChange("maxYear", e.target.value)}
        />

        <InputField
          label="ไมล์ต่ำสุด"
          type="number"
          value={
            filters.minMileage !== undefined
              ? filters.minMileage.toString()
              : ""
          }
          onChange={(e) => handleChange("minMileage", e.target.value)}
        />
        <InputField
          label="ไมล์สูงสุด"
          type="number"
          value={
            filters.maxMileage !== undefined
              ? filters.maxMileage.toString()
              : ""
          }
          onChange={(e) => handleChange("maxMileage", e.target.value)}
        />

        <SelectField
          label="ประเภทรถ"
          value={filters.carType?.toString()}
          onChange={(v) =>
            handleChange("carType", v === "" ? undefined : Number(v))
          }
          options={enumToOptionsWithLabels(CarType, carTypeLabels)}
        />

        <SelectField
          label="เครื่องยนต์"
          value={filters.engineType?.toString()}
          onChange={(v) =>
            handleChange("engineType", v === "" ? undefined : Number(v))
          }
          options={enumToOptionsWithLabels(EngineType, engineTypeLabels)}
        />

        <SelectField
          label="เกียร์"
          value={filters.gearType?.toString()}
          onChange={(v) =>
            handleChange("gearType", v === "" ? undefined : Number(v))
          }
          options={enumToOptionsWithLabels(GearType, GearTypeLabels)}
        />

        <SelectField
          label="สถานะ"
          value={filters.status?.toString()}
          onChange={(v) =>
            handleChange("status", v === "" ? undefined : Number(v))
          }
          options={enumToOptionsWithLabels(Status, statusLabels)}
          placeholder="เลือกสถานะรถ"
        />

        <SelectField
          label="เรียงตาม"
          value={filters.sortBy}
          onChange={(v: any) => handleChange("sortBy", v)}
          options={sortOptions.map((opt) => ({
            label: opt.label,
            value: opt.value,
          }))}
        />
      </div>
    </div>
  );
};

export default CarFilters;