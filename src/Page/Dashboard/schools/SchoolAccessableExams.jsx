import React, { useState, useEffect } from "react";
import ExamsCard from "../../../Components/Cards/ExamsCard";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import { SlNote } from "react-icons/sl";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import SchoolAccessedExam from "./SchoolAccessedExam";
import axios from "axios";

const SchoolAccessableExams = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [examsPerPage, setExamsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [fees, setFees] = useState("");
  const [isExamAccessable, setIsExamAccessable] = useState(false);
  const [accessedExamId, setAccessedExamId] = useState(null);
  const [exam, setExam] = useState({ data: [] });

  const location = useLocation();

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const { accessCode } = queryString.parse(location.search);
  const navkwigate = useNavigate();
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${ApiUrl}/exams`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExam(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (accessCode && exam.data.length > 0) {
      const matchedExam = exam.data.find((e) => e.accessCode === accessCode);
      if (matchedExam) {
        setAccessedExamId(matchedExam._id);
        setIsExamAccessable(true);
      } else {
        setIsExamAccessable(false);
      }
    }
  }, [accessCode, exam.data]);

  useEffect(() => {
    const updateExamsPerPage = () => {
      setExamsPerPage(window.innerWidth >= 768 ? 6 : 2);
    };
    updateExamsPerPage();
    window.addEventListener("resize", updateExamsPerPage);
    return () => window.removeEventListener("resize", updateExamsPerPage);
  }, []);

  const filteredExams = exam.data.filter(
    (exam) =>
      (type === "" || exam.type.toLowerCase().includes(type.toLowerCase())) &&
      (fees === "" || exam.fees.toString().includes(fees)) &&
      (searchTerm === "" ||
        exam.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.fees.toString().includes(searchTerm) ||
        exam.number.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const currentExams = filteredExams.slice(
    currentPage * examsPerPage,
    (currentPage + 1) * examsPerPage
  );

  const handleDoExam = (exam) => {
    const id = exam._id;
    if (id) {
      navkwigate(`/schools/accessedexam?id=${id}`);
    } else {
      console.error("Nta code yo gugukora ikikizamini ufite.");
    }
  };

  if (isExamAccessable && accessedExamId) {
    return <SchoolAccessedExam id={accessedExamId} />;
  }

  return (
    <div className="flex flex-col justify-around items-center md:px-5 gap-1 bg-white md:p-2">
      <WelcomeDear />
      <div className="grid md:grid-cols-3 grid-cols-2 justify-between items-center md:gap-12 gap-1 px-3 py-4">
        <input
          type="text"
          placeholder="--ubwoko bw'ikizami--"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl"
        />
        <input
          type="text"
          placeholder="---Shaka n'igiciro---"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl"
        />
        <div className="w-full px-3 md:flex hidden">
          <input
            type="search"
            placeholder="---Ubwoko, igiciro, nimero byikizami---"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-blue-500 p-2 rounded-xl w-full"
          />
        </div>
      </div>

      <div className="w-full px-3 pb-3 flex md:hidden">
        <input
          type="search"
          placeholder="---Ubwoko, igiciro, nimero byikizami---"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl w-full"
        />
      </div>

      {filteredExams.length === 0 ? (
        <p className="text-center py-4 text-red-500">No data found</p>
      ) : (
        <div className="grid md:grid-cols-3 w-full gap-4 md:gap-3 py-1">
          {currentExams.map((exam, index) => {
            const iskwiga = exam.type.toLowerCase().includes("kwiga");
            const buttonColor = iskwiga ? "bg-yellow-500" : "bg-green-500";
            const buttonText = iskwiga
              ? "kwiga ikizamini"
              : "Gugukora ikizamini";
            return (
              <ExamsCard
                key={index}
                title={exam.title}
                number={exam.number}
                fees={exam.fees}
                type={exam.type}
                onPurchase={() => handleDoExam(exam)}
                icon={<SlNote />}
                button={buttonText}
                buttonColor={buttonColor}
              />
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-around md:gap-[700px] gap-[120px] md:pb-0 pt-3 px-10">
          <button
            className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
              currentPage === 0 ? "opacity-50" : ""
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            <FaArrowAltCircleLeft size={24} /> Ibibanza
          </button>
          <button
            className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
              currentPage === totalPages - 1 ? "opacity-50" : ""
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Ibikurikira
            <FaArrowAltCircleRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SchoolAccessableExams;
