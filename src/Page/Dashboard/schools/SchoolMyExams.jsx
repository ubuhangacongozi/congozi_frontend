import React, { useState, useEffect } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../Components/LoadingSpinner ";
import Mtn from "../../../assets/MTN.jpg";
import { FaCopy, FaCheck } from "react-icons/fa";
const SchoolMyExams = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage, setAccountsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [valid, setValid] = useState("");
  const [fees, setFees] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [account, setAccount] = useState({ data: [] });
  const [userName, setUserName] = useState("");
  const [phoneUsed, setPhoneUsed] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [uniqueValids, setUniqueValids] = useState([]);
  const [uniqueFees, setUniqueFees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.companyName);
    }
  }, []);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${ApiUrl}/purchases/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = response.data?.data;
      setAccount(Array.isArray(result) ? { data: result } : { data: [result] });
    } catch (error) {
      console.error("Error fetching account data:", error);
      setMessage({
        text: "Error fetching accounts data",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (account.data && account.data.length > 0) {
      const valids = [
        ...new Set(account.data.map((item) => item.itemId?.validIn)),
      ].filter(Boolean);
      setUniqueValids(valids);
      const fees = [...new Set(account.data.map((item) => item.amount))].filter(
        Boolean
      );
      setUniqueFees(fees.sort((a, b) => a - b));
    }
  }, [account.data]);
  useEffect(() => {
    const updateAccountsPerPage = () => {
      setAccountsPerPage(window.innerWidth >= 768 ? 10 : 5);
    };
    updateAccountsPerPage();
    window.addEventListener("resize", updateAccountsPerPage);
    return () => window.removeEventListener("resize", updateAccountsPerPage);
  }, []);
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
  const filteredAccounts = account.data.filter(
    (item) =>
      (valid === "" || item.itemId.validIn?.toString().includes(valid)) &&
      (fees === "" || item.amount?.toString().includes(fees)) &&
      (searchTerm === "" ||
        item.itemId.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemId.validIn?.toString().includes(searchTerm) ||
        item.status?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const indexOfFirstAccount = (currentPage - 1) * accountsPerPage;
  const currentAccounts = filteredAccounts.slice(
    indexOfFirstAccount,
    indexOfFirstAccount + accountsPerPage
  );

  const closePopup = () => {
    setSelectedAccount(null);
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

      const notificationMessage = `Dear Admin, Turakumenyesha ko ${userName} yishyuye konte ${paidItem.title} y'iminsi ${paidItem.validIn} amafaranga ${selectedAccount.amount} Rwf akoresheje telephone ${phoneUsed} ibaruye kuri ${ownerName}. Reba ko wayabonye kuri telephone nimero: 250 783 905 790 maze umuhe uburenganzira kuri iyi purchase Id: ${purchasedDataId}`;
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

  const handleDoAccount = (account) => {
    if (account.accessCode && account.accessCode.length > 0) {
      navigate(`/schools/accessableexams?accessCode=${account.accessCode}`);
    } else {
      console.error("No access code available for this account.");
    }
  };

  const getRemainingDays = (endDate) => {
    if (!endDate) return "N/A";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    return `${diffDays} Days`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString();
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
    <div className="md:p-2 flex gap-2 flex-col">
      <WelcomeDear />
      <div className="flex justify-center items-center gap-4 text-blue-900 font-bold py-2 border bg-gray-100 rounded-md">
        <h1>My Accounts</h1>
      </div>
      {message.text && (
        <div
          className={`p-2 rounded-md ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}
      <div className="grid md:grid-cols-3 grid-cols-1 justify-between items-center md:gap-32 gap-1 px-3 py-4 text-gray-400 text-sx">
        <input
          type="text"
          placeholder="---Shakisha Bukimwe---"
          className="border border-gray-300 rounded px-3 py-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded px-3 py-1 appearance-none bg-white pr-6 outline-none"
          value={valid}
          onChange={(e) => setValid(e.target.value)}
          style={{ backgroundImage: "none" }}
        >
          <option value="">----Iminsi---</option>
          {uniqueValids.map((valid, index) => (
            <option key={index} value={valid}>
              {valid} Days
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded px-3 py-1 appearance-none bg-white pr-6 outline-none"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          style={{ backgroundImage: "none" }}
        >
          <option value="">----Igiciro----</option>
          {uniqueFees.map((fee, index) => (
            <option key={index} value={fee}>
              {fee} Rwf
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-blue-900">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 border text-blue-900 md:text-base text-xs font-bold">
                <th className="text-center p-2 whitespace-nowrap">No.</th>
                <th className="text-center p-2 whitespace-nowrap">Igikorwa</th>
                <th className="text-center p-2 whitespace-nowrap">
                  Izina ry'ikonte
                </th>
                <th className="text-center p-2 whitespace-nowrap">
                  Iminsi izamara
                </th>
                <th className="text-center p-2 whitespace-nowrap">
                  Igihe isabiwe
                </th>
                <th className="text-center p-2 whitespace-nowrap">
                  Izarangira
                </th>
                <th className="text-center p-2 whitespace-nowrap">
                  Igiciro iguhagaze
                </th>
                <th className="text-center p-2 whitespace-nowrap">Imimerere</th>
              </tr>
            </thead>
            <tbody>
              {currentAccounts.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-4 text-red-500 font-semibold"
                  >
                    Ntakonte uragura.
                  </td>
                </tr>
              ) : (
                currentAccounts.map((account, index) => {
                  const endDate = account.endDate
                    ? new Date(account.endDate)
                    : null;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const diffDays = endDate
                    ? Math.ceil(
                        (endDate.setHours(0, 0, 0, 0) - today) /
                          (1000 * 60 * 60 * 24)
                      )
                    : null;

                  const isExpired = diffDays !== null && diffDays < 0;

                  return (
                    <tr
                      key={account._id}
                      className="bg-white border text-blue-900 md:text-base text-xs whitespace-nowrap"
                    >
                      <td className="text-center md:tex-md text-xs py-2 px-4 whitespace-nowrap">
                        {indexOfFirstAccount + index + 1}
                      </td>
                      <td className="text-center p-2 whitespace-nowrap">
                        {isExpired ? (
                          <button
                            className="text-blue-500 underline py-1 px-3"
                            disabled
                          >
                            -
                          </button>
                        ) : account.status === "pending" ? (
                          <button
                            title="Pay"
                            onClick={() => setSelectedAccount(account)}
                            className="text-Total text-sm bg-blue-300 rounded-md py-0 px-3 flex hover:bg-green-300 items-center gap-2"
                          >
                            Soza kwishyura
                          </button>
                        ) : account.status === "complete" ? (
                          <button
                            onClick={() => handleDoAccount(account)}
                            className="text-Total text-sm bg-green-300 rounded-md py-0 px-3 flex hover:bg-blue-300 items-center gap-2"
                          >
                            Koresha Konte
                          </button>
                        ) : (
                          <button className="bg-gray-400 text-Total rounded-md py-0 px-3 cursor-not-allowed">
                            Tegereza
                          </button>
                        )}
                      </td>
                      <td className="text-start md:tex-md text-xs px-1 whitespace-nowrap">
                        {account.itemId?.title}
                      </td>
                      <td className="text-start md:tex-md text-xs p-2 whitespace-nowrap">
                        {account.itemId?.validIn} Days
                      </td>
                      <td className="text-start md:tex-md text-xs px-2 whitespace-nowrap">
                        {getCurrentDate()}
                      </td>
                      <td className="text-start md:tex-md text-xs px-2 whitespace-nowrap">
                        {getRemainingDays(account.endDate)}
                      </td>
                      <td className="text-start md:tex-md text-xs px-2 whitespace-nowrap">
                        {account.amount} Rwf
                      </td>
                      <td className="text-start md:tex-md text-xs px-2 whitespace-nowrap">
                        {account.status}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-around md:gap-[700px] gap-[120px] md:pb-0 pt-3 px-10">
          <div>
            <button
              className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaArrowAltCircleLeft size={24} />
              Ibibanza
            </button>
          </div>
          <div>
            <button
              className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Ibikurikira
              <FaArrowAltCircleRight size={24} />
            </button>
          </div>
        </div>
      )}
      {selectedAccount && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-white rounded-lg shadow-lg md:max-w-2xl w-full text-center relative p-4">
            <button
              className="absolute top-1 right-1 text-xl bg-white text-red-700 border-2 border-white rounded-full w-8 h-8 flex justify-center"
              onClick={closePopup}
            >
              ✖
            </button>
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
                  {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
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
              <div className="w-full text-center">
                <div className="flex flex-col justify-center items-center">
                  <label htmlFor="phone" className="text-start">
                    Nimero wakoresheje wishyura
                  </label>
                  <input
                    type="number"
                    placeholder="Urugero: 0786731449"
                    className="border border-gray-400 rounded px-2 py-1 md:w-1/2 w-full mt-2"
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
                </div>
                <div className="flex flex-col justify-center items-center">
                  <label htmlFor="phone" className="text-start">
                    Amazina ibaruyeho
                  </label>
                  <input
                    type="text"
                    placeholder="Urugero: Samuel NKOTANYI"
                    className="border border-gray-400 rounded px-2 py-1 md:w-1/2 w-full mt-2"
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
                </div>
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
                      <span className="ml-2">Iyubaka...</span>
                    </>
                  ) : (
                    "Menyesha Ko Wishyuye"
                  )}
                </button>
                <p className="text-center py-2 font-medium ">
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
        </div>
      )}
    </div>
  );
};

export default SchoolMyExams;
