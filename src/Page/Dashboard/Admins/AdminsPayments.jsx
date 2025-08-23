import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PAYMENTS_PER_PAGE = 4;

const AdminsPayments = () => {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingId, setLoadingId] = useState(null);
  const [payerFilter, setPayerFilter] = useState("");
  const [paymentIdFilter, setPaymentIdFilter] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const ApiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchPayments = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${ApiUrl}/purchases/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      const mapped = data.data.map((item) => {
        let payerName = "Unknown";
        if (item.paidBy) {
          if (item.paidBy.fName && item.paidBy.lName) {
            payerName = `${item.paidBy.fName} ${item.paidBy.lName}`;
          } else if (item.paidBy.companyName) {
            payerName = item.paidBy.companyName;
          }
        }

        return {
          id: item._id,
          payer: payerName,
          amount: `RWF ${item.amount}`,
          startedOn: item.startDate
            ? new Date(item.startDate).toISOString().split("T")[0]
            : "Since Approved",
          expiresOn: item.endDate
            ? new Date(item.endDate).toISOString().split("T")[0]
            : "No expiry",
          purchasedItem: item.itemType,
          status:
            item.status === "complete"
              ? "Completed"
              : item.status === "waitingConfirmation"
              ? "Waiting"
              : item.status === "expired"
              ? "Consumed"
              : "Pending",
        };
      });
      setPayments(mapped);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/kwinjira");
      return;
    }

    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }

    fetchPayments();
  }, [navigate]);

  const handleConfirm = async (id) => {
    const token = localStorage.getItem("token");
    setLoadingId(id);
    try {
      await axios.put(
        `${ApiUrl}/purchases/${id}`,
        { status: "complete" },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchPayments();
    } catch (err) {
      console.error("Failed to confirm payment:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) {
      return;
    }

    const token = localStorage.getItem("token");
    setLoadingId(id);
    try {
      await axios.delete(`${ApiUrl}/purchases/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchPayments();
    } catch (err) {
      console.error("Failed to delete payment:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchPayer = payerFilter
      ? payment.payer.toLowerCase().includes(payerFilter.toLowerCase())
      : true;

    const matchPaymentId = paymentIdFilter
      ? payment.id.toLowerCase().includes(paymentIdFilter.toLowerCase())
      : true;

    return matchPayer && matchPaymentId;
  });

  const indexOfLastPayment = currentPage * PAYMENTS_PER_PAGE;
  const indexOfFirstPayment = indexOfLastPayment - PAYMENTS_PER_PAGE;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  const totalPages = Math.ceil(filteredPayments.length / PAYMENTS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const isSuperAdmin = currentUser?.role === "supperAdmin";

  return (
    <div className="md:px-6 py-6 px-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage All Payments</h2>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by Payer"
          value={payerFilter}
          onChange={(e) => setPayerFilter(e.target.value)}
          className="px-3 py-2 border rounded-md w-full md:w-1/3"
        />
        <input
          type="text"
          placeholder="Filter by Payment ID"
          value={paymentIdFilter}
          onChange={(e) => setPaymentIdFilter(e.target.value)}
          className="px-3 py-2 border rounded-md w-full md:w-1/3"
        />
      </div>

      <div className="overflow-auto scrollbar-hide rounded-lg shadow border border-blue-900">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-1 whitespace-nowrap">Actions</th>
              <th className="px-6 py-1 whitespace-nowrap">Payer</th>
              <th className="px-6 py-1 whitespace-nowrap">Amount</th>
              <th className="px-6 py-1 whitespace-nowrap">Purchased Item</th>
              <th className="px-6 py-1 whitespace-nowrap">Paid On</th>
              <th className="px-6 py-1 whitespace-nowrap">Expires On</th>
              <th className="px-6 py-1 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((payment) => (
              <tr key={payment.id} className="border-t hover:bg-gray-50">
                <td className="hidden">{payment.id}</td>
                <td className="px-6 py-1 whitespace-nowrap flex gap-2">
                  {payment.status === "Waiting" && (
                    <button
                      onClick={() => handleConfirm(payment.id)}
                      disabled={loadingId === payment.id}
                      className={`text-Total text-sm bg-blue-300 rounded-md py-0 px-3 flex hover:bg-green-300 items-center gap-2 ${
                        loadingId === payment.id ? "opacity-50" : ""
                      }`}
                    >
                      {loadingId === payment.id ? "Confirming..." : "Confirm"}
                    </button>
                  )}
                  
                  {(payment.status === "Consumed" || payment.status === "Pending") && isSuperAdmin && (
                    <button
                      onClick={() => handleDelete(payment.id)}
                      disabled={loadingId === payment.id}
                      className={`text-Total text-sm bg-red-300 rounded-md py-0 px-3 flex hover:bg-blue-300 items-center gap-2 ${
                        loadingId === payment.id ? "opacity-50" : ""
                      }`}
                    >
                      {loadingId === payment.id ? "Deleting..." : "Delete"}
                    </button>
                  )}

                  {payment.status === "Completed" && (
                    <span className="text-Total text-sm bg-gray-300 rounded-md py-0 px-3 flex items-center gap-2 cursor-not-allowed">
                      No action
                    </span>
                  )}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">{payment.payer}</td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {payment.amount}
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-center">
                  {payment.purchasedItem}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {payment.startedOn}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {payment.expiresOn}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      payment.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "Pending"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-Total text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-Total text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminsPayments;