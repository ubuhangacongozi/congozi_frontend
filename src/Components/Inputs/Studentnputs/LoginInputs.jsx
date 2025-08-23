import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginInputs = ({ label, type, placeholder, value, onChange, icon }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-3 w-full md:pl-4 px-4">
      <div className="flex gap-2 justify-start items-center">
        <div className="flex justify-center items-center p-1 bg-blue-500 rounded-full">
          <span className="text-white">{icon}</span>
        </div>
        <label className="text-gray-700 font-medium">{label}:</label>
      </div>
      <div className="relative w-full">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full py-1 px-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginInputs;
