import React, { useEffect } from "react";
import LoadingSpinner from "../../../../../Components/LoadingSpinner ";

const EditAccountPopup = ({
  accountToEdit,
  editedTitle,
  editedFees,
  editedValidIn,
  setEditedTitle,
  setEditedFees,
  setEditedValidIn,
  setShowEditPopup,
  handleSaveEdit,
  isSaving,
  successMessage,
  errorMessage,
}) => {
  if (!accountToEdit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <h3 className="text-xl font-semibold mb-2">Edit Account</h3>
        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

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
            <label className="text-sm font-medium text-gray-700">Fees</label>
            <input
              type="number"
              value={editedFees}
              onChange={(e) => setEditedFees(e.target.value)}
              className="w-full border border-blue-900/20 rounded px-3 py-1 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Valid</label>
            <input
              type="text"
              value={editedValidIn}
              onChange={(e) => setEditedValidIn(e.target.value)}
              className="w-full border border-blue-900/20 rounded px-3 py-1 mt-1"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-around gap-24">
          <button
            onClick={() => setShowEditPopup(false)}
            disabled={isSaving}
            className={`px-2 py-1 ${
              isSaving ? "bg-gray-300" : "bg-red-300 hover:bg-red-400"
            } text-gray-800 rounded`}
          >
            Close
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={isSaving}
            className={`ml-2 px-2 py-1 ${
              isSaving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white rounded flex items-center justify-center min-w-[60px]`}
          >
            {isSaving ? (
              <>
                <LoadingSpinner size={5} strokeWidth={2} />
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAccountPopup;