"use server";
import React from "react";

function SignIn() {
  return (
    <form
      action={async () => {
        await signIn("google");
      }}
    >
      <button
        type="submit"
        className={`sm:flex gap-1 items-center font-semibold ${
          isOverlayOpen && overlay === "MobileMenu"
            ? "flex text-center justify-center -order-1 mt-4"
            : "hidden"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${
            isOverlayOpen && overlay === "MobileMenu" ? "hidden" : ""
          }`}
        >
          <path
            d="M8.10671 7.24659C8.04004 7.23992 7.96004 7.23992 7.88671 7.24659C6.30004 7.19325 5.04004 5.89325 5.04004 4.29325C5.04004 2.65992 6.36004 1.33325 8.00004 1.33325C9.63337 1.33325 10.96 2.65992 10.96 4.29325C10.9534 5.89325 9.69337 7.19325 8.10671 7.24659Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.77335 9.70675C3.16002 10.7867 3.16002 12.5467 4.77335 13.6201C6.60669 14.8467 9.61335 14.8467 11.4467 13.6201C13.06 12.5401 13.06 10.7801 11.4467 9.70675C9.62002 8.48675 6.61335 8.48675 4.77335 9.70675Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Login
      </button>
    </form>
  );
}

export default SignIn;
