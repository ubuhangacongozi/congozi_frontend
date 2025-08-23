import React from "react";

const DescriptionCard = ({access,questions,total20,total100,pass20,pass100,number,type,timeLeft}) => {
  return (
    <div className="text-blue-900 bg-green-500 p-1 rounded-md">
      <div className="flex flex-wrap justify-center gap-2 w-full py-1 md:px-12 px-2">
        <p>Kode y'ikizami: {access}</p>
      </div>
      <div className="grid md:grid-cols-4 grid-cols-2 gap-2 w-full py-0 md:px-12 px-0">
        <p>Ibibazo Byose: {questions}</p>
        <p>Amanota Yose:{total20}/20</p>
        <p>Amanota Yose: {total100}/100</p>
        <p className="hidden">Gutsinda Ni: {pass20}/20</p>
        <p className="hidden">Gutsinda Ni: {pass100}/100 </p>
        <p>Nomero y'ikizami: {number}</p>
        <p>Ubwoko bw'ikizami: {type}</p>
        <div className="flex flex-row ">
          Iminota:{" "}
          <span className="bg-white px-1 w-12 h-6 rounded-full text-blue-900 font-extrabold">
            {timeLeft}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DescriptionCard;
