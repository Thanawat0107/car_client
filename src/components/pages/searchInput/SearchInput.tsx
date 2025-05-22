// components/SearchInput.tsx
import React from "react";

interface SearchInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ label = "ค้นหา", value, onChange }) => {
  return (
    <div className="flex flex-col justify-end">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        placeholder={label}
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;