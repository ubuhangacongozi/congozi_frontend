import React from "react";
import { FaUser } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FiSend } from "react-icons/fi";
import LoginInputs from "../../Components/Inputs/Studentnputs/LoginInputs";
import Injira from "../../assets/Injira.png";

const RestPassword = () => {
  return (
    <div className="pt-24 md:px-12">
      <div className="grid md:grid-cols-2 grid-cols-1 rounded-r-md rounded-b-none md:border border-blue-700">
        <div className="flex justify-end md:h-[60vh]">
          <img src={Injira} alt="" />
        </div>
        <div className="flex flex-col items-center gap-3 md:py-0 py-20 md:border-l border-blue-700">
          <div className="flex justify-center items-center gap-2 w-full bg-blue-700 md:rounded-l-none rounded-md py-3">
            <FaRegEdit className="md:text-2xl text-3xl text-white" />
            <p className="text-white text-xl font-semibold">
              Guhindura Ijambobanga
            </p>
          </div>
          <p className=" text-lg md:px-20 p-2">
            Andika nomero ya telefone ukoresha cyangwa imeri yawe maze wemeze
            kohererezwa ijambobanga rishya!
          </p>
          <div className="flex flex-col items-start gap-4 md:w-[70%] w-full">
            <LoginInputs
              label="Telefone cg Email"
              type="text"
              icon={<FaUser />}
              placeholder="07XXX cg Email"
            />

            <div className="flex flex-col justify-center items-center w-full">
              <p className="text-center">Uburyo bwo kubona ubutumwa</p>
              <div className="flex justify-between items-center gap-6 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="messageType"
                    value="SMS"
                    className="w-5 h-5 rounded-full accent-blue-600"
                  />
                  SMS
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="messageType"
                    value="Email"
                    className="w-5 h-5 rounded-full accent-blue-600"
                  />
                  Email
                </label>
              </div>
            </div>
          </div>

          <button className="flex justify-center items-center text-2xl py-1 px-6 gap-5 bg-Unpaid rounded-md hover:bg-yellow-600">
            <FiSend className="text-blue-800 text-xl" />
            Emeza Gusaba
          </button>

          <div className="md:flex-row flex-col flex justify-center items-center md:gap-10 gap-4">
            <Link to={"/kwinjira"}>
              <p className="flex justify-center items-center gap-2 text-blue-500 text-md">
                <RiLogoutCircleLine /> Garuka kwinjira
              </p>
            </Link>
            <p className="flex justify-center items-center gap-2 text-blue-500 text-md">
              Nta konti ufite?
              <Link
                to={"/kwiyandikisha"}
                className="text-xl text-blue-800 font-semibold"
              >
                Yifungure
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestPassword;
