// components/NotificationsBell.jsx
import { useState, useRef, useEffect } from 'react';
import { useNotification, useSeenNotifications } from '../../../hooks/useNotification';
import icons from '../../assets/svg/Icons';
import AccountVerificationNotif from './AccountVerificationNotif';
import JobPost from './JobPost';
import SystemNotification from './SystemNotification';
import HireOfferNotif from './HireOfferNotif';
import { useNavigate } from 'react-router-dom';
import ApplicantNotif from './ApplicantNotif';

const PAGES = {
  'NEW JOB POST CREATED': '/administrator/job-post-verification',
  'JOB POST APPROVED': '/business-employer/manage',
  'NEW FEEDBACK SUBMITTED': '/administrator/feedback',
};

export default function NotificationsBell({ role }) {
  const navigate = useNavigate();
  const { data: notifications, isLoading, isError } = useNotification(role);
  const { mutate: markAsSeen } = useSeenNotifications(role);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => setOpen((prev) => !prev);

  const NOTIFICATIONS_TYPE = {
    account_verification: (notif) => <AccountVerificationNotif notif={notif} />,
    job_post_status: (notif) => <JobPost notif={notif} />,
    system: (notif) => <SystemNotification notif={notif} />,
    hire: (notif) => <HireOfferNotif notif={notif} />,
    job_application: (notif) => <ApplicantNotif notif={notif} />,
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (notif) => {
    markAsSeen(notif.notification_id, {
      onSuccess: () => {
        handlePageNavigate(notif.title);
      },
    });
  };

  const handlePageNavigate = (notificationTitle) => {
    const page = PAGES[notificationTitle];
    if (page) {
      navigate(page);
    }
  };

  // Return inline messages for loading/error/empty
  if (isLoading) return <div className="p-2 text-gray-500">Loading notifications...</div>;
  if (isError) return <div className="p-2 text-red-500">Failed to load notifications.</div>;
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
        className="relative p-2 rounded-full hover:bg-gray-200 transition hover:cursor-pointer"
      >
        <img src={icons.notification_bell} alt="Notifications" className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 px-5 py-3 w-xl max-h-96 overflow-y-auto shadow-lg backdrop-blur-2xl z-50">
          <div className="font-bold text-xl pb-3 border-b border-[#D5D5D5]">Notifications</div>

          {notifications.map((notif) => (
            <div
              key={notif.notification_id}
              className="p-3 border-b last:border-b-0 hover:bg-gray-50 hover:cursor-pointer transition"
              onClick={() => handleClick(notif)}
            >
              {NOTIFICATIONS_TYPE[notif.type]?.(notif)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
