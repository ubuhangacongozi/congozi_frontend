import React, { useState, useEffect } from "react";
import ExamsCard from "../../../Components/Cards/ExamsCard";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import Mtn from "../../../assets/MTN.jpg";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import axios from "axios";
import LoadingSpinner from "../../../Components/LoadingSpinner ";
import { FaCopy, FaCheck } from "react-icons/fa";
const StudentUnpaid = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [examsPerPage, setExamsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [fees, setFees] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");
  const [exam, setExam] = useState({ data: [] });
  const [userName, setUserName] = useState("");
  const [phoneUsed, setPhoneUsed] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueFees, setUniqueFees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(`${user.fName} ${user.lName}`);
    }
  }, []);

  // Fetch unpaid exams
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${ApiUrl}/purchases/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExam(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({
        text: "Error fetching unpaid exams data",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (exam.data && exam.data.length > 0) {
      const types = [
        ...new Set(exam.data.map((item) => item.itemId?.type)),
      ].filter(Boolean);
      setUniqueTypes(types);

      const fees = [
        ...new Set(exam.data.map((item) => item.itemId?.fees)),
      ].filter(Boolean);
      setUniqueFees(fees.sort((a, b) => a - b));
    }
  }, [exam.data]);

  // Adjust items per page on screen resize
  useEffect(() => {
    const updateExamsPerPage = () => {
      setExamsPerPage(window.innerWidth >= 768 ? 6 : 2);
    };
    updateExamsPerPage();
    window.addEventListener("resize", updateExamsPerPage);
    return () => window.removeEventListener("resize", updateExamsPerPage);
  }, []);

  // Validate phone number (MTN Rwanda)
  const validatePhone = (phone) => {
    const regex = /^(078|079)\d{7}$/;
    return regex.test(phone);
  };

  // Validate name (allow first name only, but validate both if space included)
  const validateName = (name) => {
    const nameParts = name.trim().split(/\s+/);

    // Allow single name (first name only)
    if (nameParts.length === 1) {
      return /^[a-zA-Z]{2,}$/.test(nameParts[0]);
    }

    // If multiple names provided, validate all parts
    return (
      nameParts.length >= 2 &&
      nameParts.every((part) => /^[a-zA-Z]{2,}$/.test(part))
    );
  };

  // Filter exams based on search and filters
  const filteredExams = exam.data.filter(
    (item) =>
      (type === "" ||
        item.itemId.type?.toLowerCase().includes(type.toLowerCase())) &&
      (fees === "" || item.itemId.fees?.toString().includes(fees)) &&
      (searchTerm === "" ||
        item.itemId.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemId.fees?.toString().includes(searchTerm) ||
        item.itemId.number?.includes(searchTerm))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const currentExams = filteredExams.slice(
    currentPage * examsPerPage,
    (currentPage + 1) * examsPerPage
  );

  const handlePurchaseClick = (exam) => {
    setSelectedExam(exam);
    setPaymentStep("payment");
  };

  const closePopup = () => {
    setSelectedExam(null);
    setPaymentStep("confirmation");
    setPhoneUsed("");
    setOwnerName("");
  };

  const handleNotify = async () => {
    // Validate inputs
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
      const purchasedDataId = selectedExam._id;
      const paidItem = selectedExam.itemId;

      const notificationMessage = `Dear Admin, ${userName} yishyuye ikizamini cya ${paidItem.title} (${paidItem.type}) amafaranga ${paidItem.fees} Rwf akoresheje telephone ${phoneUsed} (${ownerName}). Reba ko wayabonye kuri MoMo pay ya 072255 maze umuhe uburenganzira kuri iyi purchase ID: ${purchasedDataId}. Murakoze!!!!!`;

      await axios.post(
        `${ApiUrl}/notification`,
        {
          message: notificationMessage,
          noteTitle: `${userName} requests for approval`,
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

      await axios.put(
        `${ApiUrl}/purchases/${purchasedDataId}`,
        { status: "waitingConfirmation" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({
        text: "Kwishyura byakunze neza! Tegereza iminota mike kugirango ukorwe ikizamini.",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text: "Kwishyura byanze. Wongera gerageza.",
        type: "error",
      });
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
      closePopup();
      fetchData();
      setTimeout(() => setMessage({ text: "", type: "" }), 9000);
    }
  };

  // Copy payment code
  const copyPaymentCode = () => {
    const paymentCode = `*182*8*1*072255*${selectedExam.itemId.fees}#`;
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

      {/* Filters */}
      <div className="grid md:grid-cols-3 grid-cols-2 justify-between items-center md:gap-32 gap-1 px-3 py-4">
        <select
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">----Ubwoko----</option>
          {uniqueTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
        >
          <option value="">----Igiciro----</option>
          {uniqueFees.map((fee, index) => (
            <option key={index} value={fee}>
              {fee} Rwf
            </option>
          ))}
        </select>
        <div className="w-full px-3 md:flex justify-center items-center hidden">
          <input
            type="search"
            placeholder="---Ubwoko, igiciro, nimero byikizami---"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-blue-500 p-2 rounded-xl w-full"
          />
        </div>
      </div>

      <div className="w-full px-3 pb-3 flex justify-center items-center md:hidden">
        <input
          type="search"
          placeholder="---Ubwoko, igiciro, nimero byikizami---"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl w-full"
        />
      </div>

      {message.text && (
        <div
          className={`p-2 rounded-md w-full ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Exam Cards */}
      {filteredExams.length === 0 ? (
        <p className="text-center py-4 text-red-500">
          Nta kizamini kitishyuye ufite
        </p>
      ) : (
        <div className="grid md:grid-cols-3 w-full gap-4 md:gap-3 py-1">
          {currentExams.map((exam, index) => {
            const isLearn = exam.itemId.type?.toLowerCase().includes("kwiga");
            const buttonColor = isLearn ? "bg-yellow-500" : "bg-green-500";
            return (
              <ExamsCard
                key={index}
                title={exam.itemId.title}
                number={exam.itemId.number}
                fees={exam.itemId.fees}
                type={exam.itemId.type}
                onPurchase={() => handlePurchaseClick(exam)}
                icon={<FaHandHoldingDollar />}
                button={"Ishyura"}
                buttonColor={buttonColor}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
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
              Ibibanza
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
              Ibikurikira
              <FaArrowAltCircleRight size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Payment Popup */}
      {selectedExam && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-white rounded-lg shadow-lg md:max-w-4xl w-full text-center relative">
            <button
              className="absolute top-1 right-1 text-xl bg-white text-red-700 border-2 border-white rounded-full w-8 h-8 flex justify-center"
              onClick={closePopup}
            >
              ✖
            </button>
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
                    Maze uhabwe kode ifungura ikizamini cyawe.
                  </span>
                </p>
                <p className="flex justify-center md:py-6 py-4 font-bold items-center">
                  <img src={Mtn} alt="" className="w-10 h-6 pr-3" />
                  *182*8*1*
                  <span className="bg-green-400/20 border border-green-600">
                    072255
                  </span>
                  *{selectedExam.itemId.fees}#
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
                  <label>Nimero wakoresheje wishyura</label>
                  <input
                    type="number"
                    placeholder="0781234567"
                    className="border border-gray-400 rounded px-2 py-1 w-full mt-2"
                    value={phoneUsed}
                    onChange={(e) => setPhoneUsed(e.target.value)}
                    maxLength="10"
                  />
                  {phoneUsed && !validatePhone(phoneUsed) && (
                    <p className="text-red-500 text-sm mt-1">
                      Koresha nimero ya MTN itangirira na 078 cyangwa 079
                    </p>
                  )}

                  <label className="mt-2">
                    Amazina yanditse kuri telephone
                  </label>
                  <input
                    type="text"
                    placeholder="Urugero: Gandi Stephen"
                    className="border border-gray-400 rounded px-2 py-1 w-full mt-2"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                  {ownerName && !validateName(ownerName) && (
                    <p className="text-red-500 text-sm mt-1">
                      {ownerName.includes(" ")
                        ? `Niba Iyi ntelephone ${phoneUsed} ibaruye kumazina abiri yandike neza`
                        : "Andika izina ryanyayo"}
                    </p>
                  )}

                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mt-4 w-full flex justify-center items-center gap-2"
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
                      {selectedExam.itemId.type}{" "}
                    </span>{" "}
                    ikizamini
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentUnpaid;
