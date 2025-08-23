import React, { useState, useEffect } from "react";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Police from "../../assets/Policelogo.png";
import { IoIosNotificationsOutline } from "react-icons/io";
import axios from "axios";

const Topbar = ({ currentSection, role = "students", onSignOut }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedNotifications, setExpandedNotifications] = useState([]);

  const ApiUrl = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchNotifications();
      } catch (err) {
        console.error("Failed to parse stored user:", err);
      }
    }
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${ApiUrl}/notification/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data?.data || [];
      setNotifications(data);
      setNotificationCount(data.length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) fetchNotifications();
  };

  const handleLogout = () => {
    localStorage.clear();
    if (onSignOut) onSignOut();
    setUser(null);
    window.location.href = "/";
  };

  const truncateWords = (text, wordLimit = 10) => {
    const words = text.split(" ");
    return {
      truncated:
        words.length > wordLimit
          ? words.slice(0, wordLimit).join(" ") + "..."
          : text,
      fullText: text,
      isTruncated: words.length > wordLimit,
    };
  };

  const markAsRead = async (notification) => {
    if (!notification) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${ApiUrl}/notification/mark/${notification._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
      setExpandedNotifications(
        expandedNotifications.filter((id) => id !== notification._id)
      );
    } catch (error) {
      console.error("Failed to mark notification as read and delete:", error);
    }
  };

  const toggleNotificationExpand = (notificationId) => {
    if (expandedNotifications.includes(notificationId)) {
      setExpandedNotifications(
        expandedNotifications.filter((id) => id !== notificationId)
      );
    } else {
      setExpandedNotifications([...expandedNotifications, notificationId]);
    }
  };

  return (
    <div
      className="fixed top-0 right-0 md:px-24 px-4 flex justify-between items-center w-full h-[11vh] shadow bg-Total"
      style={{ zIndex: 999 }}
    >
      <div className="flex justify-center items-center gap-5">
        <Link to={`/${role}/home`}>
          <img src={Police} alt="Logo" className="h-12 text-center" />
        </Link>
        <div className="text-xs font-bold text-white">{currentSection}</div>
      </div>
      <div
        className="flex justify-center items-center gap-2 cursor-pointer md:hidden"
        onClick={toggleMenu}
      >
        {user?.profile ? (
          <img
            src={user.profile}
            alt={user.companyName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <div className="bg-white text-blue-500 p-2 rounded-full flex justify-center items-center">
            <span className="text-xs font-bold">{user?.companyName?.[0]}</span>
          </div>
        )}
      </div>

      {menuVisible && (
        <div className="absolute top-[11vh] right-0 w-full bg-blue-900 py-4 md:hidden z-[999]">
          <div className="flex flex-col justify-center items-center gap-1 mb-4">
            {user?.profile ? (
              <img
                src={user.profile}
                alt={user.companyName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="bg-white text-blue-500 p-4 rounded-full flex justify-center items-center text-xs font-bold">
                {user?.companyName?.[0]}
              </div>
            )}
            <div className="text-xs font-bold text-white">
              {user?.companyName || user?.fName}
            </div>
          </div>

          <ul className="flex flex-col items-center gap-5 py-3 text-white px-4">
            <div
              className="cursor-pointer flex relative"
              onClick={handleNotificationClick}
            >
              <IoIosNotificationsOutline size={26} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>
            {showNotifications && (
              <div className="bg-white w-[90%] rounded-md mt-2 p-3 max-h-72 overflow-y-auto text-black">
                <h3 className="font-bold text-md mb-2 border-b pb-1">
                  Notifications
                </h3>
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No unread notification
                  </p>
                ) : (
                  notifications.map((note) => {
                    const { truncated, fullText, isTruncated } = truncateWords(
                      note.message
                    );
                    const isExpanded = expandedNotifications.includes(note._id);

                    return (
                      <div key={note._id} className="border-b py-2">
                        <h2 className="text-Total text-xs font-bold pt-2 pb-2">
                          {note.noteTitle}
                        </h2>
                        <p className="text-xs text-gray-400">
                          {isExpanded ? fullText : truncated}
                        </p>
                        <div className="flex gap-16 justify-between items-center mt-4 mb-1 px-1">
                          {isTruncated && (
                            <button
                              className="text-blue-500 text-xs hover:underline"
                              onClick={() => toggleNotificationExpand(note._id)}
                            >
                              {isExpanded ? "View less" : "Read more"}
                            </button>
                          )}
                          {user?.role !== "admin" &&
                            user?.role !== "supperAdmin" &&
                            isExpanded && (
                              <button
                                className="text-blue-500 text-xs hover:underline"
                                onClick={() => markAsRead(note)}
                              >
                                Mark as read
                              </button>
                            )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
            <div
              className="flex items-center px-3 cursor-pointer"
              onClick={handleLogout}
            >
              <RiLogoutCircleLine className="mr-3 text-white" />
              <p className="text-md font-medium">Logout</p>
            </div>
          </ul>
        </div>
      )}
      <div className="md:flex hidden justify-end items-center gap-12 text-white relative">
        <div
          className="cursor-pointer flex relative"
          onClick={handleNotificationClick}
        >
          <IoIosNotificationsOutline size={26} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>
        {showNotifications && (
          <div className="absolute top-[60px] right-0 bg-white shadow-lg border rounded-md w-96 max-h-80 overflow-y-auto z-[999] text-black p-3">
            <h3 className="font-bold text-md mb-2 border-b pb-1">
              Notifications
            </h3>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-600">No unread notification</p>
            ) : (
              notifications.map((note) => {
                const { truncated, fullText, isTruncated } = truncateWords(
                  note.message
                );
                const isExpanded = expandedNotifications.includes(note._id);

                return (
                  <div key={note._id} className="border-b py-2">
                    <h2 className="text-Total text-xs font-bold pt-2 pb-2">
                      {note.noteTitle}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {isExpanded ? fullText : truncated}
                    </p>
                    <div className="flex gap-24 justify-between items-center mt-4 mb-1 px-4">
                      {isTruncated && (
                        <button
                          className="text-blue-500 text-xs hover:underline"
                          onClick={() => toggleNotificationExpand(note._id)}
                        >
                          {isExpanded ? "View less" : "Read more"}
                        </button>
                      )}
                      {user?.role !== "admin" &&
                        user?.role !== "supperAdmin" &&
                        isExpanded && (
                          <button
                            className="text-blue-500 text-xs hover:underline"
                            onClick={() => markAsRead(note)}
                          >
                            Mark as read
                          </button>
                        )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        <div className="flex flex-col justify-center items-center gap-0">
          {user?.profile ? (
            <img
              src={user.profile}
              alt={user.companyName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <div className="bg-white text-blue-500 p-2 rounded-full flex justify-center items-center">
              <span className="text-xs font-bold">
                {user?.companyName?.[0]}
              </span>
            </div>
          )}
          <div className="text-xs font-bold text-white">
            {user?.companyName || user?.fName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
