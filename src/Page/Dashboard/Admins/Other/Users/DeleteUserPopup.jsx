import React from "react";

const DeleteUserPopup = ({ user, onCancel, onConfirm}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Are you sure you want to delete{" "}
          <span className="font-bold">
            {user.fName} {user.lName}
          </span>
          ?
        </h2>
        <div className="flex justify-around space-x-4">
          <button
            onClick={onCancel}
            className="px-2 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserPopup;
