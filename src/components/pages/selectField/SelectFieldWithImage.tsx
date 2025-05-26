/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface OptionWithImage {
  value: string | number;
  label?: string;
  imageUrl?: string;
}

interface SelectFieldWithImageProps {
  value?: string | number;
  onChange: (value: string | number) => void;
  options: OptionWithImage[];
  label?: string;
  placeholder?: string;
}

export const SelectFieldWithImage = ({
  label,
  value,
  onChange,
  options,
  placeholder = "เลือก...",
}: SelectFieldWithImageProps) => {
  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white py-4 pl-5 pr-12 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg">
            <span className="flex items-center gap-2">
              {selected?.imageUrl && (
                <img
                  src={selected.imageUrl}
                  className="h-8 w-8 object-contain"
                />
              )}
              <span>
                {selected?.label || (
                  <span className="text-gray-400">{placeholder}</span>
                )}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-6 w-6 text-gray-400" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((opt) => (
                <Listbox.Option
                  key={opt.value}
                  value={opt.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-3 pr-10 ${
                      active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center gap-2">
                      {opt.imageUrl && (
                        <img
                          src={opt.imageUrl}
                          alt=""
                          className="h-5 w-5 object-cover rounded-full"
                        />
                      )}
                      <span
                        className={`${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {opt.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 right-3 flex items-center text-indigo-600">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      ) : null}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
