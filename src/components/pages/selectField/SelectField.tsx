interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  label: string;
}

export const SelectField = ({ label, value, onChange, options }: SelectFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      className="w-full border rounded px-3 py-2"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">ทั้งหมด</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
