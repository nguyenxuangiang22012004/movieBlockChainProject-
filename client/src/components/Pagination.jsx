import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  // Tạo danh sách các trang hiển thị (tối đa 5 trang liền nhau)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="col-12">
      {/* Paginator desktop */}
      <ul className="paginator">
        <li
          className={`paginator__item paginator__item--prev ${
            currentPage === 1 ? "disabled" : ""
          }`}
        >
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="ti ti-chevron-left"></i>
          </button>
        </li>

        {getPageNumbers().map((page) => (
          <li
            key={page}
            className={`paginator__item ${
              page === currentPage ? "paginator__item--active" : ""
            }`}
          >
            <button onClick={() => onPageChange(page)}>{page}</button>
          </li>
        ))}

        <li
          className={`paginator__item paginator__item--next ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="ti ti-chevron-right"></i>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Pagination;
