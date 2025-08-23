import React, { useState, useEffect } from "react";
import { MdMoreHoriz } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditUserPopup from "./Other/Users/EditUserPopup";
import DeleteUserPopup from "./Other/Users/DeleteUserPopup";
import AddUserPopup from "./Other/Users/AddUserPopup";
import LoadingSpinner from "../../../Components/LoadingSpinner ";

const USERS_PER_PAGE = 4;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
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

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newTin, setNewTin] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newIdcard, setNewIdcard] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAdmin = currentUser?.role === "admin";
  const isSuperAdmin = currentUser?.role === "supperAdmin";
  const canAdd = isAdmin || isSuperAdmin;
  const canEdit = isSuperAdmin;
  const canDelete = isSuperAdmin;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/kwinjira");
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
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/kwinjira");
        return;
      }

      const response = await axios.get(`${ApiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to load users. Please try again.");
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/kwinjira");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = (userId) => {
    setSelectedMenu(selectedMenu === userId ? null : userId);
  };

  const handleEditClick = (user) => {
    const token = localStorage.getItem("token");
    if (!token || !isSuperAdmin) {
      navigate("/kwinjira");
      return;
    }

    setUserToEdit(user);
    setEditedCompanyName(user.companyName || "");
    setEditedTin(user.tin || "");
    setEditedFName(user.fName || "");
    setEditedLName(user.lName || "");
    setEditedIdcard(user.idCard || "");
    setEditedPhone(user.phone || "");
    setEditedEmail(user.email || "");
    setEditedRole(user.role || "student");
    setEditedAddress(user.address || "");
    setShowEditPopup(true);
    setSelectedMenu(null);
  };

  const handleSaveUserEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !isSuperAdmin || !userToEdit) {
      navigate("/kwinjira");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const payload = {};
      if (editedCompanyName !== userToEdit.companyName) payload.companyName = editedCompanyName || null;
      if (editedTin !== userToEdit.tin) payload.tin = editedTin || null;
      if (editedFName !== userToEdit.fName) payload.fName = editedFName || null;
      if (editedLName !== userToEdit.lName) payload.lName = editedLName || null;
      if (editedEmail !== userToEdit.email) payload.email = editedEmail || null;
      if (editedPhone !== userToEdit.phone) payload.phone = editedPhone || null;
      if (editedIdcard !== userToEdit.idCard) payload.idCard = editedIdcard || null;
      if (editedRole !== userToEdit.role) payload.role = editedRole || null;
      if (editedAddress !== userToEdit.address) payload.address = editedAddress || null;
      if (Object.keys(payload).length > 0) {
        await axios.put(`${ApiUrl}/users/${userToEdit._id}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        setUsers(users.map(user => 
          user._id === userToEdit._id ? { ...user, ...payload } : user
        ));
      }

      setShowEditPopup(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      setError(error.response?.data?.message || "Failed to update user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    const token = localStorage.getItem("token");
    if (!token || !isSuperAdmin) {
      navigate("/kwinjira");
      return;
    }

    setUserToDelete(user);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token || !isSuperAdmin || !userToDelete) {
      navigate("/kwinjira");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await axios.delete(`${ApiUrl}/users/${userToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setUsers(users.filter((user) => user._id !== userToDelete._id));
      setShowDeletePopup(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
      setError(error.response?.data?.message || "Failed to delete user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    const token = localStorage.getItem("token");
    if (!token || !canAdd) {
      navigate("/kwinjira");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const newUser = {
        companyName: newCompanyName || null,
        tin: newTin || null,
        email: newEmail,
        phone: newPhone || null,
        idCard: newIdcard || null,
        role: newRole ,
        address: newAddress || null,
        password: newPassword,
      };

      const response = await axios.post(`${ApiUrl}/users`, newUser, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      setUsers([...users, response.data.data]);
      setShowAddPopup(false);
      resetAddForm();
    } catch (error) {
      console.error("Failed to add user:", error);
      setError(error.response?.data?.message || "Failed to add user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAddForm = () => {
    setNewCompanyName("");
    setNewTin("");
    setNewEmail("");
    setNewPhone("");
    setNewIdcard("");
    setNewRole("");
    setNewAddress("");
    setNewPassword("");
  };

  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedMenu(null);
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size={10} strokeWidth={3} />
      </div>
    );
  }

  return (
    <div className="md:px-6 py-6 px-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage All Users</h2>
        {canAdd && (
          <button
            onClick={() => setShowAddPopup(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            Add Company
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {isLoading && users.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={10} strokeWidth={3} />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 whitespace-nowrap">Name</th>
                  <th className="px-6 py-3 whitespace-nowrap">Email</th>
                  <th className="px-6 py-3 whitespace-nowrap">Id Card</th>
                  <th className="px-6 py-3 whitespace-nowrap">Phone</th>
                  <th className="px-6 py-3 whitespace-nowrap">Address</th>
                  <th className="px-6 py-3 whitespace-nowrap">Role</th>
                  {(canEdit || canDelete) && (
                    <th className="px-6 py-3 text-right whitespace-nowrap">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 whitespace-nowrap">
                      {user.fName || user.lName
                        ? `${user.fName || ""} ${user.lName || ""}`
                        : user.companyName}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{user.idCard}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{user.phone}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{user.address}</td>
                    <td className="px-6 py-3 whitespace-nowrap capitalize">{user.role}</td>
                    {(canEdit || canDelete) && (
                      <td className="px-6 py-3 text-right relative">
                        <button
                          onClick={() => toggleMenu(user._id)}
                          className="p-2 hover:bg-gray-200 rounded-full"
                          disabled={isLoading}
                        >
                          <MdMoreHoriz size={22} />
                        </button>
                        {selectedMenu === user._id && (
                          <div className="absolute right-6 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            <ul className="text-sm text-gray-700">
                              {canEdit && (
                                <li
                                  className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-blue-800"
                                  onClick={() => handleEditClick(user)}
                                >
                                  Edit
                                </li>
                              )}
                              {canDelete && (
                                <li
                                  className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-red-500"
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

          {users.length > USERS_PER_PAGE && (
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className={`px-4 py-2 rounded ${
                  currentPage === 1 || isLoading
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
                disabled={currentPage === totalPages || isLoading}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages || isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

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
          isLoading={isLoading}
        />
      )}

      {showAddPopup && (
        <AddUserPopup
          newCompanyName={newCompanyName}
          newTin={newTin}
          newEmail={newEmail}
          newPhone={newPhone}
          newIdcard={newIdcard}
          newRole={newRole}
          newAddress={newAddress}
          newPassword={newPassword}
          setNewCompanyName={setNewCompanyName}
          setNewTin={setNewTin}
          setNewEmail={setNewEmail}
          setNewPhone={setNewPhone}
          setNewIdcard={setNewIdcard}
          setNewRole={setNewRole}
          setNewAddress={setNewAddress}
          setNewPassword={setNewPassword}
          setShowAddPopup={setShowAddPopup}
          handleAddUser={handleAddUser}
          isLoading={isLoading}
        />
      )}

      {showDeletePopup && userToDelete && (
        <DeleteUserPopup
          user={userToDelete}
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={handleConfirmDelete}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default AdminUsers;