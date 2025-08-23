import React, { useState, useEffect } from "react";
import AccountCard from "../../../Components/Cards/AdminCards/AccountCard";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import Mtn from "../../../assets/MTN.jpg";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../Components/LoadingSpinner ";
import { FaCopy, FaCheck } from "react-icons/fa";
const SchoolUnpaid = () => {
  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const [currentPage, setCurrentPage] = useState(0);
  const [accountsPerPage, setAccountsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [validIn, setValidIn] = useState("");
  const [fees, setFees] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");
  const [account, setAccount] = useState({ data: [] });
  const [userName, setUserName] = useState("");
  const [phoneUsed, setPhoneUsed] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const validatePhone = (phone) => {
    const regex = /^(078|079)\d{7}$/;
    return regex.test(phone);
  };

  const validateName = (name) => {
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length === 1) {
      return /^[a-zA-Z]{2,}$/.test(nameParts[0]);
    }
    return (
      nameParts.length >= 2 &&
      nameParts.every((part) => /^[a-zA-Z]{2,}$/.test(part))
    );
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.companyName);
    }
  }, []);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${ApiUrl}/purchases/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccount(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({
        text: "Error fetching unpaid accounts data",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
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
    (item) =>
      (validIn === "" || item.itemId.validIn?.toString().includes(validIn)) &&
      (fees === "" || item.itemId.fees?.toString().includes(fees)) &&
      (searchTerm === "" ||
        item.itemId.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemId.validIn?.toString().includes(searchTerm) ||
        item.itemId.fees?.toString().includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const currentAccounts = filteredAccounts.slice(
    currentPage * accountsPerPage,
    (currentPage + 1) * accountsPerPage
  );

  const handlePurchaseClick = (account) => {
    setSelectedAccount(account);
    setPaymentStep("payment");
  };

  const closePopup = () => {
    setSelectedAccount(null);
    setPaymentStep("confirmation");
    setPhoneUsed("");
    setOwnerName("");
  };

  const handleNotify = async () => {
    if (!phoneUsed || !ownerName) {
      setMessage({
        text: "Uzuza nimero ya telephone n'amazina yo ibaruyeho",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 9000);
      return;
    }

    if (!validatePhone(phoneUsed)) {
      setMessage({
        text: "Iyi telephone ntikorana na MoMo Pay. Koresha 078 cyangwa 079.",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 9000);
      return;
    }

    if (!validateName(ownerName)) {
      setMessage({
        text: ownerName.includes(" ")
          ? `Niba Iyi ntelephone ${phoneUsed} ibaruye kumazina abiri yandike neza`
          : "Andika izina ryanyayo",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 9000);
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const purchasedDataId = selectedAccount._id;
      const paidItem = selectedAccount.itemId;

      const notificationMessage = `Dear Admin, Turakumenyesha ko ${userName} yishyuye konte ${paidItem.title} y'iminsi ${paidItem.validIn} amafaranga ${selectedAccount.amount} Rwf akoresheje telephone ${phoneUsed} ibaruye kuri ${ownerName}. Reba ko wayabonye kuri telephone nimero: 250 783 905 790 maze umuhe uburenganzira kuri iyi purchase Id: ${purchasedDataId}. Murakoze!!!!!`;
      const noteTitle = `${userName} requests for approval`;

      await axios.post(
        `${ApiUrl}/notification`,
        {
          message: notificationMessage,
          noteTitle: noteTitle,
          purchasedItem: purchasedDataId,
          ownerName: userName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const purchaseId = selectedAccount._id;

      await axios.put(
        `${ApiUrl}/purchases/${purchaseId}`,
        { status: "waitingConfirmation" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({
        text: "Kumenyekanisha ubwishyu byakozwe neza!",
        type: "success",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 9000);

      closePopup();
      fetchData();
    } catch (error) {
      setMessage({
        text: "Kumenyekanisha ubwishyu byanze. Wongera ugerageze.",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 9000);
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy payment code
  const copyPaymentCode = () => {
    const paymentCode = `*182*8*1*072255*${selectedAccount.amount}#`;
    navigator.clipboard
      .writeText(paymentCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  return (
    <div className="flex flex-col justify-center items-center md:px-5 gap-1 bg-white md:p-2">
      <WelcomeDear />
      <div className="grid md:grid-cols-3 grid-cols-2 justify-between items-center md:gap-32 gap-1 px-3 py-4">
        <input
          type="text"
          placeholder="---Iminsi---"
          value={validIn}
          onChange={(e) => setValidIn(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer"
        />
        <input
          type="text"
          placeholder="---Igiciro---"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer"
        />
        <div className="w-full px-3 md:flex justify-center items-center hidden">
          <input
            type="search"
            placeholder="Shaka konte n'igiciro cg iminsi"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-blue-500 p-2 rounded-xl w-full"
          />
        </div>
      </div>

      <div className="w-full px-3 pb-3 flex justify-center items-center md:hidden">
        <input
          type="search"
          placeholder="Shaka konte n'igiciro cg iminsi"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl w-full"
        />
      </div>
      {message.text && (
        <div
          className={`flex justify-center w-[100%] z-50 p-4 rounded-md shadow-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          <div className="flex items-center">
            {message.type === "success" ? (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}
      {filteredAccounts.length === 0 ? (
        <p className="text-center py-4 text-red-500">
          Ntakonte itishyuye ufite
        </p>
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
                onPurchase={() => handlePurchaseClick(account)}
                icon={<FaHandHoldingDollar />}
                button={"Ishyura"}
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
                currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
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
                currentPage === totalPages - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
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
      {selectedAccount && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-white rounded-lg shadow-lg md:max-w-4xl w-full text-center relative">
            <button
              className="absolute top-1 right-1 text-xl bg-white text-red-700 border-2 border-white rounded-full w-8 h-8 flex justify-center"
              onClick={closePopup}
            >
              ✖
            </button>
            {paymentStep === "confirmation" ? (
              <></>
            ) : (
              <div className="flex md:flex-row flex-col md:gap-6 gap-1">
                <div className="text-left md:w-96">
                  <ul className="md:space-y-6 space-y-2 bg-gray-200 h-full p-4">
                    <li className="text-blue-900 font-bold">
                      <input type="radio" name="payment" checked readOnly /> MTN
                      Mobile Money
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col justify-center px-3 py-2">
                  <p className="text-start pr-4">
                    Kanda ino mibare kuri telefone yawe ukoreshe SIM kadi ya MTN
                    maze wishyure kuri:{" "}
                    <span className="text-md font-semibold text-yellow-700">
                      EXPERT TECHNICAL UNITY Limited.
                    </span>
                    <span className="ml-2">
                      Maze uhabwe kode ifungura konte yawe.
                    </span>
                  </p>
                  <p className="flex justify-center md:py-6 py-4 font-bold items-center">
                    <img src={Mtn} alt="" className="w-10 h-6 pr-3" />
                    *182*8*1*
                    <span className="bg-green-400/20 border border-green-600">
                      072255
                    </span>
                    *{selectedAccount.amount}#
                    <button
                      onClick={copyPaymentCode}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      title="Copy payment code"
                    >
                      {copied ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaCopy />
                      )}
                    </button>
                  </p>
                  <p className="text-md text-Total pt-4 font-semibold">
                    Tanga amakuru kunyemezabwishyu yawe
                  </p>
                  <p className="pb-4">
                    Ukeneye ubufasha hamagara:{" "}
                    <span className="text-md font-bold text-yellow-700">
                      0783905790
                    </span>
                  </p>
                  <div className="w-full text-start">
                    <label htmlFor="phone">Nimero wakoresheje wishyura</label>
                    <input
                      type="number"
                      placeholder="Urugero: 0786731449"
                      className="border border-gray-400 rounded px-2 py-1 w-full mt-2"
                      value={phoneUsed}
                      onChange={(e) => setPhoneUsed(e.target.value)}
                      maxLength="10"
                      required
                    />
                    {phoneUsed && !validatePhone(phoneUsed) && (
                      <p className="text-red-500 text-sm mt-1">
                        Koresha nimero ya MTN itangirira na 078 cyangwa 079
                      </p>
                    )}
                    <label htmlFor="phone" className="mt-2">
                      Amazina ibaruyeho
                    </label>
                    <input
                      type="text"
                      placeholder="Urugero: Samuel NKOTANYI"
                      className="border border-gray-400 rounded px-2 py-1 w-full mt-2"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                    {ownerName && !validateName(ownerName) && (
                      <p className="text-red-500 text-sm mt-1">
                        {ownerName.includes(" ")
                          ? `Niba Iyi ntelephone ${phoneUsed} ibaruye kumazina abiri yandike neza`
                          : "Andika izina ryanyayo"}
                      </p>
                    )}
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mt-4 w-full flex justify-center items-center"
                      onClick={handleNotify}
                      disabled={
                        isLoading ||
                        !validatePhone(phoneUsed) ||
                        !validateName(ownerName)
                      }
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner />
                        </>
                      ) : (
                        "Menyesha Ko Wishyuye"
                      )}
                    </button>
                    <p className="text-start py-2 font-medium">
                      Nyuma yo kumenyekanisha ko wishyuye{" "}
                      <span className="text-Total text-md font-semibold">
                        muminota 5
                      </span>{" "}
                      urahabwa ubutumwa{" "}
                      <span className="text-Total text-md font-semibold">
                        kuri sisiteme hejuru
                      </span>{" "}
                      bukwemerera{" "}
                      <span className="text-Total text-md font-semibold">
                        kugura konte
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolUnpaid;
