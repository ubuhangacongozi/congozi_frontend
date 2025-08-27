import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentResults = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchExams = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await axios.get(
          `${ApiUrl}/responses/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data && res.data.data) {
          const completedExams = res.data.data.filter(
            (exam) => exam.responses.length > 0
          );
          setExams(completedExams);
        }
      } catch (error) {
        console.error("Failed to fetch exams:", error);
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-2 text-red-600">
          You must be logged in to view your results.
        </h2>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-md text-center text-Total font-semibold mb-4">Ibizamini nakoze</h2>

      {!selectedExam ? (
        <div className="grid gap-4 md:grid-cols-4">
          {exams.map((exam, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition"
            >
              <h3 className="text-md font-bold">{exam.title}</h3>
              <p>
                Type: <span className="capitalize text-sm">{exam.type}</span>
              </p>
              <p className="text-sm">Total Marks: {exam.totalPoints}</p>
              <div className="flex justify-center items-center">
                <button
                className="mt-2 px-2 py-1 bg-Total text-white rounded hover:bg-blue-500"
                onClick={() => setSelectedExam(exam)}
              >
                Reba Ibisubizo
              </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded-xl">
          <button
            className="mb-4 px-3 py-1 bg-Total text-white rounded hover:bg-blue-500"
            onClick={() => setSelectedExam(null)}
          >
            Subira Inyuma
          </button>
          <h3 className="text-lg font-semibold mb-4">{selectedExam.title}</h3>

          <div className="space-y-6">
            {selectedExam.responses.map((question, qIdx) => {
              const selected = question.selectedOption;
              const isCorrect = selected.isCorrect;

              return (
                <div key={qIdx} className="bg-white p-1 rounded-lg shadow">
                  <p className="font-medium mb-1">
                    Q:{qIdx + 1}. {question.phrase}
                  </p>
                  {question.image && (
                    <img
                      src={question.image}
                      alt="question"
                      className="w-20 h-[70px] rounded-md mb-1"
                    />
                  )}
                  <p
                    className={`p-2 inline-block rounded ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Wasubije: <strong>{selected.text}</strong> {"("}
                    {isCorrect ? "Wagikoze" : "Wacyishe"}
                    {")"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
