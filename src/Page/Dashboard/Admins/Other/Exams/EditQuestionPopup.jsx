import React, { useRef, useState, useEffect } from "react";
import { FaPaperclip } from "react-icons/fa";

const EditQuestionPopup = ({
  questionToEdit,
  editedMarks,
  editedPhrase,
  editedImage,
  setEditedMarks,
  setEditedPhrase,
  setEditedImage,
  setShowEditPopup,
  handleSaveEdit,
}) => {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (questionToEdit?.image && !editedImage) {
      setImagePreview(questionToEdit.image);
    }
    if (editedImage instanceof File) {
      const previewURL = URL.createObjectURL(editedImage);
      setImagePreview(previewURL);
      return () => URL.revokeObjectURL(previewURL);
    }
  }, [editedImage, questionToEdit]);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "marks") setEditedMarks(value);
    if (name === "phrase") setEditedPhrase(value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditedImage(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  if (!questionToEdit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Question</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Marks</label>
            <input
              type="number"
              name="marks"
              value={editedMarks}
              onChange={handleEditInputChange}
              className="w-full px-3 py-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Question Phrase</label>
            <textarea
              name="phrase"
              value={editedPhrase}
              onChange={handleEditInputChange}
              className="w-full px-3 py-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <div
              className="flex cursor-pointer px-3 py-2 border rounded items-center gap-3"
              onClick={handleImageClick}
            >
              <FaPaperclip className="text-blue-600" />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Choose...</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-around gap-6">
          <button
            onClick={() => setShowEditPopup(false)}
            className="px-2 py-1 bg-red-300 text-gray-800 rounded hover:bg-red-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuestionPopup;
