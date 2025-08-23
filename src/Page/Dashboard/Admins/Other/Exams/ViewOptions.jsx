import React, { useState, useEffect } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { MdMoreHoriz } from "react-icons/md";
import EditOptionPopup from "./EditOptionPopup";
import DeleteOptionPopup from "./DeleteOptionPopup";
import axios from "axios";

const ViewOptions = ({ question, onBack }) => {
  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [optionToEdit, setOptionToEdit] = useState(false);
  const [editedOptionText, setEditedOptionText] = useState("");
  const [editedIsCorrect, setEditedIsCorrect] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState(null);

  const [options, setOptions] = useState([]);

  const toggleMenu = (index) => {
    setSelectedMenu(selectedMenu === index ? null : index);
  };

  const fetchOptions = async () => {
    try {
      const res = await axios.get(`${ApiUrl}/options/${question._id}`);
      if (res.data && res.data.data) {
        setOptions(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch options:", error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [question]);

  const handleSaveEditedOption = async () => {
    if (!optionToEdit) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${ApiUrl}/options/${optionToEdit._id}`,
        {
          text: editedOptionText,
          isCorrect: editedIsCorrect,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOptionToEdit(false);
      fetchOptions();
    } catch (error) {
      console.error("Failed to update option:", error);
    }
  };

  const handleDeleteOption = async () => {
    if (!optionToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${ApiUrl}/options/${optionToDelete._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setOptionToDelete(null);
      fetchOptions();
    } catch (error) {
      console.error("Failed to delete option:", error);
    }
  };

  return (
    <div className="md:px-6 py-6 px-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-xl text-sm font-semibold">
          Question: {question.phrase}
        </h2>
        <button
          onClick={onBack}
          title="Back to questions"
          className="bg-gray-300 text-blue-900 px-2 py-1 text-2xl font-bold rounded hover:bg-gray-400"
        >
          <IoReturnUpBack size={24} />
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-blue-900">
        <table className="w-full text-left table-auto relative">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-1 whitespace-nowrap">Option</th>
              <th className="px-6 py-1 whitespace-nowrap">Correct</th>
              <th className="px-6 py-1 whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {options.map((option, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 relative">
                <td className="px-6 py-1 whitespace-nowrap">{option.text}</td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {option.isCorrect ? "True" : "False"}
                </td>
                <td className="px-6 py-1 text-right">
                  <button
                    onClick={() => toggleMenu(index)}
                    className="p-2 hover:bg-gray-200 rounded-full"
                  >
                    <MdMoreHoriz size={20} />
                  </button>
                  {selectedMenu === index && (
                    <div className="absolute right-6 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      <ul className="text-sm text-blue-900">
                        <li
                          className="hover:bg-gray-100 px-4 py-1 cursor-pointer"
                          onClick={() => {
                            setOptionToEdit(option);
                            setEditedOptionText(option.text);
                            setEditedIsCorrect(option.isCorrect);
                          }}
                        >
                          Edit
                        </li>
                        <li
                          className="hover:bg-gray-100 text-red-500 px-4 py-1 cursor-pointer"
                          onClick={() => setOptionToDelete(option)}
                        >
                          Delete
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {optionToEdit && (
        <EditOptionPopup
          option={optionToEdit}
          editedText={editedOptionText}
          isCorrect={editedIsCorrect}
          setEditedText={setEditedOptionText}
          setIsCorrect={setEditedIsCorrect}
          onClose={() => setOptionToEdit(false)}
          onSave={handleSaveEditedOption}
        />
      )}

      {optionToDelete && (
        <DeleteOptionPopup
          onConfirm={handleDeleteOption}
          onCancel={() => setOptionToDelete(null)}
        />
      )}
    </div>
  );
};

export default ViewOptions;
