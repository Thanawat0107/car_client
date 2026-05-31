/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { CalendarClock, CarFront, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { StatusTestDrive } from "@/@types/Status";
import { useAppSelector } from "@/hooks/useAppHookState";
import {
  useDeleteTestDriveMutation,
  useGetTestDriveAllQuery,
  useUpdateTestDriveMutation,
} from "@/services/testDriveApi";
import { baseUrl } from "@/utility/SD";
import Pagination from "../pagination/Pagination";

const MySwal = withReactContent(Swal);
const PAGE_SIZE = 8;

const statusConfig: Record<string, { label: string; className: string }> = {
  [StatusTestDrive.Pending]: {
    label: "รอดำเนินการ",
    className: "badge-warning",
  },
  [StatusTestDrive.Confirmed]: {
    label: "ยืนยันแล้ว",
    className: "badge-success text-white",
  },
  [StatusTestDrive.Cancel]: {
    label: "ยกเลิก",
    className: "badge-error text-white",
  },
};

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toDateTimeLocalValue = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function MyTestDrivesPage() {
  const { userId } = useAppSelector((state) => state.auth);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetTestDriveAllQuery(
    { userId, pageNumber: 1, pageSize: 1000 },
    { skip: !userId }
  );
  const [deleteTestDrive] = useDeleteTestDriveMutation();
  const [updateTestDrive] = useUpdateTestDriveMutation();

  const allTestDrives = data?.result ?? [];

  const pagedTestDrives = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allTestDrives.slice(start, start + PAGE_SIZE);
  }, [allTestDrives, page]);

  const paginationMeta = {
    totalCount: allTestDrives.length,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    pageCount: Math.ceil(allTestDrives.length / PAGE_SIZE),
  };

  const handleDelete = async (id: number) => {
    const result = await MySwal.fire({
      title: "ลบรายการทดลองขับ?",
      text: "คุณต้องการลบรายการนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await deleteTestDrive(id).unwrap();
        await MySwal.fire("สำเร็จ", "ลบรายการทดลองขับแล้ว", "success");
      } catch {
        await MySwal.fire("ผิดพลาด", "ไม่สามารถลบรายการได้", "error");
      }
    }
  };

  const handleReschedule = async (id: number, currentDate: string) => {
    const result = await MySwal.fire({
      title: "เลื่อนวันนัดทดลองขับ",
      input: "datetime-local",
      inputValue: toDateTimeLocalValue(currentDate),
      inputAttributes: {
        min: toDateTimeLocalValue(new Date().toISOString()),
      },
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      preConfirm: (value) => {
        if (!value) {
          MySwal.showValidationMessage("กรุณาเลือกวันและเวลา");
          return;
        }

        const selectedDate = new Date(value);
        if (selectedDate.getTime() <= Date.now()) {
          MySwal.showValidationMessage("วันนัดหมายต้องเป็นเวลาในอนาคต");
          return;
        }

        return value;
      },
    });

    if (!result.isConfirmed || !result.value) return;

    try {
      await updateTestDrive({
        testDriveId: id,
        data: { appointmentDate: new Date(result.value).toISOString() },
      }).unwrap();
      await MySwal.fire("สำเร็จ", "อัปเดตวันนัดหมายเรียบร้อยแล้ว", "success");
    } catch {
      await MySwal.fire("ผิดพลาด", "ไม่สามารถอัปเดตวันนัดหมายได้", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 font-bold text-xl">
        เกิดข้อผิดพลาดในการโหลดข้อมูล
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">ทดลองขับของฉัน</h1>
        <p className="text-gray-500 text-sm mt-1">
          รายการนัดหมายทดลองขับทั้งหมด ({allTestDrives.length} รายการ)
        </p>
      </div>

      {allTestDrives.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-gray-400 gap-4">
          <CarFront size={64} strokeWidth={1} />
          <p className="text-lg font-medium">ยังไม่มีรายการทดลองขับ</p>
          <p className="text-sm">เมื่อคุณนัดหมายทดลองขับ รายการจะแสดงที่หน้านี้</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pagedTestDrives.map((item) => {
              const status =
                statusConfig[item.statusTestDrive] ?? {
                  label: item.statusTestDrive,
                  className: "badge-ghost",
                };
              const mainImage =
                item.car?.carImages?.length
                  ? baseUrl + item.car.carImages[0]
                  : "/placeholder.png";
              const canDelete =
                item.statusTestDrive === StatusTestDrive.Pending ||
                item.statusTestDrive === StatusTestDrive.Cancel;
              const canReschedule = item.statusTestDrive !== StatusTestDrive.Cancel;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={mainImage}
                      alt={item.car?.model ?? "รถยนต์"}
                      className="w-full h-44 object-cover bg-gray-100"
                    />
                    <span
                      className={`badge ${status.className} absolute top-3 right-3 font-semibold text-xs px-3 py-1`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-grow gap-3">
                    <div>
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                        {item.car?.brand?.name ?? "-"}
                      </p>
                      <h2 className="text-lg font-bold text-gray-800 leading-tight mt-0.5">
                        {item.car?.model ?? "ไม่ระบุรุ่น"}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">
                        ทะเบียน: {item.car?.carRegistrationNumber ?? "-"}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarClock size={14} className="text-primary shrink-0" />
                        <span>
                          วันนัดหมาย:{" "}
                          <span className="font-medium">
                            {formatDateTime(item.appointmentDate)}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarClock size={14} className="text-orange-400 shrink-0" />
                        <span>
                          สร้างรายการเมื่อ:{" "}
                          <span className="font-medium">
                            {formatDateTime(item.createdAt)}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 mt-auto border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400">ผู้ติดต่อ</p>
                        <p className="text-gray-700 text-sm font-semibold">
                          {item.user?.fullName ?? "-"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {canReschedule && (
                          <button
                            onClick={() => handleReschedule(item.id, item.appointmentDate)}
                            className="btn btn-sm btn-warning btn-outline gap-1"
                          >
                            <Pencil size={14} />
                            เลื่อนนัด
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-sm btn-error btn-outline gap-1"
                          >
                            <Trash2 size={14} />
                            ลบ
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            pagination={paginationMeta}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </div>
  );
}
