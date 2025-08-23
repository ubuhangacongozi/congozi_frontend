import React, { useState, createContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Sidebar/Topbar";

// Create the context
export const SidebarContext = createContext();

const UsersLay = ({ role }) => {
  const location = useLocation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const sectionMap = {
    "/students/home": "ibigenewe Umunyeshuri",
    "/students/market": "Isoko ry'ibizamini",
    "/students/online": "Aho Bakorera Ikizamini",
    "/students/exams": "Ibizamini Byanjye",
    "/students/profile": "Umwirondoro Wanjye",
    "/students/school": "Aho Bagurira konti y'ishuri",

    "/admins/home": "Admin Dashboard",
    "/admins/exams": "Exams",
    "/admins/accounts": "School Accounts Market",
    "/admins/users": "Users",
    "/admins/profile": "My Account",
    "/admins/payments": "Payments",

    "/schools/home": "Konte y'Ikigo",
    "/schools/account/market": "Isoko rya Konte",
    "/schools/online": "gukora Ibizamini",
    "/schools/accounts": "Konte Naguze",
    "/schools/account": "Umwirondoro W' Ikigo",
  };
  
  const getCurrentYear = () => new Date().getFullYear();
  const currentSection =
    sectionMap[location.pathname] || "ibigenewe Umunyeshuri";

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarExpanded, toggleSidebar }}>
      <div className="flex">
        <Sidebar 
          role={role} 
          isExpanded={isSidebarExpanded} 
          toggleSidebar={toggleSidebar} 
        />
        <div className="flex flex-col">
          <Topbar currentSection={currentSection} role={role} />
        </div>
      </div>
      <div className={`pt-20 transition-all duration-300 md:pb-[60px] pb-[14vh] ${
        isSidebarExpanded ? "lg:pl-72" : "lg:pl-8"
      }`}>
        <Outlet />
        <div className="md:fixed md:bottom-0 md:left-0 md:right-0 md:block hidden w-full">
          <div className="flex justify-center items-center h-[7.5vh] bg-Unpaid">
            <p className="md:p-[6px] p-5 text-blue-900 md:text-xs text-xs font-bold text-center uppercase">
              &copy; {getCurrentYear()} Congozi Expert Technical Unity{" "}
              <span className="normal-case">Limited</span>
            </p>
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default UsersLay;