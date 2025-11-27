import icons from '../../assets/svg/Icons'; // adjust path if needed

export default function AccountVerificationNotif({ notif }) {
  return (
    <>
      <div className="font-semibold text-[#55C463] mt-3">{notif.title}</div>

      <div className="flex items-center justify-between">
        <div className="text-gray-700 mt-1">
          <span>TriConnect</span> {notif.notifier?.role || 'User'}
        </div>

        {!notif.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}

        {console.log(notif)}
      </div>

      <div className="mt-1 font-normal text-[#1F2937]">{notif.message}</div>

      <div className="text-xs text-gray-400 mt-2 flex gap-1 items-center">
        <span className="w-4 h-4">
          <img src={icons.posted_clock} alt="time" />
        </span>
        {notif.created_at}
      </div>
    </>
  );
}
