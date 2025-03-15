"use client";
import React, { useState } from "react";

function Accordion({
  title = "Title",
  description = "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className ? `${className}` : ""}>
      <button
        className="w-full flex justify-between"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <h3 className="font-bold text-left">{title}</h3>
        <span>
          <svg
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${
              isOpen ? "rotate-180 ease-in-out transition-all duration-300" : ""
            }`}
          >
            <path
              d="M14.9401 7.21252L10.0501 12.1025C9.47256 12.68 8.52756 12.68 7.95006 12.1025L3.06006 7.21252"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        className={` grid overflow-hidden ease-in-out transition-all duration-300 ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-2"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <p className="overflow-hidden font-light">{description}</p>
      </div>
    </div>
  );
}

export default Accordion;
