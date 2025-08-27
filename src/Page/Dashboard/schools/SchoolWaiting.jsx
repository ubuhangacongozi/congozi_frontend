import React, { useState, useEffect } from "react";
import AccountCard from "../../../Components/Cards/AdminCards/AccountCard";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";

const getRemainingDays = (endDate) => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const SchoolWaiting = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [accountsPerPage, setAccountsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [validIn, setValidIn] = useState("");
  const [fees, setFees] = useState("");
  const [isAccessingExams, setIsAccessingExams] = useState(false);

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const { accessCode } = queryString.parse(location.search);
  const [account, setAccount] = useState({ data: [] });

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

  // Check for accessCode parameter on component mount and URL changes
  useEffect(() => {
    const params = queryString.parse(location.search);
    if (params.accessCode) {
      setIsAccessingExams(true);
      // Navigate to the accessable exams page with the access code
      navkwigate(`/schools/accessableexams?accessCode=${params.accessCode}`);
    } else {
      setIsAccessingExams(false);
    }
  }, [location.search]); // Watch for changes in the URL search params

  useEffect(() => {
    const updateAccountsPerPage = () => {
      setAccountsPerPage(window.innerWidth >= 768 ? 6 : 2);
    };
    updateAccountsPerPage();
    window.addEventListener("resize", updateAccountsPerPage);
    return () => window.removeEventListener("resize", updateAccountsPerPage);
  }, []);

  const filteredAccounts = account.data.filter((account) => {
    const remainingDays = getRemainingDays(account.endDate);
    return (
      remainingDays > 0 &&
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
  });

  const soonToExpireAccounts = filteredAccounts.filter(
    (acc) => getRemainingDays(acc.endDate) == 1
  );

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const currentAccounts = filteredAccounts.slice(
    currentPage * accountsPerPage,
    (currentPage + 1) * accountsPerPage
  );

  const navkwigate = useNavigate();

  const handleViewExams = (account) => {
    const remainingDays = getRemainingDays(account.endDate);

    if (remainingDays <= 0) {
      alert("Your access to this account has expired.");
      return;
    }

    if (account.accessCode) {
      const accessCode = account.accessCode;
      navkwigate(`/schools/accessableexams?accessCode=${accessCode}`);
    } else {
      console.error("No access code available to show exams.");
    }
  };

  return (
    <div>
      {isAccessingExams ? (
        // You might want to add a loading component or redirect logic here
        <div>Redirecting to exams...</div>
      ) : (
        <div className="flex flex-col justify-around items-center md:px-5 gap-1 bg-white md:p-2">
          <WelcomeDear />

          {soonToExpireAccounts.length > 0 && (
            <div className="md:w-[90%] w-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-3">
              <strong>Kumenyesha!</strong> Ufite Konte{" "}
              {soonToExpireAccounts.length}{" "}
              {soonToExpireAccounts.length > 1 ? "s" : ""} zizarangira mumunsi 1.
              Gerageza uzikoreshe zitararangira!
            </div>
          )}

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
                const remainingDays = getRemainingDays(account.endDate);
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
                    remainingDays={remainingDays}
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
                  <FaArrowAltCircleLeft size={24} /> Izibanza
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
                  Izikurikira
                  <FaArrowAltCircleRight size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchoolWaiting;