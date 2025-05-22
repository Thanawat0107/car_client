'use client';

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppHookState";
import { useGetCarAllQuery } from "@/services/carApi";
import { setCars } from "@/stores/slices/carSlice";
import CarCard from "./CarCard";

export default function CarPage() {
  const dispatch = useAppDispatch();
  const { data: result, error, isLoading } = useGetCarAllQuery(null);
  const cars = useAppSelector((state) => state.car.cars);

  useEffect(() => {
    if (result && !error) {
      dispatch(setCars(result.result));
    }
  }, [result, error, dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <div>เกิดข้อผิดพลาดในการโหลดข้อมูล</div>;

  return (
    <div className="bg-[var(--foreground)] py-8 px-20">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        รถแนะนำสำหรับคุณ
      </h1>
      <p className="text-white text-center mb-4">
        ห้ามพลาด! ดีลเด็ดซื้อขายรถยนต์มือสองรุ่นยอดนิยม Special Deal ราคาพิเศษ
      </p>
      <div className="flex flex-nowrap gap-6 overflow-x-auto scrollbar-hide px-4">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}
