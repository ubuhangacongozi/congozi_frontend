import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsCart } from "react-icons/bs";
import { GrSend } from "react-icons/gr";
import { LuCircleArrowLeft } from "react-icons/lu";
import { FiArrowRightCircle } from "react-icons/fi";
import DescriptionCard from "../../../Components/Cards/DescriptionCard";
import ExamTimer from "../../../Components/ExamTimer";
import LoadingSpinner from "../../../Components/LoadingSpinner ";

const LiveLearn = () => {
  const [examCode, setExamCode] = useState("");
  const [paidExam, setPaidExam] = useState(null);
  const [gukoraExam, setgukoraExam] = useState(null);
  const [examToDo, setExamToDo] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [showNoQuestionsMessage, setShowNoQuestionsMessage] = useState(false);
  const [paymentPopup, setPaymentPopup] = useState(false);
  const [interactedQuestions, setInteractedQuestions] = useState([]);
  const [isLoadingExam, setIsLoadingExam] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const token = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return "";
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code") || "";
    setExamCode(code);
  }, [location.search]);

  useEffect(() => {
    const fetchPaidExam = async () => {
      try {
        const res = await axios.get(`${ApiUrl}/purchases/access/${examCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaidExam(res.data.data.itemId);
      } catch (error) {
        console.error("Error fetching paid exam:", error);
      }
    };
    if (examCode) fetchPaidExam();
  }, [examCode, token]);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const examId = paidExam?.examId || paidExam?._id;
        if (!examId) return;
        const res = await axios.get(`${ApiUrl}/exams/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const examData = res.data.data;
        setExamToDo(examData);
        if (typeof window !== "undefined") {
          localStorage.setItem("live_exam_data", JSON.stringify(examData));
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };
    if (paidExam) fetchExamDetails();
  }, [paidExam, token]);

  useEffect(() => {
    if (examToDo && examCode) {
      const questions = examToDo.questions || [];
      setExamQuestions(questions);

      if (questions.length === 0) {
        setShowNoQuestionsMessage(true);
      }
    }
  }, [examToDo, examCode]);

  const fetchgGukoraExam = useCallback(async () => {
    try {
      const number = paidExam?.number;
      if (!number) return;

      const purchaseRes = await axios.get(`${ApiUrl}/purchases/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const purchasedExams = purchaseRes.data.data;
      const examPurchased = purchasedExams.some(
        (p) => p.accessCode === examCode
      );
      if (!examPurchased) return;

      const res = await axios.get(`${ApiUrl}/exams/gukora/${number}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const gukoraData = res.data.data;
      fetchgGukoraExam(gukoraData);
      if (typeof window !== "undefined") {
        localStorage.setItem("gukora_exam_data", JSON.stringify(gukoraData));
      }
    } catch (error) {
      console.error("Error fetching gukora exam:", error);
    }
  }, [examCode, paidExam, token]);

  const handleShowPaymentPopup = async () => {
    setIsLoadingExam(true);
    try {
      if (!paidExam) return;

      const res = await axios.get(`${ApiUrl}/exams/kora/${paidExam.number}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && res.data.data) {
        setgukoraExam(res.data.data);
        setPaymentPopup(true);
      } else {
        const errorMessage = res.data?.message;
        alert(errorMessage);
      }
    } catch (error) {
      if (error.response) {
        const backendMessage =
          error.response.data?.message || error.response.data?.error;
        alert(backendMessage);
      }
      console.error("Error fetching alternate exam:", error);
    } finally {
      setIsLoadingExam(false);
    }
  };

  const handlePayLaterClick = async () => {
    try {
      await axios.post(
        `${ApiUrl}/purchases/${gukoraExam._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentPopup(false);
      navigate("/students/exams");
    } catch (error) {
      if (error.response?.status === 404) {
        alert("You have already purchased this exam.");
      } else {
        console.error("Purchase request failed:", error);
        alert("Failed to initiate purchase. Please try again.");
      }
    }
  };

  const handleSelectQuestion = (index) => {
    setSelectedQuestion(index);
    setInteractedQuestions((prev) =>
      prev.includes(index) ? prev : [...prev, index]
    );
  };

  const currentQuestion = useMemo(
    () => examQuestions[selectedQuestion],
    [selectedQuestion, examQuestions]
  );

  const handleTimeout = useCallback(async () => {
    try {
      if (examCode) {
        await axios.delete(`${ApiUrl}/purchases/access/${examCode}`);
        navigate("/students/waitingexams", {
          replace: true,
          state: { reset: true },
        });
      }
    } catch (error) {
      console.error("Error deleting exam purchase on timeout:", error);
    }
    localStorage.removeItem(`selectedAnswers_${examCode}`);
  }, [examCode, navigate]);

  return (
    <div className="flex flex-col bg-white md:p-2 gap-2">
      {showNoQuestionsMessage ? (
        <div className="text-center mt-10 text-Total font-semibold">
          <p>Ikikizami ntabibazo gifite. Hamagara Admin</p>
          <p>
            kuri: <span className="text-orange-500">0783905790</span>
          </p>
        </div>
      ) : (
        <>
          <>
            <h1 className="md:text-xl text-center md:py-1 py-3 font-bold text-Total capitalize">
              Ibisubizo by'ukuri biri mu ibara ry'icyatsi
            </h1>
            <DescriptionCard
              questions={examQuestions.length}
              total20={examQuestions.length * 1}
              total100={examQuestions.length * 5}
              pass20={((12 / 20) * examQuestions.length).toFixed(0)}
              pass100={((60 / 20) * examQuestions.length).toFixed(0)}
              number={examToDo?.number}
              type={examToDo?.type}
              timeLeft={
                <ExamTimer
                  accessCode={examCode}
                  duration={2400}
                  onTimeout={handleTimeout}
                />
              }
              access={examCode}
            />

            <div className="flex flex-wrap justify-center py-1 md:gap-4 gap-2">
              {examQuestions.map((q, idx) => {
                const isCurrent = selectedQuestion === idx;
                const isInteracted = interactedQuestions.includes(idx);

                const getButtonClasses = () => {
                  if (isCurrent) return "bg-blue-500 text-white";

                  return isInteracted
                    ? "bg-blue-500 text-white"
                    : "bg-white border";
                };

                return (
                  <button
                    key={q._id}
                    onClick={() => handleSelectQuestion(idx)}
                    className={`w-20 h-10 text-sm rounded-md flex justify-center items-center ${getButtonClasses()}`}
                  >
                    Ikibazo: {idx + 1}
                  </button>
                );
              })}
            </div>
          </>

          <div className="w-full px-3">
            {currentQuestion ? (
              <>
                <h3 className="mb-0 md:text-md text-sm font-semibold">
                  Q{selectedQuestion + 1}. {currentQuestion.phrase}
                </h3>
                {currentQuestion.image && (
                  <img
                    src={currentQuestion.image}
                    alt="question"
                    className="w-32 h-32 rounded-md mb-1"
                  />
                )}
                <form className="space-y-1 md:text-md text-sm">
                  {currentQuestion.options.map((option, index) => {
                    const optionLabels = [
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                      "G",
                      "H",
                    ];
                    const label = optionLabels[index];
                    const isCorrect = option.isCorrect;

                    return (
                      <div key={index} className="flex items-center gap-2">
                        <label
                          htmlFor={`option-${index}`}
                          className={`cursor-pointer ${
                            isCorrect ? "text-green-600 font-semibold" : ""
                          }`}
                        >
                          <span className="capitalize">{label}:</span>{" "}
                          {option.text}
                        </label>
                      </div>
                    );
                  })}
                </form>
                <div className="md:mt-96 mt-12 mb-12 flex justify-between flex-wrap gap-2">
                  <button
                    onClick={handleShowPaymentPopup}
                    className="bg-blue-900 text-white px-4 py-1 rounded flex md:ml-0 ml-12 items-center gap-2"
                    disabled={isLoadingExam}
                  >
                    {isLoadingExam ? (
                      <>
                        <LoadingSpinner />
                      </>
                    ) : (
                      <>
                        <GrSend />
                        Isuzume Muri ikikizamini
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleSelectQuestion(Math.max(selectedQuestion - 1, 0))
                    }
                    disabled={selectedQuestion === 0}
                    className={`text-white px-4 py-1 rounded flex items-center gap-2
                     ${
                       selectedQuestion === 0
                         ? "bg-gray-500 cursor-not-allowed"
                         : "bg-blue-900"
                     }
                     `}
                  >
                    <LuCircleArrowLeft />
                    Ikibanza
                  </button>
                  <button
                    onClick={() =>
                      handleSelectQuestion(
                        Math.min(selectedQuestion + 1, examQuestions.length - 1)
                      )
                    }
                    disabled={selectedQuestion === examQuestions.length - 1}
                    className={`text-white px-4 py-1 rounded flex items-center gap-2
                      ${
                        selectedQuestion === examQuestions.length - 1
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-blue-900"
                      }
  `}
                  >
                    <FiArrowRightCircle /> Igikurikira
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </>
      )}

      {paymentPopup && gukoraExam && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-Total p-4 rounded-lg md:w-1/2 h-1/2 flex justify-center items-center w-full relative">
            <button
              className="absolute top-1 bg-white w-10 h-10 rounded-full right-2 text-red-500 text-xl"
              onClick={() => setPaymentPopup(false)}
            >
              ✖
            </button>

            <div className="md:w-1/2 w-full md:px-0 px-3">
              <div className="flex w-full flex-col bg-gray-300 rounded-lg">
                <div className="flex flex-col justify-center items-center gap-1 py-5">
                  <h1 className="text-xl pt-1 text-Total font-bold">
                    {gukoraExam.title}: {gukoraExam.number}
                  </h1>
                  <div className="flex flex-col justify-center items-start">
                    <p className="text-Total">
                      Igiciro:{" "}
                      <span className="font-bold">{gukoraExam.fees} Rwf</span>
                    </p>
                    <p className="text-Total">Ubwoko: {gukoraExam.type}</p>
                  </div>
                </div>
                <div className="pt-1">
                  <button
                    className="flex items-center justify-center gap-4 text-lg py-1 px-4 rounded-md w-full text-white bg-yellow-500"
                    onClick={handlePayLaterClick}
                  >
                    <BsCart /> Saba Kwishyura
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveLearn;
