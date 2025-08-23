import React, { useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../../Components/LoadingSpinner ";

const AddOptionPopup = ({ question, onClose, onSave }) => {
  const [optionText, setOptionText] = useState("");
  const [isCorrect, setIsCorrect] = useState("false");
  const [isLoading, setIsLoading] = useState(false);

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const handleSubmit = async () => {
    if (!optionText.trim()) {
      alert("Option text cannot be empty.");
      return;
    }

    const payload = {
      text: optionText.trim(),
      isCorrect: isCorrect === "true",
    };

    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${ApiUrl}/options/${question._id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSave(question._id, response.data.Option);
      onClose();
    } catch (error) {
      console.error("Failed to add options:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add Option</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Option text"
            value={optionText}
            onChange={(e) => setOptionText(e.target.value)}
            className="w-full border p-2 rounded-md mb-2"
          />
          <select
            value={isCorrect}
            onChange={(e) => setIsCorrect(e.target.value)}
            className="w-full border p-2 rounded-md"
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>

        <div className="flex justify-around gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-2 py-1 bg-red-300 text-gray-800 rounded hover:bg-red-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="ml-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size={5} strokeWidth={2} />
              </>
            ) : (
              "Save Option"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOptionPopup;
