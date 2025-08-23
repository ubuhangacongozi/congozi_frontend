import React from "react";
import { LuPhoneCall } from "react-icons/lu";
import { MdEmail } from "react-icons/md";
import { HiHome } from "react-icons/hi2";
import Tuvugishe from "../../assets/tuvugishe.jpg";
const ContactUs = () => {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 md:py-20 py-12">
      <div className="flex justify-end  md:h-[60vh] ">
        <img src={Tuvugishe} alt="" />
      </div>
      <div className="flex flex-col justify-center items-center gap-10 pl-2 p-10 border-l border-blue-500">
        <p className="md:text-md px-6 font-semibold text-blue-500">
          Mugihe mukeneye ubufasha mushobora kutuvugisha <br /> mukoresheje
          aderesi zacu.
        </p>
        <div className="flex flex-col justify-center items-start gap-3">
          <div className="flex justify-center items-start gap-4">
            <LuPhoneCall className="text-blue-500 text-2xl" />
            <p className="md:text-md">+250 783 905 790 | 0722 558 842</p>
          </div>
          <div className="flex justify-center items-start gap-4">
            <MdEmail className="text-blue-500 text-2xl" />
            <p className="md:text-md">info@congozi.rw</p>
          </div>
          <div className="flex justify-center items-start gap-4">
            <HiHome className="text-blue-500 text-2xl" />
            <p className="md:text-md">Iburasirazuba, Nyagatare | Rwamagana</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
