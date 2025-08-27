import React, { useState, useEffect } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { BsCart } from "react-icons/bs";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import AccountCard from "../../../Components/Cards/AdminCards/AccountCard";
import CompanyPopup from "../../../Components/Cards/CompanyPopup";
import axios from "axios";
const SchoolDemo = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [accountsPerPage, setAccountsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [valid, setValid] = useState("");
  const [fees, setFees] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const [account, setAccount] = useState({ data: [] });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${ApiUrl}/accounts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccount(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const accounts = account.data || [];

  useEffect(() => {
    const updateAccountsPerPage = () => {
      setAccountsPerPage(window.innerWidth >= 768 ? 6 : 2);
    };
    updateAccountsPerPage();
    window.addEventListener("resize", updateAccountsPerPage);
    return () => window.removeEventListener("resize", updateAccountsPerPage);
  }, []);

  const filteredAccounts = accounts.filter(
    (account) =>
      (valid === "" ||
        account.validIn.toLowerCase().includes(valid.toLowerCase())) &&
      (fees === "" || account.fees.toString().includes(fees)) &&
      (searchTerm === "" ||
        account.validIn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.fees.toString().includes(searchTerm) ||
        account.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const currentAccounts = filteredAccounts.slice(
    currentPage * accountsPerPage,
    (currentPage + 1) * accountsPerPage
  );

  const handlePurchaseClick = (account) => {
    setSelectedAccount(account);
    setPaymentStep("confirmation");
  };

  const closePopup = () => {
    setSelectedAccount(null);
    setPaymentStep("confirmation");
  };

  return (
    <div className="flex flex-col justify-center items-center md:px-5 gap-1 bg-white md:p-2 ">
      <WelcomeDear />

      <div className="grid md:grid-cols-3 grid-cols-2 justify-between items-center md:gap-12 gap-1 px-3 py-4">
        <input
          type="text"
          placeholder="---iminsi---"
          value={valid}
          onChange={(e) => setValid(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer text-bold"
        />
        <input
          type="text"
          placeholder="---igiciro---"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer"
        />
        <div className="w-full px-3 md:flex justify-center items-center hidden md:bloc">
          <input
            type="search"
            placeholder="---igiciro, nimero byikizami---"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-blue-500 p-2 rounded-xl w-full"
          />
        </div>
      </div>

      <div className="w-full px-3 pb-3 flex justify-center items-center md:hidden">
        <input
          type="search"
          placeholder="---iminsi, igiciro, umutwe byikizami---"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl w-full"
        />
      </div>

      {filteredAccounts.length === 0 ? (
        <p className=" py-4 text-red-500">Not data found</p>
      ) : (
        <div className="grid md:grid-cols-3 w-full gap-4 md:gap-3 py-1">
          {currentAccounts.map((account, index) => {
            const buttonColor =
              account.validIn >= 30 ? "bg-green-500" : "bg-yellow-500";
            return (
              <AccountCard
                key={index}
                {...account}
                onPurchase={() => handlePurchaseClick(account)}
                icon={<BsCart />}
                button={"Gura Konte"}
                buttonColor={buttonColor}
              />
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-around md:gap-[700px] gap-[110px] md:pb-0 pt-3 px-10 ">
          <button
            className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
              currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            <FaArrowAltCircleLeft size={24} />
            Izibanza
          </button>
          <button
            className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
              currentPage === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Izikurikira <FaArrowAltCircleRight size={24} />
          </button>
        </div>
      )}

      {selectedAccount && <CompanyPopup onClose={closePopup} />}
    </div>
  );
};

export default SchoolDemo;
