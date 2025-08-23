import React from "react";

const AccountCard = ({
  number,
  fees,
  title,
  onPurchase,
  button,
  icon,
  validIn,
  buttonColor = "bg-yellow-500",
}) => {
  return (
    <div className="w-full md:px-0 px-3">
      <div className="flex w-full flex-col bg-gray-300 rounded-lg">
        <div className="flex flex-col justify-center items-center gap-1">
          <h1 className="text-xl pt-1 text-Total font-bold">
            {title}: {number}
          </h1>
          <div className="flex flex-col justify-center items-start">
            <p className="text-Total">
              Igiciro: <span className="font-bold">{fees} Rwf</span>
            </p>
            <p className="text-Total">Iminsi: {validIn}</p>
          </div>
        </div>
        <div className="pt-1">
          <button
            className={`flex items-center justify-center gap-4 text-lg py-1 px-4 rounded-md w-full text-white ${buttonColor}`}
            onClick={onPurchase}
          >
            {icon} {button}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
