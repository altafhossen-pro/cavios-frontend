import React from "react";
import Image from "next/image";
export default function Description({ product }) {
  // Get description from product, fallback to default if not available
  const description = product?.description || product?.shortDescription || '';
  const longDescription = product?.longDescription || '';
  
  return (
    <>
      {" "}
      <div className="right">
        {product?.category?.name && (
          <div className="letter-1 text-btn-uppercase mb_12">
            {product.category.name}
          </div>
        )}
        {description && (
          <p className="mb_12 text-secondary">
            {description}
          </p>
        )}
        {longDescription && (
          <p className="text-secondary">
            {longDescription}
          </p>
        )}
        {!description && !longDescription && (
          <p className="text-secondary">
            No description available for this product.
          </p>
        )}
      </div>
      <div className="left">
        <div className="letter-1 text-btn-uppercase mb_12">
          COMPOSITION, ORIGIN AND CARE GUIDELINES
        </div>
        {product?.specifications && product.specifications.length > 0 ? (
          <ul className="list-text type-disc mb_12 gap-6">
            {product.specifications.map((spec, index) => (
              <li key={index} className="font-2">
                {spec}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="list-text type-disc mb_12 gap-6">
            <li className="font-2">
              Product specifications will be updated soon.
            </li>
          </ul>
        )}
        
      </div>
    </>
  );
}
