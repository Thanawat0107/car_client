/* eslint-disable @typescript-eslint/no-explicit-any */
import { CarSearchParams } from "@/@types/RequestHelpers/CarSearchParams";
import { FC } from "react";
import { InputField } from "../inputField/InputField";
import { SelectField } from "../selectField/SelectField";
import {
  CarType,
  EngineType,
  GearType,
  sortOptions,
  Status,
} from "@/@types/Enum";
import SearchInput from "../searchInput/SearchInput";
import { enumToOptionsWithLabels } from "@/utility/enumHelpers";

interface CarFiltersProps {
  filters: CarSearchParams;
  setFilters: React.Dispatch<React.SetStateAction<CarSearchParams>>;
  search: string;
  setSearch: (value: string) => void;
}

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
    setFilters({ ...filters, [field]: value, pageNumber: 1 });
  };

  const handleReset = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 3,
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
          value={filters.minPrice}
          onChange={(v: any) => handleChange("minPrice", v)}
        />
        <InputField
          label="ราคาสูงสุด"
          value={filters.maxPrice}
          onChange={(v: any) => handleChange("maxPrice", v)}
        />

        <InputField
          label="ปีเริ่มต้น"
          value={filters.minYear}
          onChange={(v: any) => handleChange("minYear", v)}
        />
        <InputField
          label="ปีสูงสุด"
          value={filters.maxYear}
          onChange={(v: any) => handleChange("maxYear", v)}
        />

        <InputField
          label="ไมล์ต่ำสุด"
          value={filters.minMileage}
          onChange={(v: any) => handleChange("minMileage", v)}
        />
        <InputField
          label="ไมล์สูงสุด"
          value={filters.maxMileage}
          onChange={(v: any) => handleChange("maxMileage", v)}
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
