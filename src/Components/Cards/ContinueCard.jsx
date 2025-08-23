import React, { useState } from "react";
import Police from "../../assets/Policelogo.png";

const ContinueCard = ({ code, onClick, onChange, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="relative flex flex-col justify-center items-center gap-10 bg-Total md:w-1/2 md:ml-72 p-8 rounded-xl shadow-lg">
        <button
          className="absolute md:top-1 md:right-1 right-5  top-2 text-xl bg-white text-red-700 border-2 border-white rounded-full w-8 h-8 flex justify-center items-center"
          onClick={onClose}
        >
          ✖
        </button>
        <img src={Police} alt="" className="w-24" />
        <div className="flex flex-col gap-5 justify-center items-center">
          <input
            type="text"
            name="code"
            id="code"
            value={code}
            onChange={onChange}
            className="w-full px-4 py-1 border rounded-full text-center"
          />
          <div className="flex justify-around gap-5 pb-4">
            <button
              className="flex justify-center items-center text-Total font-semibold bg-white rounded-full py-1 px-6"
              onClick={onClick}
            >
              Submit
            </button>
            <button
              className="flex justify-center items-center text-Total font-semibold bg-white rounded-full py-1 px-6"
              onClick={onClick}
            >
              Entry
            </button>
            <button
              className="flex justify-center items-center text-Total font-semibold bg-white rounded-full py-1 px-6"
              onClick={onClick}
            >
              Komeza
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueCard;
