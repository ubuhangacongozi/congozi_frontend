import React, { useState } from "react";
import { GoPaperclip } from "react-icons/go";
import axios from "axios";
import LoadingSpinner from "../../../../../Components/LoadingSpinner ";

const AddQuestionPopup = ({
  setAddQuestion,
  selectedExam,
  refreshQuestions,
}) => {
  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phrase: "",
    marks: "",
    image: null,
  });

  if (!selectedExam) return null;

  const handleFileTrigger = () => {
    document.getElementById("file-upload").click();
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) {
        const previewURL = URL.createObjectURL(file);
        setSelectedImage(previewURL);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const data = new FormData();
      data.append("phrase", formData.phrase);
      data.append("marks", formData.marks);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const token = localStorage.getItem("token");
      await axios.post(
        `${ApiUrl}/questions/${selectedExam._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (typeof refreshQuestions === "function") {
        await refreshQuestions();
      }
      setAddQuestion(false);
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <h3 className="text-xl font-semibold mb-4">Add New Question</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              New Question
            </label>
            <input
              type="text"
              name="phrase"
              value={formData.phrase}
              onChange={handleInputChange}
              className="w-full border border-blue-900 rounded px-3 py-1 mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Question Marks
            </label>
            <input
              type="number"
              name="marks"
              value={formData.marks}
              onChange={handleInputChange}
              className="w-full border border-blue-900 rounded px-3 py-1 mt-1"
            />
          </div>
          <div
            className="flex cursor-pointer lg:w-28 w-28 border-desired"
            onClick={handleFileTrigger}
          >
            <input
              type="file"
              id="file-upload"
              name="image"
              className="hidden"
              accept="image/*"
              onChange={handleInputChange}
            />
            <GoPaperclip className="lg:w-6 lg:h-6 w-6 h-6 text-tblue mr-2" />
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Preview"
                className="lg:w-6 lg:h-6 w-12 h-12 rounded-full object-cover ml-2"
              />
            ) : (
              <span className="text-pcolor lg:text-sm lg:mt-3 mt-1 text-xl font-bold">
                Choose..
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-around gap-24">
          <button
            onClick={() => setAddQuestion(false)}
            className="px-2 py-1 bg-red-300 text-gray-800 rounded hover:bg-red-400"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="ml-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 min-w-[120px]"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
              </>
            ) : (
              "Save Question"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionPopup;