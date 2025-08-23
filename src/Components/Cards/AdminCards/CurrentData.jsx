import React from "react";

const CurrentData = ({
  textColor,
  title,
  value,
  indicator,
  icon,
  percentage,
  time,
  onClick
}) => {
  return (
    <>
      <div className="flex gap-4 flex-col md:w-[280px] w-full hover:bg-black/10 bg-white rounded-md shadow-md p-2"
      onClick={onClick}
      >
        <div className="flex justify-between p-2">
          <div className="flex justify-start items-start gap-1 flex-col">
            <p className="text-gray-500 text-base">{title}</p>
            <h1 className="text-blue-900 text-xl font-bold">{value}</h1>
          </div>
          <div className="flex justify-center items-center w-10 h-10  bg-gray-200 rounded-full p-2">
            <p className="text-blue-900">
              {icon}
            </p>
          </div>
        </div>
        <div className="flex justify-start items-center gap-2 px-2">
          <p className={`${textColor}`}>{indicator}</p>
          <p className={`${textColor} font-semibold`}>{percentage}</p>
          <p className="text-gray-500">{time}</p>
        </div>
      </div>
    </>
  );
};

export default CurrentData;
