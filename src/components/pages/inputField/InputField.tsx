/* eslint-disable @typescript-eslint/no-explicit-any */
export const InputField = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="number"
      className="w-full border rounded px-3 py-2"
      value={value || ""}
      onChange={(e) => onChange(parseInt(e.target.value) || undefined)}
    />
  </div>
);