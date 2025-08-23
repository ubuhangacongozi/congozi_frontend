import React, { useState, useEffect } from "react";
import { MdMoreHoriz } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditUserPopup from "./EditUserPopup";
import DeleteUserPopup from "./DeleteUserPopup";

const USERS_PER_PAGE = 4;

const Users = () => {
  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const navkwigate = useNavigate();

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editedCompanyName, setEditedCompanyName] = useState("");
  const [editedTin, setEditedTin] = useState("");
  const [editedFName, setEditedFName] = useState("");
  const [editedLName, setEditedLName] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedIdcard, setEditedIdcard] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [editedAddress, setEditedAddress] = useState("");

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const isSuperAdmin = currentUser?.role === "supperAdmin";
  const canEdit = isSuperAdmin;
  const canDelete = isSuperAdmin;

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

    fetchUsers();
  }, [navkwigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navkwigate("/kwinjira");
        return;
      }

      const response = await axios.get(`${ApiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navkwigate("/kwinjira");
      }
    }
  };

  const toggleMenu = (userId) => {
    setSelectedMenu(selectedMenu === userId ? null : userId);
  };

  const handleEditClick = (user) => {
    const token = localStorage.getItem("token");
    if (!token || !isSuperAdmin) {
      navkwigate("/kwinjira");
      return;
    }

    setUserToEdit(user);
    setEditedCompanyName(user.companyName);
    setEditedTin(user.tin);
    setEditedFName(user.fName);
    setEditedLName(user.lName);
    setEditedIdcard(user.idCard);
    setEditedPhone(user.phone);
    setEditedEmail(user.email);
    setEditedRole(user.role);
    setEditedAddress(user.address);
    setShowEditPopup(true);
    setSelectedMenu(null);
  };

  const handleSaveUserEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !isSuperAdmin || !userToEdit) {
      navkwigate("/kwinjira");
      return;
    }

    try {
      const updatedUser = {
        companyName: editedCompanyName,
        tin: editedTin,
        fName: editedFName,
        lName: editedLName,
        email: editedEmail,
        phone: editedPhone,
        idCard: editedIdcard,
        role: editedRole,
        address: editedAddress,
      };

      await axios.put(`${ApiUrl}/users/${userToEdit._id}`, updatedUser, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(
        users.map((user) =>
          user._id === userToEdit._id ? { ...user, ...updatedUser } : user
        )
      );
      setShowEditPopup(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navkwigate("/kwinjira");
      }
    }
  };

  const handleDeleteClick = (user) => {
    const token = localStorage.getItem("token");
    if (!token || !isSuperAdmin) {
      navkwigate("/kwinjira");
      return;
    }

    setUserToDelete(user);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token || !isSuperAdmin || !userToDelete) {
      navkwigate("/kwinjira");
      return;
    }

    try {
      await axios.delete(`${ApiUrl}/users/${userToDelete._id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user._id !== userToDelete._id));
      setShowDeletePopup(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navkwigate("/kwinjira");
      }
    }
  };
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedMenu(null);
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="md:px-6 py-6 px-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage All Users</h2>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-2">Name</th>
              <th className="px-6 py-2">Email</th>
              <th className="px-6 py-2">Id Card</th>
              <th className="px-6 py-2">Phone</th>
              <th className="px-6 py-2">Address</th>
              <th className="px-6 py-2">Role</th>
              {(canEdit || canDelete) && (
                <th className="px-6 py-2 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-2 whitespace-nowrap">
                  {user.fName || user.lName
                    ? `${user.fName || ""} ${user.lName || ""}`
                    : user.companyName}
                </td>
                <td className="px-6 py-2 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-2 whitespace-nowrap">{user.idCard}</td>
                <td className="px-6 py-2 whitespace-nowrap">{user.phone}</td>
                <td className="px-6 py-2 whitespace-nowrap">{user.address}</td>
                <td className="px-6 py-2 whitespace-nowrap">{user.role}</td>
                {(canEdit || canDelete) && (
                  <td className="px-6 py-2 text-right relative">
                    <button
                      onClick={() => toggleMenu(user._id)}
                      className="p-2 hover:bg-gray-200 rounded-full"
                    >
                      <MdMoreHoriz size={22} />
                    </button>
                    {selectedMenu === user._id && (
                      <div className="absolute right-6 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        <ul className="text-sm text-gray-700">
                          {canEdit && (
                            <li
                              className="hover:bg-gray-100 px-4 py-1 cursor-pointer text-blue-800"
                              onClick={() => handleEditClick(user)}
                            >
                              Edit
                            </li>
                          )}
                          {canDelete && (
                            <li
                              className="hover:bg-gray-100 px-4 py-1 cursor-pointer text-red-500"
                              onClick={() => handleDeleteClick(user)}
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
      {showEditPopup && (
        <EditUserPopup
          userToEdit={userToEdit}
          editedCompanyName={editedCompanyName}
          editedTin={editedTin}
          editedFName={editedFName}
          editedLName={editedLName}
          editedEmail={editedEmail}
          editedIdcard={editedIdcard}
          editedPhone={editedPhone}
          editedRole={editedRole}
          editedAddress={editedAddress}
          setEditedCompanyName={setEditedCompanyName}
          setEditedTin={setEditedTin}
          setEditedFName={setEditedFName}
          setEditedLName={setEditedLName}
          setEditedPhone={setEditedPhone}
          setEditedAddress={setEditedAddress}
          setEditedEmail={setEditedEmail}
          setEditedRole={setEditedRole}
          setEditedIdcard={setEditedIdcard}
          setShowEditPopup={setShowEditPopup}
          handleSaveUserEdit={handleSaveUserEdit}
        />
      )}
      {showDeletePopup && userToDelete && (
        <DeleteUserPopup
          user={userToDelete}
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Users;
