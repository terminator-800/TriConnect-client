// components/NotificationsBell.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNotification } from "../../../hooks/useNotification";
import icons from "../../assets/svg/Icons";
import AccountVerificationNotif from "./AccountVerificationNotif";

export default function NotificationsBell({ role }) {
  const { data: notifications, isLoading, isError } = useNotification(role);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Return inline messages for loading/error/empty
  if (isLoading)
    return <div className="p-2 text-gray-500">Loading notifications...</div>;
  if (isError)
    return (
      <div className="p-2 text-red-500">Failed to load notifications.</div>
    );
  if (!notifications || notifications.length === 0) {
    return (
      <div className="h-5 mr-1 w-5">
        <span>
          <img src={icons.notification_bell} alt="" />
        </span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-gray-200 transition"
      >
        <img
          src={icons.notification_bell}
          alt="Notifications"
          className="h-6 w-6"
        />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 px-5 py-3 w-xl max-h-96 overflow-y-auto shadow-lg backdrop-blur-2xl z-50">
          <div className="font-bold text-xl pb-3 border-b border-[#D5D5D5]">
            Notifications
          </div>

          {notifications.map((notif) => (
            <div
              key={notif.notification_id}
              className="p-3 border-b last:border-b-0 hover:bg-gray-50 transition"
            >
              {notif.type === "account_verification" && (
                <AccountVerificationNotif notif={notif} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
