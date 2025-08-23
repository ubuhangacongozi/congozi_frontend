import React, { useState, useEffect } from "react";
import { GoPaperclip } from "react-icons/go";
import { ImUserPlus } from "react-icons/im";
import Police from "../../assets/Policelogo.png";
import HalfInput from "../../Components/Inputs/Studentnputs/HalfInput";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/LoadingSpinner ";

const Register = () => {
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    idCard: "",
    profile: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (apiError || apiSuccess) {
      setApiError(null);
      setApiSuccess(null);
    }

    if (name === "profile") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profile: file }));
      if (file) {
        const previewURL = URL.createObjectURL(file);
        setSelectedImage(previewURL);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateInputs = () => {
    let newErrors = {};

    if (!formData.fName.trim()) {
      newErrors.fName = "Dukeneye kumenya izina rya mbere rirakenewe";
    }

    if (!formData.lName.trim()) {
      newErrors.lName = "Dukeneye kumenya izina rya kabiri rirakenewe";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Dukeneye kumenya aho uherereye birakenewe";
    }

    if (!formData.phone) {
      newErrors.phone = "Dukeneye kumenya numero ya telefone irakenewe";
    } else if (
      !/^(078|079|073|072)\d{7}$/.test(formData.phone) ||
      formData.phone.length !== 10
    ) {
      newErrors.phone =
        "Numero ya telefone itangirwa na 078, 079, 073, cg 072 Kandi ntigomba kuba iri munsi cg hejuru y'imibare 10";
    }

    if (!formData.password) {
      newErrors.password = "Ijambobanga rirakenewe";
    } else if (formData.password.length < 6) {
      newErrors.password = "Ijambobanga rigomba kuba nibura imibare 6";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Ijambobanga ntirihuye";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email ntabwo ari yo";
    }

    if (formData.idCard && !/^\d{16}$/.test(formData.idCard)) {
      newErrors.idCard = "Irangamuntu igomba kuba imibare 16";
    }

    if (formData.profile && !formData.profile.type.startsWith("image/")) {
      newErrors.profile = "Hitamo ifoto gusa";
    }

    if (!agreedToTerms) {
      newErrors.terms = "Ugomba kwemera amategeko n'amabwiriza";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const notifySuccess = (msg) =>
    toast.success(msg, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const notifyError = (msg) =>
    toast.error(msg, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);

    if (!validateInputs()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "confirmPassword" && value !== "" && value !== null) {
        data.append(key, value);
      }
    });

    try {
      setIsLoading(true);
      const res = await axios.post(`${ApiUrl}/users`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setApiSuccess(res.data.message);
      notifySuccess(res.data.message);

      setTimeout(() => {
        setFormData({
          fName: "",
          lName: "",
          address: "",
          phone: "",
          email: "",
          password: "",
          confirmPassword: "",
          idCard: "",
          profile: null,
        });
        setSelectedImage(null);
        setAgreedToTerms(false);
        navigate("/kwinjira");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Habaye ikibazo mugukora konti";
      setApiError(errorMessage);
      notifyError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileTrigger = () => {
    document.getElementById("file-upload").click();
  };

  return (
    <div className="pt-16">
          <div className="bg-black/20 flex justify-center items-center p-1 rounded-sm">
            <h1 className="md:text-xl text-sm text-Total font-semibold font-Roboto">
              Fungura konti kuri Congozi Expert
            </h1>
          </div>
          <div className="flex md:flex-row flex-col">
            <div className="flex justify-center items-center bg-Total md:w-[45%]">
              <img src={Police} alt="" className="h-[200px]" />
            </div>

            <div className="border border-b-blue-500 border-r-blue-500 rounded-t-md w-full">
              {/* API Response Messages */}
              {apiError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2">
                  <p>{apiError}</p>
                </div>
              )}
              {apiSuccess && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2 mb-2">
                  <p>{apiSuccess}</p>
                </div>
              )}

              <div className="bg-Passed flex justify-center items-center gap-3 py-1 rounded-r-md">
                <div className="bg-white px-2 rounded-full">
                  <p className="text-lg text-Passed">+</p>
                </div>
                <h4 className="text-white text-xl font-semibold">
                  Kwiyandikisha
                </h4>
              </div>

              {/* Validation Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2">
                  <p className="font-medium">Uzuza neza:</p>
                  <ol className="list-decimal pl-5 mt-1">
                    {Object.values(errors).map((error, index) => (
                      <li key={index} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <form
                className="w-full flex flex-col gap-4"
                onSubmit={handleSubmit}
              >
                <div className="flex md:flex-row flex-col gap-1 pt-1">
                  <HalfInput
                    label="Izina rya mbere"
                    name="fName"
                    value={formData.fName}
                    onChange={handleInputChange}
                    required
                    error={errors.fName}
                  />
                  <HalfInput
                    label="Izina rya kabiri"
                    name="lName"
                    value={formData.lName}
                    onChange={handleInputChange}
                    required
                    error={errors.lName}
                  />
                </div>
                <div className="flex md:flex-row flex-col gap-1">
                  <HalfInput
                    label="Aho uherereye"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    error={errors.address}
                  />
                  <HalfInput
                    label="Telefone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0781234567 cg 0721234567"
                    required
                    error={errors.phone}
                    maxLength="10"
                  />
                </div>
                <div className="flex md:flex-row flex-col gap-1">
                  <HalfInput
                    label="Ijambobanga"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    error={errors.password}
                  />
                  <HalfInput
                    label="Risubiremo"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    error={errors.confirmPassword}
                  />
                </div>
                <div className="flex md:flex-row flex-col gap-1">
                  <HalfInput
                    label="Irangamuntu (Si Itegeko)"
                    name="idCard"
                    value={formData.idCard}
                    onChange={handleInputChange}
                    error={errors.idCard}
                  />
                  <HalfInput
                    label="Email (Si Itegeko)"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    error={errors.email}
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-medium px-4 md:w-[16%] w-full">
                    Ifoto (Si Itegeko)
                  </label>
                  <div
                    className="flex cursor-pointer lg:w-32 w-32 px-4 border-desired"
                    onClick={handleFileTrigger}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      name="profile"
                      className="hidden"
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                    <GoPaperclip className="lg:w-6 lg:h-6 w-6 h-6 text-tblue mr-2" />
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Ifoto"
                        className="lg:w-6 lg:h-6 w-12 h-12 rounded-full object-cover ml-2"
                      />
                    ) : (
                      <span className="text-pcolor text-sm lg:mt-0 mt-1 md:text-sm">
                        Hitamo..
                      </span>
                    )}
                  </div>
                  {errors.profile && <ErrorMessage message={errors.profile} />}
                </div>

                <div className="flex md:flex-row flex-col justify-center items-center md:mr-[100px] md:pb-14 md:pt-0 pt-6 md:gap-20 gap-6">
                  <div className="flex items-center gap-2 px-4">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="md:w-3 md:h-3 w-4 h-4 rounded-full cursor-pointer"
                    />
                    <label
                      htmlFor="terms"
                      className="text-gray-700 font-medium cursor-pointer"
                    >
                      Amategeko n'ambwiriza
                    </label>
                    {errors.terms && <ErrorMessage message={errors.terms} />}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="text-white flex justify-center items-center gap-2 px-4 py-1 rounded-md bg-Total hover:bg-blue-800 disabled:bg-gray-400"
                  >
                    {isLoading ? (
                      <LoadingSpinner size={5} strokeWidth={2} />
                    ) : (
                      <>
                        <ImUserPlus className="text-white" />
                        Emeza Kwiyandikisha
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
    </div>
  );
};

const ErrorMessage = ({ message }) => (
  <span className="text-red-500 text-sm ml-2">{message}</span>
);

export default Register;
