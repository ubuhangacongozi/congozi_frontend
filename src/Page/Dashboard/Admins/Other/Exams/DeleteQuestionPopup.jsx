import React from "react";

const DeleteQuestionPopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Are you sure you want to delete this question?
        </h2>
        <div className="flex justify-around space-x-4">
          <button
            onClick={onConfirm}
            className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteQuestionPopup;
