import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Police from "../../../assets/Policelogo.png";
import { GrSend } from "react-icons/gr";
import { LuCircleArrowLeft } from "react-icons/lu";
import { FiArrowRightCircle } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa6";
import DescriptionCard from "../../../Components/Cards/DescriptionCard";
import { ToastContainer, toast } from "react-toastify";
import Timer from "../../../Components/ExamTimerLive";

const SchoolLiveExam = () => {
  const [examId, setExamId] = useState("");
  const [examToDo, setExamToDo] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedOptions")) || {};
  });
  const [examFinished, setExamFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviewResults, setReviewResults] = useState(false);
  const [totalMarks, setTotalMarks] = useState(0);
  const [showNoQuestionsMessage, setShowNoQuestionsMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasShownSuccess = useRef(false);
  const location = useLocation();
  const navkwigate = useNavigate();

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const errors = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const success = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id") || "";
    setExamId(id);
  }, [location.search]);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${ApiUrl}/exams/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const examData = res.data.data;
        setExamToDo(examData);
        localStorage.setItem("live_exam_data", JSON.stringify(examData));
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };
    if (examId) fetchExamDetails();
  }, [examId]);

  useEffect(() => {
    if (examToDo && examId) {
      setExamQuestions(examToDo?.questions || []);
    }
  }, [examToDo, examId]);

  useEffect(() => {
    localStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
  }, [selectedOptions]);
  const handleSubmitExam = useCallback(async () => {
    if (examFinished || !examToDo || isSubmitting) return;
    setIsSubmitting(true);
    setExamFinished(true);

    try {
      let score = 0;
      examQuestions.forEach((q) => {
        const selectedOptionId = selectedOptions[q._id];
        const correctOption = q.options.find((opt) => opt.isCorrect);
        if (selectedOptionId && selectedOptionId === correctOption?._id) {
          score++;
        }
      });

      const token = localStorage.getItem("token");
      if (!token) {
        errors("You need to login first");
        navkwigate("/login");
        return;
      }

      const savedOptions =
        JSON.parse(localStorage.getItem("selectedOptions")) || {};
      const responses = Object.keys(savedOptions).map((questionId) => ({
        questionId,
        selectedOptionId: savedOptions[questionId],
      }));

      const payload = {
        examId: examToDo._id,
        responses,
      };

      const res = await fetch(`${ApiUrl}/responses/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "200") {
        const message = data.message || "Failed to submit answers";
        throw new Error(message);
      }

      if (!hasShownSuccess.current) {
        success("Your answers submitted successfully");
        hasShownSuccess.current = true;
      }

      localStorage.removeItem("selectedOptions");
      localStorage.removeItem(`examTimeLeft_${examId}`);
      setTotalMarks(score);
      setShowModal(false);
    } catch (error) {
      console.error("Submission error:", error);
      errors(error.message || "Error submitting answers");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    examQuestions,
    examToDo,
    examId,
    navkwigate,
    selectedOptions,
    examFinished,
    isSubmitting,
  ]);
  const handleAnswerChange = (questionId, optionId) => {
    if (examFinished) return;
    setSelectedOptions((prev) => {
      const updated = { ...prev, [questionId]: optionId };
      localStorage.setItem("selectedOptions", JSON.stringify(updated));
      return updated;
    });
  };

  const confirmFinishExam = () => setShowModal(true);

  const handleModalResponse = (res) => {
    if (res === "yes") {
      handleSubmitExam();
    }
    setShowModal(false);
  };

  const handleReviewResults = () => setReviewResults(true);

  useEffect(() => {
    if (examToDo && examToDo.questions?.length === 0) {
      setShowNoQuestionsMessage(true);
    }
  }, [examToDo]);
  const currentQuestion = examQuestions[selectedQuestion];
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
          {!reviewResults && (
            <>
              <DescriptionCard
                questions={examQuestions.length}
                total20={examQuestions.length * 1}
                total100={examQuestions.length * 5}
                pass20={((12 / 20) * examQuestions.length).toFixed(0)}
                pass100={((60 / 20) * examQuestions.length).toFixed(0)}
                number={examToDo?.number}
                type={examToDo?.type}
                timeLeft={
                  <Timer
                    initialTime={1200}
                    onTimeEnd={handleSubmitExam}
                    examId={examId}
                    examFinished={examFinished}
                  />
                }
                access={examId}
              />

              <div className="flex flex-wrap justify-center py-1 md:gap-4 gap-2">
                {examQuestions.map((q, idx) => {
                  const isAnswered = selectedOptions[q._id];
                  return (
                    <button
                      key={q._id}
                      onClick={() => !examFinished && setSelectedQuestion(idx)}
                      disabled={examFinished}
                      className={`w-20 h-10 text-sm rounded-md flex justify-center items-center 
                      ${
                        isAnswered
                          ? "bg-blue-500 text-white"
                          : "bg-white border"
                      } 
                      ${examFinished ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Ikibazo: {idx + 1}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="w-full px-3">
            {!reviewResults && currentQuestion ? (
              <>
                <h3 className="mb-0 text-lg font-semibold">
                  Q{selectedQuestion + 1}. {currentQuestion.phrase}
                </h3>
                {currentQuestion.image && (
                  <img
                    src={currentQuestion.image}
                    alt="question"
                    className="w-32 h-32 rounded-md mb-1"
                  />
                )}
                <div className="mb-1 space-y-1">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected =
                      selectedOptions[currentQuestion._id] === option._id;
                    return (
                      <label
                        key={option._id}
                        className={`flex items-center space-x-2 cursor-pointer ${
                          examFinished ? "cursor-not-allowed opacity-70" : ""
                        }`}
                        onClick={() =>
                          !examFinished &&
                          handleAnswerChange(currentQuestion._id, option._id)
                        }
                      >
                        <div
                          className={`md:w-5 md:h-5 w-4 h-4 rounded-full border flex items-center justify-center transition ${
                            isSelected
                              ? "bg-blue-500 text-white"
                              : "bg-white border-gray-600"
                          }`}
                        >
                          {isSelected && <span className="text-sm">✔</span>}
                        </div>
                        <span>
                          {String.fromCharCode(97 + idx)}. {option.text}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {!examFinished && (
                  <div className="md:mt-96 mt-12 md:flex md:justify-between grid grid-cols-2 gap-4 md:pb-0 pb-4">
                    <button
                      onClick={confirmFinishExam}
                      className="bg-blue-900 text-white px-2 py-1 rounded flex justify-center items-center gap-2"
                    >
                      <GrSend />
                      Soza Ikizamini
                    </button>
                    <button
                      onClick={() =>
                        setSelectedQuestion((prev) => Math.max(prev - 1, 0))
                      }
                      className={`bg-blue-900 text-white px-2 py-1 rounded flex jus items-center gap-2
                                            ${
                                              selectedQuestion === 0
                                                ? "bg-gray-500 cursor-not-allowed"
                                                : "bg-blue-900"
                                            }`}
                      disabled={selectedQuestion === 0}
                    >
                      <LuCircleArrowLeft />
                      Ikibanza / Prev
                    </button>
                    <button
                      onClick={() =>
                        setSelectedQuestion((prev) =>
                          Math.min(prev + 1, examQuestions.length - 1)
                        )
                      }
                      className={`bg-blue-900 text-white px-2 py-1 rounded flex jus items-center gap-2
                                            ${
                                              selectedQuestion ===
                                              examQuestions.length - 1
                                                ? "bg-gray-500 cursor-not-allowed"
                                                : "bg-blue-900"
                                            }`}
                      disabled={selectedQuestion === examQuestions.length - 1}
                    >
                      <FiArrowRightCircle /> Igikurikira/Next
                    </button>
                  </div>
                )}
                {examFinished && !reviewResults && (
                  <div className="flex justify-center items-center flex-col">
                    <div className="mt-2 flex justify-center gap-24 md:mb-0">
                      <button className="bg-gray-500 cursor-not-allowed text-white px-4 py-1 rounded flex jus items-center gap-2">
                        <GrSend />
                        Soza Ikizamini
                      </button>
                      <button
                        onClick={handleReviewResults}
                        className="bg-green-500 flex justify-center gap-2 items-center text-white px-4 py-1 rounded"
                      >
                        <FaRegEye />
                        Reba Ibisubizo
                      </button>
                    </div>
                    <div className="text-md flex gap-12 mt-1 text-orange-500 font-medium">
                      <p>
                        {totalMarks}/{examQuestions.length}
                      </p>
                      <p>
                        {((totalMarks / examQuestions.length) * 100).toFixed(0)}
                        /100
                      </p>
                    </div>
                  </div>
                )}

                {showModal && (
                  <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-2 z-[9999]">
                    <div className="bg-Total rounded-lg flex md:flex-row flex-col items-center justify-around shadow-lg md:w-[60%] md:py-14 py-0 w-full text-center relative">
                      <button
                        className="absolute top-2 right-2 text-xl bg-white text-red-700 border-2 border-white rounded-full w-8 h-8 flex justify-center"
                        onClick={() => handleModalResponse("no")}
                      >
                        ✖
                      </button>
                      <img
                        src={Police}
                        alt="Logo"
                        className="w-48 h-48 justify-center"
                      />
                      <div className="bg-white rounded-md md:w-[60%] w-full pb-4">
                        <div className="p-2 w-full bg-green-700 rounded-md text-center">
                          <h1 className="text-lg font-bold text-blue-900">
                            Itonde!!
                          </h1>
                        </div>
                        <h3 className="text-lg font-bold my-3 text-center">
                          Ese Urashaka Gusoza Ikizamini?
                        </h3>
                        <div className="flex justify-between p-6">
                          <button
                            onClick={() => handleModalResponse("no")}
                            className="bg-Total text-white px-4 py-1 rounded"
                          >
                            Oya, Subira inyuma
                          </button>
                          <button
                            onClick={() => handleModalResponse("yes")}
                            disabled={isSubmitting}
                            className="bg-green-500 text-white px-1 py-1 rounded disabled:opacity-50"
                          >
                            {isSubmitting
                              ? "Kirikoherezwa..."
                              : "Yego, Ndasoje"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : reviewResults ? (
              <>
                <div className="w-full bg-green-500 text-blue-900 font-bold text-xl rounded-md text-center mb-4">
                  <h2 className="font-bold py-2">Uko wakoze</h2>
                </div>
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-300 text-blue-900">
                    <tr>
                      <th className="border p-1 text-bold text-lg">
                        Ibibazo by'ikizamini
                      </th>
                      <th className="border p-1 text-bold text-lg">
                        Ibisubizo by'ibibazo
                      </th>
                      <th className="border p-1 text-bold text-lg">
                        Amanota wabonye
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {examQuestions.map((q) => {
                      const selectedOptionId = selectedOptions[q._id];
                      const correctOption = q.options.find(
                        (opt) => opt.isCorrect
                      );
                      const correct = selectedOptionId === correctOption?._id;

                      return (
                        <tr key={q._id}>
                          <td className="border px-2">
                            <div>{q.phrase}</div>
                            {q.image && (
                              <img
                                src={q.image}
                                alt=""
                                className="w-16 h-16 rounded-full"
                              />
                            )}
                          </td>
                          <td className="border px-2">
                            {q.options.map((opt, i) => {
                              const isSelected = selectedOptionId === opt._id;
                              const isCorrect = opt._id === correctOption?._id;

                              return (
                                <div
                                  key={opt._id}
                                  className={`p-1 ${
                                    isCorrect
                                      ? "text-green-500"
                                      : isSelected
                                      ? "text-red-500"
                                      : ""
                                  }`}
                                >
                                  {String.fromCharCode(97 + i)}. {opt.text}
                                </div>
                              );
                            })}
                          </td>
                          <td className="border border-gray-300">
                            <div
                              className={`text-center -mt-12 font-semibold ${
                                correct ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {correct ? "Wagikoze" : "Wakishe"}
                            </div>
                            <div className="text-center font-semibold">
                              {selectedOptionId == null
                                ? "Kuko Ntiwagisubije"
                                : correct
                                ? "Amanota: 1/20 | 5%"
                                : "Amanota: 0/20 | 0%"}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center font-bold text-lg p-4 bg-gray-100"
                      >
                        <div className="text-center text-2xl text-blue-900">
                          {totalMarks >=
                          ((12 / 20) * examQuestions.length).toFixed(0)
                            ? "Watsinze wabikoze neza 🙌🙌🙌"
                            : "Watsinzwe ikizamini kwiga cyane!!"}
                        </div>
                        <div className="text-xl text-orange-500 font-medium">
                          Amanota wabonye: {totalMarks}/{examQuestions.length} |{" "}
                          {((totalMarks / examQuestions.length) * 100).toFixed(
                            0
                          )}
                          /100
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => {
                      localStorage.removeItem("selectedOptions");
                      localStorage.removeItem(`examTimeLeft_${examId}`);
                      navkwigate("/schools/accessableexams");
                    }}
                    className="bg-red-300 text-white py-2 px-4 rounded"
                  >
                    Kuraho iyi page
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default SchoolLiveExam;
