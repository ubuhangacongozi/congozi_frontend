import React from "react";

const EditExamPopup = ({
  editingExam,
  editedTitle,
  editedFees,
  editedType,
  setEditedTitle,
  setEditedFees,
  setEditedType,
  setShowEditPopup,
  handleSaveEdit,
}) => {
  if (!editingExam) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <h3 className="text-xl font-semibold mb-2">Edit Exam</h3>

        <div className="space-y-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full border border-blue-900/20 rounded px-3 py-1 mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              value={editedType}
              onChange={(e) => setEditedType(e.target.value)}
              className="w-full border border-blue-900/20 rounded px-3 py-2 mt-1"
            >
              <option value="">---</option>
              <option value="kwiga">kwiga</option>
              <option value="gukora">gukora</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Fees</label>
            <input
              type="number"
              value={editedFees}
              onChange={(e) => setEditedFees(e.target.value)}
              className="w-full border border-blue-900/20 rounded px-3 py-1 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Number of Questions
            </label>
            <input
              type="text"
              value={editingExam.questions.length}
              readOnly
              className="w-full border border-blue-900/20 rounded px-3 py-1 mt-1"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-around gap-24">
          <button
            onClick={() => setShowEditPopup(false)}
            className="px-2 py-1 bg-red-300 text-gray-800 rounded hover:bg-red-400"
          >
            Close
          </button>
          <button
            onClick={handleSaveEdit}
            className="ml-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExamPopup;
