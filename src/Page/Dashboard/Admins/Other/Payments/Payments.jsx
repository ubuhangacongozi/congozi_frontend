import React, { useState, useEffect } from "react";
import { MdMoreHoriz } from "react-icons/md";
import axios from "axios";
import EditAccountPopup from "../Accounts/EditAccountPopup";

const EXAMS_PER_PAGE = 4;

const Payments = () => {
  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [accounts, setAccounts] = useState([]);
  const [accountToEdit, setAccountToEdit] = useState(null);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedFees, setEditedFees] = useState("");
  const [editedValidIn, setEditedValidIn] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navkwigate("/kwinjira");
      return;
    }
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/accounts`);
      setAccounts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      setAccounts([]);
    }
  };

  const toggleMenu = (accountId) => {
    setSelectedMenu(selectedMenu === accountId ? null : accountId);
  };

  const handleEditClick = (account) => {
    setAccountToEdit(account);
    setEditedTitle(account.title);
    setEditedFees(account.fees);
    setEditedValidIn(account.validIn);
    setSelectedMenu(null);
  };

  const handleDeleteClick = (account) => {
    setAccountToDelete(account);
    setShowDeleteConfirm(true);
    setSelectedMenu(null);
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navkwigate("/kwinjira");
        return;
      }

      await axios.delete(`${ApiUrl}/accounts/${accountToDelete._id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAccounts();
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
    setShowDeleteConfirm(false);
    setAccountToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setAccountToDelete(null);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navkwigate("/kwinjira");
        return;
      }

      await axios.put(
        `${ApiUrl}/accounts/${accountToEdit._id}`,
        {
          title: editedTitle,
          fees: editedFees,
          validIn: editedValidIn,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAccounts();
      setAccountToEdit(null);
    } catch (error) {
      console.error("Failed to update account:", error);
    }
  };

  const indexOfLastAccount = currentPage * EXAMS_PER_PAGE;
  const indexOfFirstAccount = indexOfLastAccount - EXAMS_PER_PAGE;
  const currentAccounts = accounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );
  const totalPages = Math.ceil(accounts.length / EXAMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedMenu(null);
  };
  const isAdmin = currentUser?.role === "admin";
  const isSuperAdmin = currentUser?.role === "supperAdmin";
  const canAddOrEdit = isAdmin || isSuperAdmin;
  const canDelete = isSuperAdmin;

  return (
    <div className="md:px-6 py-6 px-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage All Accounts</h2>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-blue-900">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-1 whitespace-nowrap">ID</th>
              <th className="px-6 py-1 whitespace-nowrap">Title</th>
              <th className="px-6 py-1 whitespace-nowrap">Fees</th>
              <th className="px-6 py-1 whitespace-nowrap">Valid Time</th>
              <th className="px-6 py-1 whitespace-nowrap">Granted Exams</th>
              {(canAddOrEdit || canDelete) && (
                <th className="px-6 py-1 text-right whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentAccounts.map((account, index) => (
              <tr key={account._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-1 whitespace-nowrap">
                  {indexOfFirstAccount + index + 1}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">{account.title}</td>
                <td className="px-6 py-1 whitespace-nowrap">{account.fees}</td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {account.validIn} Days
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-center">All</td>
                {(canAddOrEdit || canDelete) && (
                  <td className="px-6 py-1 text-right relative">
                    <button
                      onClick={() => toggleMenu(index)}
                      className="p-2 hover:bg-gray-200 rounded-full"
                    >
                      <MdMoreHoriz size={22} />
                    </button>
                    {selectedMenu === index && (
                      <div className="absolute right-6 mt-2 w-52 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        <ul className="text-sm text-blue-900">
                          {canAddOrEdit && (
                            <li
                              onClick={() => handleEditClick(account)}
                              className="hover:bg-gray-100 px-4 py-1 cursor-pointer"
                            >
                              Edit
                            </li>
                          )}
                          {canDelete && (
                            <li
                              onClick={() => handleDeleteClick(account)}
                              className="hover:bg-gray-100 text-red-500 px-4 py-1 cursor-pointer"
                            >
                              Delete
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
      {canAddOrEdit && accountToEdit && (
        <EditAccountPopup
          accountToEdit={accountToEdit}
          editedTitle={editedTitle}
          editedFees={editedFees}
          editedValidIn={editedValidIn}
          setEditedTitle={setEditedTitle}
          setEditedFees={setEditedFees}
          setEditedValidIn={setEditedValidIn}
          setShowEditPopup={setAccountToEdit}
          handleSaveEdit={handleSaveEdit}
        />
      )}
      {canDelete && showDeleteConfirm && (
        <div className="fixed inset-0 z-[999] bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this account?
            </h2>
            <p className="text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex justify-around gap-6">
              <button
                onClick={handleDeleteAccount}
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-2 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
