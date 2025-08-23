import React from "react";
import { navContents } from "../../Data/morkData";
import { useLocation } from "react-router-dom";

const ResponsiveMenu = ({ isOpen }) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-16 left-0 z-50 w-full bg-black/20"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="text-semibold bg-Total text-white">
        <ul className="flex flex-col justify-center items-start px-6 gap-6 py-6">
          {navContents.map((items) => {
            const isActive = location.pathname === items.link;
            return (
              <li key={items.id} className="relative">
                <a
                  href={items.link}
                  className={`relative inline-block py-1 px-3 font-semibold duration-300 pl-6
                    ${isActive ? "text-Unpaid/95" : "hover:text-Unpaid/95 hover:pl-8"} 
                    before:content-['•'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 
                    before:text-Unpaid/95 before:duration-300
                    ${isActive ? "before:opacity-100" : "before:opacity-0 hover:before:opacity-100"}
                  `}
                >
                  {items.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
