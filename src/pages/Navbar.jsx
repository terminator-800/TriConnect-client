import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROLE } from '../../utils/role';
import NotificationBell from '../components/Notification/NotificationBell';
import icons from '../assets/svg/Icons';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userType }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleScroll = (sectionId) => {
    // If not on home page, go there first
    if (window.location.pathname !== '/') {
      navigate('/'); // navigate to home
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50); // small delay to wait for DOM
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Landing Page */}
      {userType === 'guest' && (
        <nav className="border-b border-gray-300 px-6 py-4 bg-white">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="#home" className="font-bold text-blue-900 flex items-center gap-3">
              <img src={icons.logo_triconnect} alt="TriConnect logo" className="h-10" />
              TriConnect
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex gap-5">
              <a className="font-bold" href="#about_us">
                About Us
              </a>
              <span>|</span>
              <a href="#how_it_works" className="font-bold">
                How it Works
              </a>
              <span>|</span>
              <a className="font-bold" href="#why_us">
                Why Us
              </a>
              <span>|</span>
              <a className="font-bold" href="#testimonials">Feedbacks</a>
            </div>

            {/* Desktop Buttons */}
          <div className="hidden md:flex items-center">
            <Link
              to="/login"
              className="text-[#003479] px-1 py-1 font-bold m-2"
            >
              Login
            </Link>

            <span className="text-[#003479] font-bold ">|</span>

            <Link
              to="/register"
              className="text-[#003479] px-1 py-1 font-bold m-2"
            >
              Sign Up
            </Link>
          </div>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden text-blue-900 text-3xl font-bold focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {menuOpen && (
            <div className="flex flex-col items-center mt-4 space-y-4 md:hidden">
              <a className="font-bold" href="#about_us">
                About Us
              </a>
              <a href="#how_it_works" className="font-bold">
                How it Works
              </a>
              <a className="font-bold" href="#why_us">
                Why Us
              </a>
              <a className="font-bold" href="#testimonials">
                Feedbacks
              </a>

              <div className="flex flex-col items-center">
                <Link
                  to="/login"
                  className="text-[#003479] px-1 py-1 font-bold m-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-[#003479] px-1 py-1 font-bold m-2"
                >
                  Sign Up
              </Link>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Register / Signup */}
      {userType === 'register' && (
        <nav className="border-b border-gray-300 px-6 py-4 bg-white">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="font-bold text-blue-900 flex items-center gap-3">
              <img src={icons.logo_triconnect} alt="TriConnect logo" className="h-10" />
              TriConnect
            </Link>

            {/* Desktop Nav Links */}
              <div className="hidden md:flex gap-5">
                <button
                  className="font-bold cursor-pointer"
                  onClick={() => handleScroll('about_us')}
                >
                  About Us
                </button>
                <span>|</span>
                <button
                  className="font-bold cursor-pointer"
                  onClick={() => handleScroll('how_it_works')}
                >
                  How it Works
                </button>
                <span>|</span>
                <button
                  className="font-bold cursor-pointer"
                  onClick={() => handleScroll('why_us')}
                >
                  Why Us
                </button>
                <span>|</span>
                <button
                  className="font-bold cursor-pointer"
                  onClick={() => handleScroll('testimonials')}
                >
                  Feedbacks
                </button>
              </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center">
            <Link
              to="/login"
              className="text-[#003479] px-1 py-1 font-bold m-2"
            >
              Login
            </Link>

            <span className="text-[#003479] font-bold ">|</span>

            <Link
              to="/register"
              className="text-[#003479] px-1 py-1 font-bold m-2"
            >
              Sign Up
            </Link>
            </div>

            {/* Hamburger Icon (Visible below 768px) */}
            <button
              className="md:hidden text-blue-900 text-3xl font-bold focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>

          {/* Mobile Dropdown Menu (Visible below 768px) */}
          {menuOpen && (
            <div className="flex flex-col items-center mt-4 space-y-4 md:hidden">
              <button
                  className="font-bold"
                  onClick={() => {
                    handleScroll('about_us');
                    setMenuOpen(false); // close menu after click
                  }}
                >
                  About Us
                </button>
                <button
                  className="font-bold"
                  onClick={() => {
                    handleScroll('how_it_works');
                    setMenuOpen(false);
                  }}
                >
                  How it Works
                </button>
                <button
                  className="font-bold"
                  onClick={() => {
                    handleScroll('why_us');
                    setMenuOpen(false);
                  }}
                >
                  Why Us
                </button>
                <button
                  className="font-bold"
                  onClick={() => {
                    handleScroll('testimonials');
                    setMenuOpen(false);
                  }}
                >
                  Feedbacks
                </button>

              <div className="flex flex-col items-center">
                <Link to="/login" className="text-[#003479] p-2 font-bold rounded">
                  Login
                </Link>
                <Link to="/register" className="font-bold p-2 rounded-3xl text-[#003479]">
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Register / Signup */}
      {userType === 'verify' && (
        <nav className="border-b border-gray-300 px-6 py-4 bg-white">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="font-bold text-blue-900 flex items-center gap-3">
              <img src={icons.logo_triconnect} alt="TriConnect logo" className="h-10" />
              TriConnect
            </Link>

               {/* Desktop Nav Links */}
              <div className="hidden md:flex gap-5">
                <button
                  className="font-bold cursor-pointer"
                  onClick={() => handleScroll('about_us')}
                >
                  About Us
                </button>
                <span>|</span>
                <button
                  className="font-bold cursor-pointer"
                  onClick={() => handleScroll('how_it_works')}
                >
                  How it Works
                </button>
                <span>|</span>
                <button
                  className="font-bold cursor-pointer"
                  onClick={() => handleScroll('why_us')}
                >
                  Why Us
                </button>
                <span>|</span>
                <button
                  className="font-bold cursor-pointer"
                  onClick={() => handleScroll('testimonials')}
                >
                  Feedbacks
                </button>
              </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center">
              <Link
                  to="/login"
                  className="text-[#003479] px-1 py-1 font-bold m-2"
                >
              Login
            </Link>

            <span className="text-[#003479] font-bold ">|</span>

            <Link
              to="/register"
              className="text-[#003479] px-1 py-1 font-bold m-2"
            >
              Sign Up
            </Link>
            </div>

            {/* Hamburger Icon (Visible below 768px) */}
            <button
              className="md:hidden text-blue-900 text-3xl font-bold focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>

          {/* Mobile Dropdown Menu (Visible below 768px) */}
          {menuOpen && (
            <div className="flex flex-col items-center mt-4 space-y-4 md:hidden">
              <button
                  className="font-bold"
                  onClick={() => {
                    handleScroll('about_us');
                    setMenuOpen(false); // close menu after click
                  }}
                >
                  About Us
                </button>
                <button
                  className="font-bold"
                  onClick={() => {
                    handleScroll('how_it_works');
                    setMenuOpen(false);
                  }}
                >
                  How it Works
                </button>
                <button
                  className="font-bold"
                  onClick={() => {
                    handleScroll('why_us');
                    setMenuOpen(false);
                  }}
                >
                  Why Us
                </button>
                <button
                  className="font-bold"
                  onClick={() => {
                    handleScroll('testimonials');
                    setMenuOpen(false);
                  }}
                >
                  Feedbacks
                </button>

              <div className="flex flex-col items-center">
                <Link to="/login" className="text-blue-600 p-2 font-bold rounded">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-900 font-bold p-2 rounded-3xl text-white">
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Login */}
      {userType === 'login' && (
        <nav className="border-b border-gray-300 px-6 py-4 bg-white fixed top-0 left-0 w-full z-50">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="font-bold text-blue-900 flex items-center gap-3">
              <img src={icons.logo_triconnect} alt="TriConnect logo" className="h-10" />
              TriConnect
            </Link>

             {/* Desktop Nav Links */}
              <div className="hidden md:flex gap-5">
                <button
                  className="font-bold cursor-pointer"
                  onClick={() => handleScroll('about_us')}
                >
                  About Us
                </button>
                <span>|</span>
                <button
                  className="font-bold cursor-pointer"
                  onClick={() => handleScroll('how_it_works')}
                >
                  How it Works
                </button>
                <span>|</span>
                <button
                  className="font-bold cursor-pointer"
                  onClick={() => handleScroll('why_us')}
                >
                  Why Us
                </button>
                <span>|</span>
                <button
                  className="font-bold cursor-pointer"
                  onClick={() => handleScroll('testimonials')}
                >
                  Feedbacks
                </button>
              </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center">
            <Link to="/login" className="text-[#003479] px-1 py-1 font-bold m-2">
              Login
            </Link>
            <span className="text-[#003479] font-bold ">|</span>
            <Link to="/register" className="text-[#003479] px-1 py-1 font-bold m-2">
            Sign Up
            </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-blue-900 text-3xl font-bold focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <div className="flex flex-col items-center mt-4 space-y-4 md:hidden">
               <button
                  className="font-bold"
                  onClick={() => {
                    handleScroll('about_us');
                    setMenuOpen(false); // close menu after click
                  }}
                >
                  About Us
                </button>
                <button
                  className="font-bold"
                  onClick={() => {
                    handleScroll('how_it_works');
                    setMenuOpen(false);
                  }}
                >
                  How it Works
                </button>
                <button
                  className="font-bold"
                  onClick={() => {
                    handleScroll('why_us');
                    setMenuOpen(false);
                  }}
                >
                  Why Us
                </button>
                <button
                  className="font-bold"
                  onClick={() => {
                    handleScroll('testimonials');
                    setMenuOpen(false);
                  }}
                >
                  Feedbacks
                </button>

              <div className="flex flex-col items-center">
                <Link to="/login" className="text-[#003479] p-2 font-bold rounded">
                  Login
                </Link>
                <Link to="/register" className=" font-bold p-2 rounded-3xl text-[#003479]">
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Jobseeker */}
      {userType === ROLE.JOBSEEKER && (
        <div className="flex justify-between items-center py-5 px-10 border border-gray-300">
          <Link
            to={`/${ROLE.JOBSEEKER}`}
            className="font-bold text-blue-900 flex items-center gap-3"
          >
            <img src={icons.logo_triconnect} alt="" className="h-10" />
            TriConnect
          </Link>

          <div className="flex justify-end items-center xl:gap-15 lg:gap-10 md:gap-8 sm:gap-5">
            <div className="relative flex">
              <div className="flex items-center font-bold cursor-pointer">
                <NotificationBell role={ROLE.JOBSEEKER} />
                <span className="hidden md:inline ml-1">Notifications</span>
              </div>
            </div>

            <div className="relative flex">
              <button
                onClick={toggleDropdown}
                className="font-bold focus:outline-none cursor-pointer flex flex-row items-center"
              >
                <img src={icons.profile} alt="" className="mr-3" />
                <span className="hidden md:inline">Profile</span>
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-10 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  <Link
                    to={`/${ROLE.JOBSEEKER}/profile`}
                    className="block px-4 py-2 text-black hover:bg-gray-100"
                  >
                    View Profile
                  </Link>
                  <Link to="/messages" className="block px-4 py-2 text-black hover:bg-gray-100">
                    Message
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-black hover:bg-gray-100">
                    Settings
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Business Employer */}
      {userType === ROLE.BUSINESS_EMPLOYER && (
        <div className="flex justify-between items-center py-5 px-10 border border-gray-300">
          <Link to={'/'} className="font-bold text-blue-900 flex items-center gap-3">
            <img src={icons.logo_triconnect} alt="" className="h-10" />
            TriConnect
          </Link>

          <div className="flex justify-end items-center xl:gap-15 lg:gap-10 md:gap-8 sm:gap-5">
            <div className="relative flex">
              <div className="flex items-center font-bold cursor-pointer">
                <NotificationBell role={ROLE.BUSINESS_EMPLOYER} />
                <span className="hidden md:inline ml-1">Notifications</span>
              </div>
            </div>

            <div className="relative flex">
              <button
                onClick={toggleDropdown}
                className="font-bold focus:outline-none cursor-pointer flex flex-row items-center"
              >
                <img src={icons.profile} alt="" className="mr-3" />
                <span className="hidden md:inline">Profile</span>
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-10 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  <Link
                    to={`/${ROLE.BUSINESS_EMPLOYER}/profile`}
                    className="block px-4 py-2 text-black hover:bg-gray-100"
                  >
                    View Profile
                  </Link>
                  <Link to="/messages" className="block px-4 py-2 text-black hover:bg-gray-100">
                    Message
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-black hover:bg-gray-100">
                    Settings
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Individual Employer */}
      {userType === ROLE.INDIVIDUAL_EMPLOYER && (
        <div className="flex justify-between items-center py-5 px-10 border border-gray-300">
          <Link to={'/'} className="font-bold text-blue-900 flex items-center gap-3">
            <img src={icons.logo_triconnect} alt="" className="h-10" />
            TriConnect
          </Link>

          <div className="flex justify-end items-center xl:gap-15 lg:gap-10 md:gap-8 sm:gap-5">
            <div className="relative flex">
              <div className="flex items-center font-bold cursor-pointer">
                <NotificationBell role={ROLE.INDIVIDUAL_EMPLOYER} />
                <span className="hidden md:inline ml-1">Notifications</span>
              </div>
            </div>

            <div className="relative flex">
              <button
                onClick={toggleDropdown}
                className="font-bold focus:outline-none cursor-pointer flex flex-row items-center"
              >
                <img src={icons.profile} alt="" className="mr-3" />
                <span className="hidden md:inline">Profile</span>
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-10 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  <Link
                    to={`/${ROLE.INDIVIDUAL_EMPLOYER}/profile`}
                    className="block px-4 py-2 text-black hover:bg-gray-100"
                  >
                    View Profile
                  </Link>
                  <Link to="/messages" className="block px-4 py-2 text-black hover:bg-gray-100">
                    Message
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-black hover:bg-gray-100">
                    Settings
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manpower Provider */}
      {userType === ROLE.MANPOWER_PROVIDER && (
        <div className="flex justify-between items-center py-5 px-10 border border-gray-300">
          <Link to={'/'} className="font-bold text-blue-900 flex items-center gap-3">
            <img src={icons.logo_triconnect} alt="" className="h-10" />
            TriConnect
          </Link>

          <div className="flex justify-end items-center xl:gap-15 lg:gap-10 md:gap-8 sm:gap-5">
            <div className="relative flex">
              <div className="flex items-center font-bold cursor-pointer">
                <NotificationBell role={ROLE.MANPOWER_PROVIDER} />
                <span className="hidden md:inline ml-1">Notifications</span>
              </div>
            </div>

            <div className="relative flex">
              <button
                onClick={toggleDropdown}
                className="font-bold focus:outline-none cursor-pointer flex flex-row items-center"
              >
                <img src={icons.profile} alt="" className="mr-3" />
                <span className="hidden md:inline">Profile</span>
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-10 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  <Link
                    to={`/${ROLE.MANPOWER_PROVIDER}/profile`}
                    className="block px-4 py-2 text-black hover:bg-gray-100"
                  >
                    View Profile
                  </Link>
                  <Link to="/messages" className="block px-4 py-2 text-black hover:bg-gray-100">
                    Message
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-black hover:bg-gray-100">
                    Settings
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Administrator */}
      {userType === ROLE.ADMINISTRATOR && (
        <nav className="flex justify-between items-center py-5 px-10 border border-gray-300">
          <Link to={'/'} className="font-bold text-blue-900 flex items-center gap-3">
            <img src={icons.logo_triconnect} alt="" className="h-10" />
            TriConnect
          </Link>

          <div className="relative flex">
            <div className="flex items-center font-bold ">
              <NotificationBell role={ROLE.ADMINISTRATOR} />
              <span className="hidden sm:inline">Notifications</span>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
