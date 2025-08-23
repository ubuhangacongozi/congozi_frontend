import React, { useState, useEffect } from "react";
import StHomeCard from "../../../Components/Cards/StHomeCard";
import Image from "../../../assets/Studeh.png";
import { Link } from "react-router-dom";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import axios from "axios";

const StudentHome = () => {
  const [unpaidExams, setUnpaidExams] = useState([]);
  const [totalExams, setTotalExams] = useState([]);
  const [expiredExams, setExpiredExams] = useState([]);
  const [waitingExams, setWaitingExams] = useState([]);
  const [passedExams, setPassedExams] = useState([]);
  const [failedExams, setFailedExams] = useState([]);

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAllExams = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [
          unpaidRes,
          totalRes,
          expiredRes,
          waitingRes,
          passedRes,
          failedRes,
        ] = await Promise.all([
          axios.get(`${ApiUrl}/unpaidexams`, config),
          axios.get(`${ApiUrl}/totaluserexams`, config),
          axios.get(`${ApiUrl}/expiredexams`, config),
          axios.get(`${ApiUrl}/waittingexams`, config),
          axios.get(`${ApiUrl}/passedexams`, config),
          axios.get(`${ApiUrl}/failledexams`, config),
        ]);

        setUnpaidExams(unpaidRes.data?.data || []);
        setTotalExams(totalRes.data?.data || []);
        setExpiredExams(expiredRes.data?.data || []);
        setWaitingExams(waitingRes.data?.data || []);
        setPassedExams(passedRes.data?.data || []);
        setFailedExams(failedRes.data?.data || []);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    fetchAllExams();
  }, []);

  return (
    <div className="flex flex-col justify-center items-start md:px-5 gap-2 bg-white md:p-2">
      <WelcomeDear />
      <div className="grid md:grid-cols-3 grid-cols-1 w-full md:px-0 px-12 gap-12 md:pt-2 py-5 md:gap-12">
        <StHomeCard
          bgColor="bg-blue-900"
          title="Ibizamini Byose"
          count={totalExams.length}
        />
        <StHomeCard
          bgColor="bg-red-700"
          title="Ibizamini Byarangiye"
          count={expiredExams.length}
        />

        <Link to="/students/unpaidexams" className="block w-full">
          <StHomeCard
            bgColor="bg-yellow-700"
            title="Ibizamini Bitishyuwe"
            count={unpaidExams.length}
          />
        </Link>

        <Link to="/students/waitingexams" className="block w-full">
          <StHomeCard
            bgColor="bg-blue-700"
            title="Ibizamini Bitarakorwa"
            count={waitingExams.length}
          />
        </Link>

        <StHomeCard
          bgColor="bg-green-700"
          title="Ibizamini Watsinze"
          count={passedExams.length}
        />
        <StHomeCard
          bgColor="bg-orange-600"
          title="Ibizamini Watsinzwe"
          count={failedExams.length}
        />
      </div>
      <img src={Image} alt="" className="w-[140px] md:ml-[400px] ml-28" />
    </div>
  );
};

export default StudentHome;
