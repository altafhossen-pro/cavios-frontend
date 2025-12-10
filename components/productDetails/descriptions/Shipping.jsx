import React from "react";

export default function Shipping() {
  return (
    <>
      {" "}
      <div className="w-100">
        <div className="text-btn-uppercase mb_12">Delivery Information</div>
        <p className="mb_12">
          We deliver all over Bangladesh using our trusted courier partner Parcel. 
          Your order will be processed and shipped within 1-2 business days after confirmation.
        </p>
        <p className="mb_12">
          Delivery times may vary depending on your location and the courier service:
        </p>
        <ul className="list-text type-disc mb_12 gap-6">
          <li className="font-2">
            <strong>Inside Dhaka:</strong> Usually delivered within 1 day after dispatch
          </li>
          <li className="font-2">
            <strong>Outside Dhaka:</strong> Minimum 2 days, typically 3-5 days after dispatch
          </li>
          <li className="font-2">
            <strong>Remote Areas:</strong> May take up to 7 days depending on courier availability
          </li>
        </ul>
        <p className="mb_12">
          Please note that delivery times are estimates and may vary based on:
        </p>
        <ul className="list-text type-disc mb_12 gap-6">
          <li className="font-2">Order processing time</li>
          <li className="font-2">Courier service availability in your area</li>
          <li className="font-2">Weather conditions and public holidays</li>
          <li className="font-2">Exact delivery location</li>
        </ul>
        <p className="">
          We recommend providing a contact number for faster delivery coordination. 
          Our courier partner will attempt delivery during business hours.
        </p>
      </div>
      <div className="w-100">
        <div className="text-btn-uppercase mb_12">
          Shipping Charges
        </div>
        <p className="mb_12">
          Shipping charges are calculated based on your delivery location and will be 
          displayed at checkout. Free shipping may be available for orders above a certain amount.
        </p>
      </div>
      <div className="w-100">
        <div className="text-btn-uppercase mb_12">Need more information?</div>
        <div>
          <a
            href="#"
            className="link text-secondary text-decoration-underline mb_6 font-2"
          >
            Contact Us
          </a>
        </div>
        <div>
          <a
            href="#"
            className="link text-secondary text-decoration-underline font-2"
          >
            Track Your Order
          </a>
        </div>
      </div>
    </>
  );
}
