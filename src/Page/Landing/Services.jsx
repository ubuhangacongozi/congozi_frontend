import React from "react";
import { CgAlbum } from "react-icons/cg";
import Service1 from "../../assets/service1.jpg";
import Service2 from "../../assets/service2.jpg";
import Service3 from "../../assets/service3.jpg";
const Services = () => {
  return (
    <div className="pt-20 px-4">
      <div className="flex flex-col justify-center items-center border border-blue-500 rounded-md px-10 pt-4">
        <div className="flex justify-center items-center gap-4 bg-Total md:w-[30%] py-1 px-5 rounded-full">
          <CgAlbum className="text-white text-xl" />
          <p
            className="fle justify-center items-center text-center text-white uppercase
        md:text-xl font-semibold"
          >
            Serivisi zacu
          </p>
        </div>
        <div className="flex md:flex-row flex-col justify-center items-center pt-2 gap-8">
          <div className="flex justify-center items-center flex-col gap-2">
            <img src={Service1} alt="" className="md:h-[40vh] rounded-md" />
            <p className="text-sm text-blue-500 text-start pl-10 uppercase">
              muri congozi driving school tukwigisha aho waba uri hose kw' isi
            </p>
          </div>
          <div className="flex justify-center items-center flex-col gap-2">
            <img src={Service2} alt="" className="md:h-[40vh] rounded-md" />
            <p className="text-sm text-blue-500 text-start pl-0 uppercase">
              dutanga amasomo mu buryo bw' imbonankubone
            </p>
          </div>
          <div className="flex justify-center items-center flex-col gap-2 pb-4">
            <img src={Service3} alt="" className="md:h-[40vh] rounded-md" />
            <p className="text-sm text-blue-500 text-start pl-10 uppercase">
              dufite igukoranabuhanga ryigisha umuntu ari no muyindi mirimo
            </p>
          </div>
        </div>
        <div className=" pb-4 text-md px-10">
          <p>
            Singombwa ko uvunwa no kuza mw'ishuri, twakira n'abifuza kwiga
            hifashishijwe igukoranabuhanga ryacu kuko muri Congozi Expert
            ushobora guhitamo kwiga imbonankubone cyagwa ukifashisha uburyo
            bw'igukoranabuhanga rya Congozi Expert. Mumashuri ndetse n'amashami
            yacu yose.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
