"use client"

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
}

export const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder = " ",
  error,
  touched,
  required = false,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const showError = error && touched;

  return (
    <div className="w-full mb-4">
      {/* Floating Label */}
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type={inputType}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={clsx(
            "w-full border rounded-xl px-4 py-3",
            showError
              ? "border-red-500 focus:outline-red-500"
              : "border-gray-300 focus:outline-neutral",
            isPassword && "pr-12"
          )}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:bg-gray-100 rounded-full transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {showError && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
};
