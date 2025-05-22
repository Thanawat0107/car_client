import { PaginationMeta } from '@/@types/Responsts/PaginationMeta';
import React from 'react'

interface Props {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: Props) {
    const { pageNumber, pageCount } = pagination;

      if (pageCount <= 1) return null;

  return (
  <div className="flex gap-2 mt-4 justify-center flex-wrap">
      <button
        className="btn btn-sm join-item"
        disabled={pageNumber === 1}
        onClick={() => onPageChange(pageNumber - 1)}
      >
        ก่อนหน้า
      </button>

      {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`btn btn-sm join-item ${
            page === pageNumber ? "btn-primary" : "btn-outline"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        className="btn btn-sm join-item"
        disabled={pageNumber === pageCount}
        onClick={() => onPageChange(pageNumber + 1)}
      >
        ถัดไป
      </button>
    </div>
  );
}
