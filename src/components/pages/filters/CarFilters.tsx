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
import { enumToOptions } from "@/utility/enumHelpers";
import SearchInput from "../searchInput/SearchInput";

interface CarFiltersProps {
  filters: CarSearchParams;
  setFilters: React.Dispatch<React.SetStateAction<CarSearchParams>>;
  search: string;
  setSearch: (value: string) => void;
}

const CarFilters: FC<CarFiltersProps> = ({
  filters,
  setFilters,
  search,
  setSearch,
}) => {
  const handleChange = (field: keyof CarSearchParams, value: any) => {
    setFilters({ ...filters, [field]: value, pageNumber: 1 });
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        🔍 ค้นหารถยนต์
      </h2>

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
          options={enumToOptions(CarType)}
        />

        <SelectField
          label="เครื่องยนต์"
          value={filters.engineType?.toString()}
          onChange={(v) =>
            handleChange("engineType", v === "" ? undefined : Number(v))
          }
          options={enumToOptions(EngineType)}
        />

        <SelectField
          label="เกียร์"
          value={filters.gearType?.toString()}
          onChange={(v) =>
            handleChange("gearType", v === "" ? undefined : Number(v))
          }
          options={enumToOptions(GearType)}
        />

        <SelectField
          label="สถานะ"
          value={filters.status?.toString()}
          onChange={(v) =>
            handleChange("status", v === "" ? undefined : Number(v))
          }
          options={enumToOptions(Status)}
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
