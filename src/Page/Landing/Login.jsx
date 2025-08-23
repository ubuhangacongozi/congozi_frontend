import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { IoIosLogIn } from "react-icons/io";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaQuestionCircle } from "react-icons/fa";
import LoginInputs from "../../Components/Inputs/Studentnputs/LoginInputs";
import Injira from "../../assets/Injira.png";
import { useUserContext } from "../../Components/useUserContext";
import LoadingSpinner from "../../Components/LoadingSpinner ";
const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserContext();
  const navkwigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  const handleLogin = async () => {
    if (!identifier || !password) {
      toast.error("Shyiramo nomero ya telefone n'ijambo banga");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${ApiUrl}/users/auth`,
        {
          identifier,
          password,
        }
      );

      const { token, data, message } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      toast.success(message || "Kwinjira byakunze");

      switch (data.role) {
        case "student":
          navkwigate("/students/home");
          window.location.reload();
          break;
        case "admin":
          navkwigate("/admins/home");
          window.location.reload();
          break;
        case "supperAdmin":
          navkwigate("/admins/home");
          window.location.reload();
          break;
        case "school":
          navkwigate("/schools/home");
          window.location.reload();
          break;
        default:
          toast.error("Ntitwabashije kumenya uw'uriwe");
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Kwinjira byanze ongera ugerageze.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.go(1);
      };
    }
  }, []);

  return (
    <div className="pt-[73px] md:px-12">
      <div className="grid md:grid-cols-2 grid-cols-1 rounded-r-md rounded-b-none md:border border-blue-700">
        <div className="flex justify-end md:h-[60vh]">
          <img src={Injira} alt="Login Illustration" />
        </div>

        <div className="flex flex-col items-center gap-3 md:py-0 py-6 md:border-l border-blue-700">
          <div className="flex justify-center items-center gap-2 w-full bg-blue-700 md:rounded-l-none rounded-md py-1">
            <IoIosLogIn className="md:text-2xl text-3xl text-white" />
            <p className="text-white text-xl font-semibold">
              Kwinjira muri konti
            </p>
          </div>

          <p className="text-lg md:px-20 md:py-0 p-2 text-center">
            Kugirango ubone amakuru yawe n'ibizamini ndetse na serivisi zitangwa
            na Congozi Expert. Ugomba kubanza kwinjira
          </p>

          <div className="flex flex-col items-start gap-4 md:w-[70%] w-full">
            <LoginInputs
              label="Telefone cg Email"
              type="text"
              icon={<FaUser />}
              placeholder="Urugero: 07XX cg email@gmail.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <LoginInputs
              label="Ijambo banga ukoresha"
              type="password"
              icon={<CiLock />}
              placeholder="Shyiramo ijambobanga"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            className="flex justify-center items-center gap-2 px-4 py-1 rounded-md bg-Total hover:bg-blue-800 text-white mt-4"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size={5} strokeWidth={2} />
              </>
            ) : (
              <>
                <FaCircleArrowRight className="text-white" />
                Saba Kwinjira
              </>
            )}
          </button>

          <div className="md:flex-row flex-col flex justify-center items-center md:gap-10 gap-4 mt-1 mb-3">
            <Link to="/hindura">
              <p className="flex justify-center items-center gap-2 text-blue-500 text-md">
                <FaQuestionCircle /> Wibagiwe Ijambobanga?
              </p>
            </Link>
            <Link to={"/kwiyandikisha"}>
              <div className="flex justify-center items-center md:ml-28 gap-2">
                <p className="flex justify-center items-center gap-2 text-blue-500 text-md">
                  Nta konti ufite?
                </p>
                <button
                  className={`flex justify-center items-center px-4 py-1 rounded-md bg-Total hover:bg-blue-800 text-white `}
                >
                  Yifungure
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
