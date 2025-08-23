import React, { useState, useEffect } from "react";
import AccountCard from "../../../Components/Cards/AdminCards/AccountCard";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import { SlNote } from "react-icons/sl";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";

const SchoolDoExams = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [accountsPerPage, setAccountsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [validIn, setValidIn] = useState("");
  const [fees, setFees] = useState("");

  const location = useLocation();
  const { accessCode } = queryString.parse(location.search);
  const [account, setAccount] = useState({ data: [] });

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${ApiUrl}/purchases/complete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAccount(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const updateAccountsPerPage = () => {
      setAccountsPerPage(window.innerWidth >= 768 ? 6 : 2);
    };
    updateAccountsPerPage();
    window.addEventListener("resize", updateAccountsPerPage);
    return () => window.removeEventListener("resize", updateAccountsPerPage);
  }, []);

  const filteredAccounts = account.data.filter(
    (account) =>
      (validIn === "" ||
        account.itemId.validIn.toLowerCase().includes(validIn.toLowerCase())) &&
      (fees === "" || account.itemId.fees.toString().includes(fees)) &&
      (searchTerm === "" ||
        account.itemId.validIn
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        account.itemId.fees.toString().includes(searchTerm) ||
        account.itemId.title.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const currentAccounts = filteredAccounts.slice(
    currentPage * accountsPerPage,
    (currentPage + 1) * accountsPerPage
  );

  const navkwigate = useNavigate();

  const handleViewExams = (account) => {
    if (account.accessCode) {
      const accessCode = account.accessCode;
      navkwigate(`/schools/accessableexams?accessCode=${accessCode}`);
    } else {
      console.error("Nta code yo kukwereka ibizamini ufite.");
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-around items-center md:px-5 gap-1 bg-white md:p-2">
        <WelcomeDear />
        <div className="grid md:grid-cols-3 grid-cols-2 justify-between items-center md:gap-12 gap-1 px-3 py-4">
          <input
            type="text"
            placeholder="---Shaka konte n'iminsi imara ---"
            value={validIn}
            onChange={(e) => setValidIn(e.target.value)}
            className="border-2 border-blue-500 p-2 rounded-xl"
          />
          <input
            type="text"
            placeholder="---Shaka konte n'igiciro---"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            className="border-2 border-blue-500 p-2 rounded-xl"
          />
          <div className="w-full px-3 md:flex hidden">
            <input
              type="search"
              placeholder="Shaka konte n'igiciro cg iminsi"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-blue-500 p-2 rounded-xl w-full"
            />
          </div>
        </div>

        <div className="w-full px-3 pb-3 flex md:hidden">
          <input
            type="search"
            placeholder="Shaka konte n'igiciro cg iminsi"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-blue-500 p-2 rounded-xl w-full"
          />
        </div>

        {filteredAccounts.length === 0 ? (
          <p className="text-center py-4 text-red-500">No data found</p>
        ) : (
          <div className="grid md:grid-cols-3 w-full gap-4 md:gap-3 py-1">
            {currentAccounts.map((account, index) => {
              const buttonColor =
                account.itemId.validIn >= 30 ? "bg-green-500" : "bg-yellow-500";
              return (
                <AccountCard
                  key={index}
                  title={`Konte ${currentPage * accountsPerPage + index + 1}: ${
                    account.itemId.title
                  }`}
                  fees={account.itemId.fees}
                  validIn={account.itemId.validIn}
                  onPurchase={() => handleViewExams(account)}
                  icon={<FaRegEye />}
                  button={"Reba Ibizamini"}
                  buttonColor={buttonColor}
                />
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-around md:gap-[700px] gap-[120px] md:pb-0 pt-3 px-10">
            <div>
              <button
                className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
                  currentPage === 0 ? "opacity-50" : ""
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
              >
                <FaArrowAltCircleLeft size={24} />
                Izibanza
              </button>
            </div>
            <div>
              <button
                className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
                  currentPage === totalPages - 1 ? "opacity-50" : ""
                }`}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={currentPage === totalPages - 1}
              >
                Izikurira
                <FaArrowAltCircleRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolDoExams;
