import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";
import LoadingSpinner from "../../../../../Components/LoadingSpinner ";

const AddUserPopup = ({
  newCompanyName,
  newTin,
  newEmail,
  newRole,
  newAddress,
  newPhone,
  newIdcard,
  newPassword,
  setNewCompanyName,
  setNewTin,
  setNewEmail,
  setNewRole,
  setNewAddress,
  setNewPhone,
  setNewIdcard,
  setNewPassword,
  setShowAddPopup,
  handleAddUser,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add New User
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Company Name"
            className="w-full border px-4 py-1 rounded"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tin Number"
            className="w-full border px-4 py-1 rounded"
            value={newTin}
            onChange={(e) => setNewTin(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full border px-4 py-1 rounded"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-1 rounded"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Id Card"
            className="w-full border px-4 py-1 rounded"
            value={newIdcard}
            onChange={(e) => setNewIdcard(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Telefone"
            className="w-full border px-4 py-1 rounded"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border px-4 py-1 rounded pr-10"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <select
            className="w-full border px-4 py-1 rounded"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="">----</option>
            <option value="student">student</option>
            <option value="school">school</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div className="flex justify-around space-x-4 mt-6">
          <button
            onClick={() => setShowAddPopup(false)}
            className="px-2 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleAddUser}
            className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center min-w-[100px]"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Save Data"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserPopup;
