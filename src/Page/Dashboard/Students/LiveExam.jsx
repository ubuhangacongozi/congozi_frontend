import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Police from "../../../assets/Policelogo.png";
import { GrSend } from "react-icons/gr";
import { LuCircleArrowLeft } from "react-icons/lu";
import { FiArrowRightCircle } from "react-icons/fi";
import DescriptionCard from "../../../Components/Cards/DescriptionCard";
import { ToastContainer, toast } from "react-toastify";
import Timer from "../../../Components/ExamTimerLive";

const LiveExam = () => {
  const [examCode, setExamCode] = useState("");
  const [paidExam, setPaidExam] = useState(null);
  const [examToDo, setExamToDo] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [examFinished, setExamFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviewResults, setReviewResults] = useState(false);
  const [totalMarks, setTotalMarks] = useState(0);
  const [showNoQuestionsMessage, setShowNoQuestionsMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState("");
  const [showCongrats, setShowCongrats] = useState(false);

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const hasShownSuccess = useRef(false);
  const location = useLocation();
  const navkwigate = useNavigate();

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
    const code = params.get("code") || "";
    setExamCode(code);
  }, [location.search]);

  useEffect(() => {
    if (examCode && paidExam?._id) {
      const savedOptions = localStorage.getItem(
        `selectedOptions_${examCode}_${paidExam._id}`
      );
      const isFinished = localStorage.getItem(
        `examFinished_${examCode}_${paidExam._id}`
      );

      setSelectedOptions(savedOptions ? JSON.parse(savedOptions) : {});
      setExamFinished(isFinished === "true");
      setReviewResults(isFinished === "true");
    }
  }, [examCode, paidExam]);

  useEffect(() => {
    const fetchPaidExam = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${ApiUrl}/purchases/access/${examCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaidExam(res.data.data.itemId);
      } catch (error) {
        console.error("Error fetching paid exam:", error);
      }
    };
    if (examCode) fetchPaidExam();
  }, [examCode]);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const examId = paidExam?.examId || paidExam?._id;
        if (!examId) return;

        const res = await axios.get(`${ApiUrl}/exams/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const examData = res.data.data;
        setExamToDo(examData);

        if (examData.questions?.length === 0) {
          setShowNoQuestionsMessage(true);
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };
    if (paidExam) fetchExamDetails();
  }, [paidExam]);

  useEffect(() => {
    if (examToDo) {
      setExamQuestions(examToDo.questions || []);
    }
  }, [examToDo]);

  useEffect(() => {
    if (examCode && paidExam?._id && !examFinished) {
      localStorage.setItem(
        `selectedOptions_${examCode}_${paidExam._id}`,
        JSON.stringify(selectedOptions)
      );
    }
  }, [selectedOptions, examCode, paidExam, examFinished]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUserName(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
      }
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (examFinished) return;
      if (!examFinished && examQuestions.length > 0) {
        e.preventDefault();
        e.returnValue =
          "If you refresh, your exam progress will be lost. Are you sure?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [examFinished, examQuestions]);

  const handleAnswerChange = (questionId, optionId) => {
    if (examFinished) return;
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitExam = useCallback(async () => {
    if (examFinished || !examToDo || isSubmitting || !paidExam) return;
    setIsSubmitting(true);

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
        errors("Ntacyo gukora udafite, banza winjire.");
        setExamFinished(true);
        navkwigate("/kwinjira");
        return;
      }

      const responses = Object.keys(selectedOptions).map((questionId) => ({
        questionId,
        selectedOptionId: selectedOptions[questionId],
      }));

      const payload = {
        examId: examToDo._id,
        purchaseId: paidExam._id,
        responses,
      };

      const res = await axios.post(`${ApiUrl}/responses/add`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data) {
        try {
          const updated = await axios.put(
            `${ApiUrl}/purchases/access/${examCode}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("updated data:", updated);
        } catch (deleteError) {
          console.error("Error updating purchase record:", deleteError);
        }
      }

      if (!hasShownSuccess.current) {
        success("Ibisubizo byawe byoherejwe neza.");
        hasShownSuccess.current = true;
      }

      setTotalMarks(score);
      setShowCongrats(true);
      setShowModal(false);
      setExamFinished(true);
      setReviewResults(true);

      localStorage.setItem(`examFinished_${examCode}_${paidExam._id}`, "true");

      navkwigate(location.pathname, { replace: true });
    } catch (error) {
      console.error("Submission error:", error);
      errors(
        error.response?.data?.message || "Habaye ikibazo mu kohereza ibisubizo."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    examQuestions,
    examToDo,
    examCode,
    navkwigate,
    selectedOptions,
    examFinished,
    isSubmitting,
    paidExam,
    location.pathname,
  ]);

  const confirmFinishExam = () => setShowModal(true);

  const handleModalResponse = (res) => {
    if (res === "yes") {
      handleSubmitExam();
    }
    setShowModal(false);
  };

  const currentQuestion = examQuestions[selectedQuestion];

  const CongratsMessage = () => {
    const score20 = totalMarks;
    const score100 = Math.round((totalMarks / examQuestions.length) * 100);

    return (
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-2 z-[9999]">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Amanota wabonye</h2>
          <div className="text-xl mb-4 flex justify-center gap-12">
            <span className="font-bold">
              {score20}/{examQuestions.length}
            </span>{" "}
            <span className="text-gray-600">|</span>{" "}
            <span className="font-bold">{score100}/100</span>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setShowCongrats(false);
                localStorage.removeItem(
                  `selectedOptions_${examCode}_${paidExam._id}`
                );
                localStorage.removeItem(
                  `examTimeLeft_${examCode}_${paidExam._id}`
                );
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Reba ibisubizo
            </button>
            <button
              onClick={() => {
                setShowCongrats(false);
                localStorage.removeItem(
                  `examFinished_${examCode}_${paidExam._id}`
                );
                localStorage.removeItem(
                  `selectedOptions_${examCode}_${paidExam._id}`
                );
                localStorage.removeItem(
                  `examTimeLeft_${examCode}_${paidExam._id}`
                );
                navkwigate("/students/waitingexams", {
                  replace: true,
                  state: { reset: true },
                });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Kuraho iyi paje
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-white md:p-2 gap-2">
      {showCongrats && <CongratsMessage />}

      {showNoQuestionsMessage ? (
        <div className="text-center mt-10 text-Total font-semibold">
          <p>Ikikizami ntabibazo gifite. Hamagara Admin</p>
          <p>
            kuri: <span className="text-orange-500">0783905790</span>
          </p>
        </div>
      ) : !examFinished ? (
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
                examId={`${examCode}_${paidExam?._id}`}
                examFinished={examFinished}
              />
            }
            access={examCode}
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
                      isAnswered ? "bg-blue-500 text-white" : "bg-white border"
                    } 
                    ${examFinished ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Ikibazo: {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="w-full px-3">
            {currentQuestion && (
              <>
                <h3 className="mb-0 md:text-base text-sm font-semibold">
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
                              selectedQuestion === examQuestions.length - 1
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-blue-900"
                            }`}
                      disabled={selectedQuestion === examQuestions.length - 1}
                    >
                      <FiArrowRightCircle /> Igikurikira / Next
                    </button>
                  </div>
                )}
              </>
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
                      <h1 className="md:text-lg text-sm font-bold text-blue-900">
                        Itonde!!
                      </h1>
                    </div>
                    <h3 className="md:text-lg text-sm font-bold my-3 text-center">
                      Ese Urashaka Gusoza Ikizamini?
                    </h3>
                    <div className="flex justify-between p-6">
                      <button
                        onClick={() => handleModalResponse("no")}
                        className="bg-yellow-500 text-white px-1 py-1 rounded"
                      >
                        Oya, Subira inyuma
                      </button>
                      <button
                        onClick={() => handleModalResponse("yes")}
                        disabled={isSubmitting}
                        className="bg-green-500 text-white px-1 py-1 rounded disabled:opacity-50"
                      >
                        {isSubmitting ? "Kirikoherezwa..." : "Yego, Ndasoje"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : examFinished ? (
        <>
          <div className="w-full bg-green-500 text-blue-900 font-bold text-xl rounded-md text-center mb-4">
            <h2 className="font-bold py-2">Uko wakoze</h2>
          </div>
          <div className="overflow-x-auto rounded-lg shadow border border-blue-900 w-full">
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-300 text-blue-900">
                <tr>
                  <th className="border p-1 text-bold md:text-lg text-sm">
                    Ibibazo
                  </th>
                  <th className="border p-1 text-bold md:text-lg text-sm">
                    Ibisubizo
                  </th>
                  <th className="border p-1 text-bold md:text-lg text-sm">
                    Amanota
                  </th>
                </tr>
              </thead>
              <tbody>
                {examQuestions.map((q) => {
                  const selectedOptionId = selectedOptions[q._id];
                  const correctOption = q.options.find((opt) => opt.isCorrect);
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
                        <div className="text-center font-semibold whitespace-nowrap px-2">
                          {selectedOptionId == null
                            ? "Ntiwagisubije"
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
                    className="text-center font-bold md:text-lg text-sm p-4 bg-gray-100"
                  >
                    <div className="text-center md:text-base text-sm text-blue-900">
                      {totalMarks >= 10
                        ? "Watsinze wabikoze neza 🙌🙌🙌"
                        : "Watsinzwe ikizamini kwiga cyane!!"}
                    </div>
                    <div className="text-md text-orange-500 font-medium">
                      Amanota wabonye: {totalMarks}/{examQuestions.length} |{" "}
                      {((totalMarks / examQuestions.length) * 100).toFixed(0)}
                      /100
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                localStorage.removeItem(
                  `examFinished_${examCode}_${paidExam._id}`
                );
                localStorage.removeItem(
                  `selectedOptions_${examCode}_${paidExam._id}`
                );
                localStorage.removeItem(
                  `examTimeLeft_${examCode}_${paidExam._id}`
                );
                navkwigate("/students/waitingexams", {
                  replace: true,
                  state: { reset: true },
                });
              }}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Kuraho iyi paje
            </button>
          </div>
        </>
      ) : null}
      <ToastContainer />
    </div>
  );
};

export default LiveExam;
