import React from "react";

function login() {
  return (
    <div className="w-11/12 max-w-lg p-4 bg-white rounded-lg text-black">
      <h2 className="font-bold text-3xl text-center">Login</h2>
      <label htmlFor="" className="ml-2">
        Email
      </label>
      <br />
      <input
        type="text"
        name=""
        id=""
        className="px-2 py-4 rounded-lg border-black border-2 border-opacity-40 w-full"
        placeholder="Enter email"
      />
      <span className="w-full text-center inline-block my-4 font-semibold text-lg">
        Or connect with
      </span>
      <button
        type="button"
        className="border-2 w-full py-4 rounded-lg border-opacity-80 font-semibold"
        style={{ borderColor: "#EA4335", borderWidth: "4px", color: "#EA4335" }}
      >
        Sing in with
        <span className="font-semibold ml-1">
          <span className="text-[#34A853]">G</span>
          <span className="text-[#4285F4]">o</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#FBBC05]">e</span>
        </span>
      </button>
    </div>
  );
}

export default login;
