"use client";
import React, { useState, useEffect } from "react";

export default function Pagination({ 
  totalPages, 
  currentPage: controlledCurrentPage,
  onPageChange 
}) {
  // Ensure totalPages is a valid number, default to 1 if not provided
  const validTotalPages = totalPages && typeof totalPages === 'number' && totalPages > 0 
    ? totalPages 
    : 1;
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  
  // Use controlled page if provided, otherwise use internal state
  const isControlled = controlledCurrentPage !== undefined && onPageChange !== undefined;
  const currentPage = isControlled ? controlledCurrentPage : internalCurrentPage;

  useEffect(() => {
    if (isControlled && controlledCurrentPage !== undefined) {
      // Sync internal state with controlled prop
      setInternalCurrentPage(controlledCurrentPage);
    }
  }, [controlledCurrentPage, isControlled]);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= validTotalPages) {
      if (isControlled) {
        onPageChange(page);
      } else {
        setInternalCurrentPage(page);
      }
    }
  };

  const renderPageNumbers = () => {
    return Array.from({ length: validTotalPages }, (_, index) => {
      const page = index + 1;
      return (
        <li
          key={page}
          className={page === currentPage ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            handlePageClick(page);
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="pagination-item text-button">{page}</div>
        </li>
      );
    });
  };

  return (
    <>
      <li 
        onClick={(e) => {
          e.preventDefault();
          if (currentPage > 1) {
            handlePageClick(currentPage - 1);
          }
        }}
        style={{ cursor: currentPage > 1 ? 'pointer' : 'not-allowed' }}
      >
        <a
          className={`pagination-item text-button ${
            currentPage === 1 ? "disabled" : ""
          }`}
          style={{ cursor: currentPage > 1 ? 'pointer' : 'not-allowed' }}
        >
          <i className="icon-arrLeft" />
        </a>
      </li>
      {renderPageNumbers()}
      <li 
        onClick={(e) => {
          e.preventDefault();
          if (currentPage < validTotalPages) {
            handlePageClick(currentPage + 1);
          }
        }}
        style={{ cursor: currentPage < validTotalPages ? 'pointer' : 'not-allowed' }}
      >
        <a
          className={`pagination-item text-button ${
            currentPage === validTotalPages ? "disabled" : ""
          }`}
          style={{ cursor: currentPage < validTotalPages ? 'pointer' : 'not-allowed' }}
        >
          <i className="icon-arrRight" />
        </a>
      </li>
    </>
  );
}
