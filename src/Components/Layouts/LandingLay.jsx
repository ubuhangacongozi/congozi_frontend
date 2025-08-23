import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
const currentYear = new Date().getFullYear();
const COPYRIGHT_TEXT = `© ${currentYear} Congozi Expert Technical Unity Limited`;

const LandingLay = () => {
  const [applyHeight, setApplyHeight] = useState(false);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    const checkScreenSize = () => {
      setApplyHeight(window.matchMedia("(min-width: 768px)").matches);
    };
    setVh();
    checkScreenSize();
    const debounce = (fn) => {
      let frame;
      return () => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(fn);
      };
    };

    const debouncedSetVh = debounce(setVh);
    const debouncedCheckSize = debounce(checkScreenSize);

    window.addEventListener("resize", debouncedSetVh);
    window.addEventListener("resize", debouncedCheckSize);

    return () => {
      window.removeEventListener("resize", debouncedSetVh);
      window.removeEventListener("resize", debouncedCheckSize);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="md:max-h-[10vh]">
        <Navbar />
      </div>
      <div
        className={`flex flex-col flex-grow ${applyHeight ? "md:h-[calc(var(--vh,1vh)*100-10vh)]" : ""}`}
      >
        <div className="flex-grow">
          <Outlet />
        </div>
        <footer className="md:fixed md:bottom-0 md:left-0 md:right-0 w-full">
          <div className="flex justify-center bg-Unpaid">
            <p className="p-4 text-blue-900 text-xs font-bold text-center uppercase">
              {COPYRIGHT_TEXT}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingLay;