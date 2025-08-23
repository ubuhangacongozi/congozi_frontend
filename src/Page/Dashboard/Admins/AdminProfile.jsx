import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import LoadingSpinner from "../../../Components/LoadingSpinner ";
const AdminProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    phone: "",
    email: "",
    idCard: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fName: user.fName || "",
        lName: user.lName || "",
        phone: user.phone || "",
        email: user.email || "",
        idCard: user.idCard || "",
        address: user.address || "",
      });
      setPreview(user.profile || null);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (showPasswordForm) {
      setPasswordData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validatePasswordChange = () => {
    if (!passwordData.currentPassword) {
      toast.error("shyiramo Ijambobanga ryakera");
      return false;
    }
    if (!passwordData.newPassword) {
      toast.error("Please enter a Ijambobanga rishya");
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Ijambobanga rishyas ntirihura");
      return false;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return toast.error("User not logged in");

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (showPasswordForm) {
        if (!validatePasswordChange()) return;
        try {
          await axios.post(
            `${ApiUrl}/users/verify-password`,
            {
              userId: user._id,
              password: passwordData.currentPassword,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          toast.error("Ijambobanga ryakera is incorrect");
          return;
        }
        const form = new FormData();
        form.append("password", passwordData.newPassword);

        const response = await axios.put(`${ApiUrl}/users/${user._id}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage("Password updated successfully");
        setMessageType("success");

        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }, 1000);
      } else {
        const form = new FormData();
        for (let key in formData) {
          if (formData[key]) {
            form.append(key, formData[key]);
          }
        }
        if (profile) {
          form.append("profile", profile);
        }

        const response = await axios.put(`${ApiUrl}/users/${user._id}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedUser = response.data.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setMessage("Profile updated successfully");
        setMessageType("success");

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error?.response?.data?.message || "Failed to update information"
      );
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg md:p-1 p-6 w-full max-w-xl text-center">
        {message && (
          <div
            className={`text-sm mb-3 px-2 py-1 rounded ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <h2 className="md:text-xs text-md font-bold text-blue-900 mb-1">
          {showPasswordForm ? "Change Password" : "Your Profile"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 justify-center items-center"
        >
          {!showPasswordForm ? (
            <>
              <div className="relative w-24 h-24 mx-auto mb-1">
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full border border-gray-300"
                  />
                )}
                <label className="absolute bottom-0 right-0 bg-white p-[6px] rounded-full shadow cursor-pointer">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <input
                type="text"
                name="fName"
                value={formData.fName}
                onChange={handleChange}
                placeholder="First Name"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
              />
              <input
                type="text"
                name="lName"
                value={formData.lName}
                onChange={handleChange}
                placeholder="Last Name"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
              />
              <input
                type="text"
                name="idCard"
                value={formData.idCard}
                onChange={handleChange}
                placeholder="ID Card"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
              />
            </>
          ) : (
            <>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handleChange}
                placeholder="Ijambobanga ryakera"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
                required
              />
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handleChange}
                placeholder="Ijambobanga rishya"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Ijambobanga rishya"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
                required
              />
            </>
          )}

          <div className="pt-4 flex md:text-xs text-md flex-row justify-center gap-3 md:gap-10 items-center">
            <button
              type="submit"
              className="bg-blue-900 text-white px-6 py-1 rounded hover:bg-blue-800 mb-3"
            >
              {showPasswordForm ? (
                <>
                  {isLoading ? (
                    <>
                      <LoadingSpinner size={5} strokeWidth={2} />
                    </>
                  ) : (
                    <>Update Password</>
                  )}
                </>
              ) : (
                <>
                  {isLoading ? (
                    <>
                      <LoadingSpinner size={5} strokeWidth={2} />
                    </>
                  ) : (
                    <>Save Changes</>
                  )}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowPasswordForm((prev) => !prev);
                setPasswordData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className="text-blue-600 hover:text-yellow-600"
            >
              {showPasswordForm ? "Back to Profile" : "Change Password?"}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminProfile;
