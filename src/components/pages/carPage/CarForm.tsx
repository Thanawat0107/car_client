'use client';

import { useState } from "react";
import { EngineType, CarType, Status, GearType } from "@/types/dto/Enum";
import { Car } from "@/types/dto/Car";

type CarFormProps = {
  onSubmit: (data: FormData) => void;
  initialData?: Car;
};

export default function CarForm({ onSubmit, initialData }: CarFormProps) {
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    brandId: initialData?.brandId ?? 1,
    sellerId: initialData?.sellerId ?? 1,
    model: initialData?.model ?? "",
    year: initialData?.year ?? "",
    price: initialData?.price ?? 0,
    mileage: initialData?.mileage ?? 0,
    color: initialData?.color ?? "",
    engineType: initialData?.engineType,
    gearType: initialData?.gearType,
    carType: initialData?.carType,
    description: initialData?.description ?? "",
    status: initialData?.status,
    isUsed: initialData?.isUsed ?? false,
    isDelete: initialData?.isDeleted ?? false,
     imageUrl: initialData?.imageUrl ?? "",
  });


const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value, type } = e.target;

  const newValue =
    type === "checkbox" && e.target instanceof HTMLInputElement
      ? e.target.checked
      : value;

  setForm({
    ...form,
    [name]: newValue,
  });
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setForm({ ...form, imageUrl: "" }); // ล้าง URL ถ้าอัปโหลดไฟล์
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const url = e.target.value;
  setImageUrl(url);
  setPreviewUrl(url);
  setFile(null); // ล้างไฟล์ถ้าใส่ URL
  setForm({ ...form, imageUrl: url });
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
   Object.entries(form).forEach(([key, value]) => {
     if (value !== undefined && value !== null) {
       data.append(key, value.toString());
     }
   });
     if (file) {
    data.append("image", file); // ใช้ไฟล์เป็นหลัก
  } else if (form.imageUrl) {
    data.append("imageUrl", form.imageUrl); // ถ้าไม่มีไฟล์ ให้ใช้ URL
  }
    onSubmit(data);
  };

  const enumOptions = (e: object) =>
    Object.entries(e)
      .filter(([key]) => isNaN(Number(key)))
      .map(([key, value]) => (
        <option key={value} value={value}>
          {key}
        </option>
      ));

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {initialData ? "Edit Car" : "Add Car"}
      </h2>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Model</label>
        <input
          name="model"
          value={form.model}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Year</label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Mileage
          </label>
          <input
            type="number"
            name="mileage"
            value={form.mileage}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Color</label>
          <input
            name="color"
            value={form.color}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Engine Type
          </label>
          <select
            name="engineType"
            value={form.engineType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          >
            {enumOptions(EngineType)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Gear Type
          </label>
          <select
            name="gearType"
            value={form.gearType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          >
            <option value="">Select Gear Type</option>
            {enumOptions(GearType)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Car Type
          </label>
          <select
            name="carType"
            value={form.carType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          >
            {enumOptions(CarType)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          >
            <option value="">Select Status</option>
            {enumOptions(Status)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isUsed"
          checked={form.isUsed}
          onChange={handleChange}
          className="w-4 h-4"
        />
        <label className="text-gray-700 font-medium">Is Used?</label>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Or Image URL
        </label>
        <input
          type="url"
          name="imageUrl"
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder="https://example.com/image.jpg"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="mt-2 rounded shadow-md w-40"
        />
      )}

      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
}