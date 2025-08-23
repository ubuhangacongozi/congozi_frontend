import React, { useState, useEffect } from "react";
import { MdMoreHoriz } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddQuestionPopup from "./AddQuestionPopup";
import EditExamPopup from "./EditExamPopup";
import ViewQuestions from "./ViewQuestions";

const EXAMS_PER_PAGE = 4;

const AdminExams = () => {
  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const [exams, setExams] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const navkwigate = useNavigate();

  const [editingExam, setEditingExam] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [addQuestion, setAddQuestion] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedFees, setEditedFees] = useState("");
  const [editedType, setEditedType] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [viewingExam, setViewingExam] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editSuccessMessage, setEditSuccessMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");

  const isAdmin = currentUser?.role === "admin";
  const isSuperAdmin = currentUser?.role === "supperAdmin";
  const canAdd = isAdmin || isSuperAdmin;
  const canEdit = isAdmin || isSuperAdmin;
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

    fetchExams();
  }, [navkwigate]);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navkwigate("/kwinjira");
        return;
      }

      const res = await axios.get(`${ApiUrl}/exams`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setExams(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navkwigate("/kwinjira");
      }
    }
  };

  const handleAddQuestionClick = (exam) => {
    const token = localStorage.getItem("token");
    if (!token || !canAdd) {
      navkwigate("/kwinjira");
      return;
    }

    setSelectedExam(exam);
    setAddQuestion(true);
    setSelectedMenu(null);
  };

  const toggleMenu = (examId) => {
    setSelectedMenu(selectedMenu === examId ? null : examId);
  };

  const handleEditClick = (exam) => {
    const token = localStorage.getItem("token");
    if (!token || !canEdit) {
      navkwigate("/kwinjira");
      return;
    }

    setEditingExam(exam);
    setEditedTitle(exam.title);
    setEditedFees(exam.fees);
    setEditedType(exam.type);
    setShowEditPopup(true);
    setSelectedMenu(null);
  };

  const handleDeleteExam = async () => {
    const token = localStorage.getItem("token");
    if (!token || !canDelete || !examToDelete) {
      navkwigate("/kwinjira");
      return;
    }

    try {
      await axios.delete(`${ApiUrl}/exams/${examToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExams(exams.filter((e) => e._id !== examToDelete._id));
      setExamToDelete(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting exam:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navkwigate("/kwinjira");
      }
    }
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !canEdit || !editingExam) {
      navkwigate("/kwinjira");
      return;
    }

    try {
      setIsSaving(true);
      setEditErrorMessage("");
      setEditSuccessMessage("");

      const res = await axios.put(
        `${ApiUrl}/exams/${editingExam._id}`,
        {
          title: editedTitle,
          fees: editedFees,
          type: editedType,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const successMsg = res.data?.message;
      setEditSuccessMessage(successMsg);
      setExams(
        exams.map((exam) =>
          exam._id === editingExam._id
            ? {
                ...exam,
                title: editedTitle,
                fees: editedFees,
                type: editedType,
              }
            : exam
        )
      );

      setTimeout(() => {
        setShowEditPopup(false);
        setEditingExam(null);
        setEditSuccessMessage("");
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message;
      setEditErrorMessage(errorMsg);

      setTimeout(() => {
        setEditErrorMessage("");
      }, 3000);

      console.error("Error updating exam:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navkwigate("/kwinjira");
      }
    } finally {
      setIsSaving(false);
    }
  };
  const indexOfLastExam = currentPage * EXAMS_PER_PAGE;
  const indexOfFirstExam = indexOfLastExam - EXAMS_PER_PAGE;
  const currentExams = exams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(exams.length / EXAMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedMenu(null);
  };

  return viewingExam ? (
    <ViewQuestions exam={viewingExam} onBack={() => setViewingExam(null)} />
  ) : (
    <div className="md:px-6 py-6 px-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold">Manage All Exams</h2>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-blue-900">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-1 whitespace-nowrap">ID</th>
              <th className="px-6 py-1 whitespace-nowrap">Number</th>
              <th className="px-6 py-1 whitespace-nowrap">Title</th>
              <th className="px-6 py-1 whitespace-nowrap">Fees</th>
              <th className="px-6 py-1 whitespace-nowrap">Type</th>
              <th className="px-6 py-1 whitespace-nowrap">Questions</th>
              {(canEdit || canDelete || canAdd) && (
                <th className="px-6 py-1 text-right whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentExams.map((exam, index) => (
              <tr key={exam._id} className="border-t hover:bg-gray-50">
                <td className="px-2 py-1 whitespace-nowrap">
                  {indexOfFirstExam + index + 1}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">{exam.number}</td>
                <td className="px-0 py-1 whitespace-nowrap">{exam.title}</td>
                <td className="px-6 py-1 whitespace-nowrap">{exam.fees}</td>
                <td className="px-6 py-1 whitespace-nowrap">{exam.type}</td>
                <td className="px-6 py-1 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      exam.questions?.length >= 20
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {exam.questions?.length}
                  </span>
                </td>
                {(canEdit || canDelete || canAdd) && (
                  <td className="px-6 py-1 text-right relative">
                    <button
                      onClick={() => toggleMenu(exam._id)}
                      className="p-2 hover:bg-gray-200 rounded-full"
                    >
                      <MdMoreHoriz size={22} />
                    </button>
                    {selectedMenu === exam._id && (
                      <div className="absolute right-6 mt-2 w-52 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        <ul className="text-sm text-blue-900">
                          {canEdit && (
                            <li
                              onClick={() => handleEditClick(exam)}
                              className="hover:bg-gray-100 px-4 py-1 cursor-pointer"
                            >
                              Edit
                            </li>
                          )}
                          {canDelete && (
                            <li
                              onClick={() => {
                                setExamToDelete(exam);
                                setShowDeleteConfirm(true);
                                setSelectedMenu(null);
                              }}
                              className="hover:bg-gray-100 text-red-500 px-4 py-1 cursor-pointer"
                            >
                              Delete
                            </li>
                          )}
                          {canAdd && exam.questions.length < 20 && (
                            <li
                              onClick={() => handleAddQuestionClick(exam)}
                              className="hover:bg-gray-100 px-4 py-1 cursor-pointer"
                            >
                              Add {20 - exam.questions.length} Questions
                            </li>
                          )}
                          {exam.questions.length > 0 && (
                            <li
                              onClick={() => setViewingExam(exam)}
                              className="hover:bg-gray-100 px-4 py-1 cursor-pointer pb-2"
                            >
                              View {exam.questions.length} Questions
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
        <EditExamPopup
          editingExam={editingExam}
          editedTitle={editedTitle}
          editedFees={editedFees}
          editedType={editedType}
          setEditedTitle={setEditedTitle}
          setEditedFees={setEditedFees}
          setEditedType={setEditedType}
          setShowEditPopup={setShowEditPopup}
          handleSaveEdit={handleSaveEdit}
          isSaving={isSaving}
          successMessage={editSuccessMessage}
          errorMessage={editErrorMessage}
        />
      )}
      {addQuestion && (
        <AddQuestionPopup
          setAddQuestion={setAddQuestion}
          selectedExam={selectedExam}
          refreshQuestions={fetchExams}
        />
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[999] bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this exam?
            </h2>
            <p className="text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex justify-around gap-6">
              <button
                onClick={handleDeleteExam}
                className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setExamToDelete(null);
                }}
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

export default AdminExams;
