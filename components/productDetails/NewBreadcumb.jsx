"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NewBreadcumb({ product }) {
  const pathname = usePathname();
  return (
    <div className="tf-breadcrumb">
      <div className="container">
        <div className="tf-breadcrumb-wrap">
          <div className="tf-breadcrumb-list">
            <Link href={`/`} className="text text-caption-1">
              Homepage
            </Link>

            <i className="icon icon-arrRight" />
            <span className="text text-caption-1">{product?.title || 'Product'}</span>
          </div>
          <div className="tf-breadcrumb-prev-next">
            <a href="#" className="tf-breadcrumb-back">
              <i className="icon icon-squares-four" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

