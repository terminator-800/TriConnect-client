import icons from '../../assets/svg/Icons';

export default function HireOfferNotif({ notif }) {
  const titleColor = {
    'NEW HIRE OFFER': 'text-blue-500',
  };
  return (
    <>
      <div className={`font-semibold mt-3 ${titleColor[notif.title] || 'text-blue-500'}`}>
        {notif.title}
      </div>
      <div className="flex items-center justify-between">
        <div className="mt-1 font-normal text-[#1F2937]">{notif.message}</div>
        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
      </div>

      <div className="text-xs text-gray-400 mt-2 flex gap-1 items-center">
        <span className="w-4 h-4">
          <img src={icons.posted_clock} alt="time" />
        </span>
        {notif.created_at}
      </div>
    </>
  );
}
