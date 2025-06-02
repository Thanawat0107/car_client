interface Option {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  label?: string;
  placeholder?: string;
}

export const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder = "ทั้งหมด",
}: SelectFieldProps) => (
  <div className="w-full mb-4">
    {/* Label */}
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>

    <div className="relative">
      <select
        className="w-full border rounded-xl px-4 py-3 border-gray-300 focus:outline-neutral"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);
