import React, { useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../../Components/LoadingSpinner ";

const AddNewExamPopup = ({ setShowAddExamPopup, onExamAdded }) => {
  const [examTitle, setExamTitle] = useState("");
  const [examFees, setExamFees] = useState("");
  const [examNumber, setExamNumber] = useState("");
  const [examType, setExamType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      
      const newExam = {
        number: examNumber,
        title: examTitle,
        fees: examFees,
        type: examType,
      };

      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${ApiUrl}/exams`,
        newExam,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const successMsg = res.data?.message;
      setSuccessMessage(successMsg);
      setTimeout(() => {
        setExamTitle("");
        setExamFees("");
        setExamNumber("");
        setExamType("");
        setShowAddExamPopup(false);
        onExamAdded(res.data.data);
      }, 3000);
      
    } catch (error) {
      const errorMsg = error.response?.data?.message
      setErrorMessage(errorMsg);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      
      console.error("Error adding new exam:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Exam
        </h2>
        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-sm">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="examNumber" className="block text-sm text-gray-700">
              Exam Number
            </label>
            <input
              type="number"
              id="examNumber"
              value={examNumber}
              onChange={(e) => setExamNumber(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="examTitle" className="block text-sm text-gray-700">
              Exam Title
            </label>
            <input
              type="text"
              id="examTitle"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full border border-blue-900/20 rounded px-3 py-2 mt-1"
            >
              <option value="">---</option>
              <option value="kwiga">kwiga</option>
              <option value="gukora">gukora</option>
            </select>
          </div>
          <div>
            <label htmlFor="examFees" className="block text-sm text-gray-700">
              Exam Fees
            </label>
            <input
              type="text"
              id="examFees"
              value={examFees}
              onChange={(e) => setExamFees(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-around">
          <button
            onClick={() => setShowAddExamPopup(false)}
            disabled={isLoading}
            className={`px-2 py-1 ${
              isLoading ? "bg-gray-200" : "bg-gray-300 hover:bg-gray-400"
            } text-gray-800 rounded`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-2 py-1 ${
              isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white rounded flex items-center justify-center min-w-[100px]`}
          >
            {isLoading ? (
              <LoadingSpinner size={5} strokeWidth={2} />
            ) : (
              "Save Exam"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewExamPopup;