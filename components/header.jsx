"use client";
import Link from "next/link";
import Login from "../components/login";
import Settings from "../components/settings";
import { useState } from "react";

export default function Header() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlay, setOverlay] = useState("none");

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  return (
    <header className=" flex justify-between items-center w-full">
      {isOverlayOpen && overlay !== "none" && (
        <div
          id="overlay"
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={toggleOverlay}
        >
          <div
            className=" p-4 rounded shadow"
            onClick={(e) => e.stopPropagation()}
          >
            {overlay === "Login" && <Login />}
            {overlay === "Settings" && (
              <Settings
                setIsOverlayOpen={setIsOverlayOpen}
                setOverlay={setOverlay}
              />
            )}
          </div>
        </div>
      )}

      <h1 className="text-4xl">
        <Link href="/">Pomohour</Link>
      </h1>
      <nav className="flex gap-4">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-pointer sm:hidden"
        >
          <path
            d="M3 7H21"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M3 12H21"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M3 17H21"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <Link
          href="/about"
          className="hidden  sm:block font-semibold bg-mainColor"
        >
          About us
        </Link>
        <button
          type="button"
          className="hidden sm:flex gap-1 items-center font-semibold"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
        <button
          type="button"
          className="hidden sm:flex gap-1 items-center font-semibold bg-white rounded-sm px-1"
          onClick={() => {
            setOverlay("Settings");
            setIsOverlayOpen(true);
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
              stroke="rgb(28,28,28)"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"
              stroke="rgb(28,28,28)"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>
    </header>
  );
}
