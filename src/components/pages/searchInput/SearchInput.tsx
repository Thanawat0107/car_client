// components/SearchInput.tsx
import React from "react";

interface SearchInputProps {
  value: string;
  label?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  label = "ค้นหา",
  value,
  onChange,
  placeholder
}) => {
  return (
    <div className="w-full mb-4">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          placeholder={placeholder ?? label}
          className="w-full border rounded-xl px-4 py-3 border-gray-300 focus:outline-neutral"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchInput;
