/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";

interface CarFiltersProps {
  filters: {
    searchTerm: string;
    sortBy: string;
    pageNumber: number;
    pageSize: number;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  search: string;
  setSearch: (value: string) => void;
}

const CarFilters: FC<CarFiltersProps> = ({ filters, setFilters, search, setSearch }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 bg-white rounded shadow">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="ค้นหารถยนต์..."
        className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/3"
      />

      <select
        value={filters.sortBy}
        onChange={(e) =>
          setFilters((prev: any) => ({
            ...prev,
            sortBy: e.target.value,
            pageNumber: 1,
          }))
        }
        className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/4"
      >
        <option value="name">เรียงตามชื่อ</option>
        <option value="price">เรียงตามราคา</option>
        <option value="year">เรียงตามปี</option>
      </select>

      <select
        value={filters.carType}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            carType: e.target.value,
            pageNumber: 1,
          }))
        }
      >
        <option value="">ประเภทรถทั้งหมด</option>
        <option value="SUV">SUV</option>
        <option value="Sedan">Sedan</option>
      </select>
    </div>
  );
};

export default CarFilters;
