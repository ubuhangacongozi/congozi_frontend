import React, { Suspense, lazy, useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useUserContext } from "./Components/useUserContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import FullPageLoader from "./Components/FullPageLoader";
const LandingLay = lazy(() =>
  import(
    "./Components/Layouts/LandingLay"
  )
);

const UserStudent = lazy(() =>
  import(
    "./Components/Users/Students/UserStudent"
  )
);

const UserAdmin = lazy(() =>
  import(
    "./Components/Users/Admins/UserAdmin"
  )
);

const UserSchool = lazy(() =>
  import(
    "./Components/Users/Schools/UserSchool"
  )
);
const Home = lazy(() => import("./Page/Landing/Home"));
const Services = lazy(() => import("./Page/Landing/Services"));
const Register = lazy(() => import("./Page/Landing/Register"));
const ContactUs = lazy(() => import("./Page/Landing/ContactUs"));
const Login = lazy(() => import("./Page/Landing/Login"));
const RestPassword = lazy(() => import("./Page/Landing/RestPassword"));

const StudentHome = lazy(() => import("./Page/Dashboard/Students/StudentHome"));
const StudentMarket = lazy(() =>
  import("./Page/Dashboard/Students/StudentMarket")
);
const ManualTracking = lazy(() =>
  import("./Page/Dashboard/Students/ManualTracking")
);
const StudentExams = lazy(() =>
  import("./Page/Dashboard/Students/StudentExams")
);
const StudentProfile = lazy(() =>
  import("./Page/Dashboard/Students/StudentProfile")
);
const StudentUnpaid = lazy(() =>
  import("./Page/Dashboard/Students/StudentUnpaid")
);
const StudentWaiting = lazy(() =>
  import("./Page/Dashboard/Students/StudentWaiting")
);
const LiveExam = lazy(() => import("./Page/Dashboard/Students/LiveExam"));
const LiveLearn = lazy(() => import("./Page/Dashboard/Students/LiveLearn"));
const StudentResults = lazy(() =>
  import("./Page/Dashboard/Students/StudentResults")
);
const SchoolDemo = lazy(() => import("./Page/Dashboard/Students/SchoolDemo"));

const AdminDashboard = lazy(() =>
  import("./Page/Dashboard/Admins/AdminDashboard")
);
const AdminExams = lazy(() => import("./Page/Dashboard/Admins/AdminExams"));
const AdminAccounts = lazy(() =>
  import("./Page/Dashboard/Admins/AdminAccounts")
);
const AdminUsers = lazy(() => import("./Page/Dashboard/Admins/AdminUsers"));
const AdminProfile = lazy(() => import("./Page/Dashboard/Admins/AdminProfile"));
const AdminsPayments = lazy(() =>
  import("./Page/Dashboard/Admins/AdminsPayments")
);

const SchoolsDashboard = lazy(() =>
  import("./Page/Dashboard/schools/SchoolsDashboard")
);
const AccountMarket = lazy(() =>
  import("./Page/Dashboard/schools/AccountMarket")
);
const SchoolDoExams = lazy(() =>
  import("./Page/Dashboard/schools/SchoolDoExams")
);
const SchoolMyExams = lazy(() =>
  import("./Page/Dashboard/schools/SchoolMyExams")
);
const SchoolMyAccount = lazy(() =>
  import("./Page/Dashboard/schools/SchoolMyAccount")
);
const SchoolUnpaid = lazy(() =>
  import("./Page/Dashboard/schools/SchoolUnpaid")
);
const SchoolWaiting = lazy(() =>
  import("./Page/Dashboard/schools/SchoolWaiting")
);
const SchoolAccessableExams = lazy(() =>
  import("./Page/Dashboard/schools/SchoolAccessableExams")
);
const SchoolAccessedExam = lazy(() =>
  import("./Page/Dashboard/schools/SchoolAccessedExam")
);
const SchoolLiveExam = lazy(() =>
  import("./Page/Dashboard/schools/SchoolLiveExam")
);
const SchoolLiveLearn = lazy(() =>
  import("./Page/Dashboard/schools/SchoolLiveLearn")
);
const SchoolResults = lazy(() =>
  import("./Page/Dashboard/schools/SchoolResults")
);

const App = () => {
  const { userRole, loading: userLoading } = useUserContext();
  const [routeLoading, setRouteLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setRouteLoading(true);
      const timer = setTimeout(() => {
        setRouteLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    };

    handleRouteChange();
  }, [location]);
  const showLoader = initialLoad || userLoading || routeLoading;

  if (showLoader) {
    return <FullPageLoader />;
  }

  return (
    <div
      className="overflow-x-hidden font-Poppins "
    >
      <Suspense fallback={<FullPageLoader />}>
        <Routes location={location} key={location.key}>
          <Route element={<LandingLay />}>
            <Route index element={<Home />} />
            <Route path="/serivisi" element={<Services />} />
            <Route path="/kwiyandikisha" element={<Register />} />
            <Route path="/tuvugishe" element={<ContactUs />} />
            <Route path="/kwinjira" element={<Login />} />
            <Route path="/hindura" element={<RestPassword />} />
          </Route>
          {userRole === "student" && (
            <Route element={<ProtectedRoute allowedRole="student" />}>
              <Route element={<UserStudent />}>
                <Route path="/students/home" element={<StudentHome />} />
                <Route path="/students/market" element={<StudentMarket />} />
                <Route path="/students/tracking" element={<ManualTracking />} />
                <Route path="/students/exams" element={<StudentExams />} />
                <Route path="/students/profile" element={<StudentProfile />} />
                <Route path="/students/results" element={<StudentResults />} />
                <Route
                  path="/students/unpaidexams"
                  element={<StudentUnpaid />}
                />
                <Route
                  path="/students/waitingexams"
                  element={<StudentWaiting />}
                />
                <Route path="/liveExam" element={<LiveExam />} />
                <Route path="/livekwiga" element={<LiveLearn />} />
                <Route path="/students/school" element={<SchoolDemo />} />
              </Route>
            </Route>
          )}
          {(userRole === "admin" || userRole === "supperAdmin") && (
            <Route element={<ProtectedRoute allowedRole={userRole} />}>
              <Route element={<UserAdmin />}>
                <Route path="/admins/home" element={<AdminDashboard />} />
                <Route path="/admins/exams" element={<AdminExams />} />
                <Route path="/admins/accounts" element={<AdminAccounts />} />
                <Route path="/admins/users" element={<AdminUsers />} />
                <Route path="/admins/profile" element={<AdminProfile />} />
                <Route path="/admins/payments" element={<AdminsPayments />} />
              </Route>
            </Route>
          )}
          {userRole === "school" && (
            <Route element={<ProtectedRoute allowedRole="school" />}>
              <Route element={<UserSchool />}>
                <Route path="/schools/home" element={<SchoolsDashboard />} />
                <Route
                  path="/schools/account/market"
                  element={<AccountMarket />}
                />
                <Route path="/schools/online" element={<SchoolDoExams />} />
                <Route path="/schools/accounts" element={<SchoolMyExams />} />
                <Route path="/schools/account" element={<SchoolMyAccount />} />
                <Route
                  path="/schools/unpaidaccounts"
                  element={<SchoolUnpaid />}
                />
                <Route
                  path="/schools/waitingaccounts"
                  element={<SchoolWaiting />}
                />
                <Route
                  path="/schools/accessableexams"
                  element={<SchoolAccessableExams />}
                />
                <Route
                  path="/schools/accessedexam"
                  element={<SchoolAccessedExam />}
                />
                <Route path="/schoolsliveExam" element={<SchoolLiveExam />} />
                <Route path="/schoolslivekwiga" element={<SchoolLiveLearn />} />
                <Route path="/schools/results" element={<SchoolResults />} />
              </Route>
            </Route>
          )}
        </Routes>
      </Suspense>
    </div>
  );
};

export default React.memo(App);
