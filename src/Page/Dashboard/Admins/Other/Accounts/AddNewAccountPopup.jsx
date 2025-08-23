import axios from "axios";
import React, { useState } from "react";
import LoadingSpinner from "../../../../../Components/LoadingSpinner ";

const AddNewAccountPopup = ({ setShowAddAccountPopup, onAccountAdded }) => {
  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const [accountTitle, setAccountTitle] = useState("");
  const [accountFees, setAccountFees] = useState("");
  const [accountValidIn, setAccountValidIn] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${ApiUrl}/accounts`,
        {
          title: accountTitle,
          fees: accountFees,
          validIn: accountValidIn,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const successMessage = response.data.message;
      setSuccessMessage(successMessage);
      setTimeout(() => {
        setAccountTitle("");
        setAccountFees("");
        setAccountValidIn("");
        setShowAddAccountPopup(false);
        onAccountAdded();
      }, 3000);
    } catch (error) {
      const backendError = error.response?.data?.message;
      setErrorMessage(backendError);

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      console.error("Failed to create account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Account
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
            <label
              htmlFor="accountTitle"
              className="block text-sm text-gray-700"
            >
              Account Title
            </label>
            <input
              type="text"
              id="accountTitle"
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Valid Period (days)
            </label>
            <input
              type="number"
              id="accountValid"
              value={accountValidIn}
              onChange={(e) => setAccountValidIn(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label
              htmlFor="accountFees"
              className="block text-sm text-gray-700"
            >
              Account Fees
            </label>
            <input
              type="number"
              id="accountFees"
              value={accountFees}
              onChange={(e) => setAccountFees(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-around">
          <button
            onClick={() => setShowAddAccountPopup(false)}
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
              "Save Account"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewAccountPopup;
