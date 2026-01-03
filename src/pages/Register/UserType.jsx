import BackButton from '../../components/BackButton';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import icons from '../../assets/svg/Icons';
import Navbar from '../Navbar';
import { ROLE } from '../../../utils/role';
import '../../components/animation/animation.css';

const Register = () => {
  const [isSelected, setSelectOption] = useState(null);
  const navigate = useNavigate();
  const employer = 'employer';

  const handleSelect = (option) => {
    setSelectOption(option);
  };

  const handleNext = () => {
    if (!isSelected) {
      alert('Please select a role before continuing.');
      return;
    }
    navigate(`/register/${isSelected}`);
  };

  return (
    <>
      <Navbar userType={'register'} />
      <div className="slide-in-left flex justify-center items-center h-screen flex-col 
      max-[375px]:h-[220vh]  
      max-[638px]:h-[200vh]
      max-[768px]:h-[120vh]
      max-[1024px]:h-[120vh]
      ">

        <div className="flex flex-col items-center text-center mb-6 px-4">
          <h1 className="font-bold text-3xl 
                        sm:text-4xl 
                        md:text-5xl
                        
          ">
            Select User Type
          </h1>
          <p className="text-[#64748B] text-base sm:text-lg md:text-2xl mt-2">
            Select one to get started
          </p>
        </div>

    <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          sm:gap-6
          lg:grid-cols-4
          lg:gap-10
          lg:
          place-items-center
          w-full
          max-w-7xl
          text-base sm:text-lg md:text-xl
        "
      >

          <img
            src={icons.jobseeker}
            alt="jobseeker"
            className={`cursor-pointer transform transition-transform duration-300 
             ${isSelected === ROLE.JOBSEEKER ? 'scale-105 w-65' : 'scale-100 w-60'}`}
            onClick={() => handleSelect(ROLE.JOBSEEKER)}
          />

          <img
            src={icons.individual_employer}
            alt="individual employer"
            className={`cursor-pointer transform transition-transform duration-300 
             ${isSelected === ROLE.INDIVIDUAL_EMPLOYER ? 'scale-105 w-65' : 'scale-100 w-60'}`}
            onClick={() => handleSelect(ROLE.INDIVIDUAL_EMPLOYER)}
          />

          <img
            src={icons.business_employer}
            alt="business employer"
            className={`cursor-pointer transform transition-transform duration-300 
             ${isSelected === ROLE.BUSINESS_EMPLOYER ? 'scale-105 w-65' : 'scale-100 w-60'}`}
            onClick={() => handleSelect(ROLE.BUSINESS_EMPLOYER)}
          />

          <img
            src={icons.manpower_provider}
            alt="manpower provider"
            className={`cursor-pointer transform transition-transform duration-300 
             ${isSelected === ROLE.MANPOWER_PROVIDER ? 'scale-105 w-65' : 'scale-100 w-60'}`}
            onClick={() => handleSelect(ROLE.MANPOWER_PROVIDER)}
          />
        </div>

       <div className="flex justify-center items-center mt-15 gap-25
                        max-[375px]:flex-col
                        max-[375px]:gap-10  
  
       ">
        <button
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => navigate(-1)} 
        >
          <img src={icons.back_arrow} alt="back" className="w-5 h-5" />
          <span className='text-2xl'>Back</span>
        </button>

        <button
          onClick={() => handleNext()}
          className="bg-blue-900 text-white pt-1 pb-1 pl-10 pr-10 rounded-3xl text-2xl cursor-pointer"
        >
          Next Step
        </button>
      </div>

      </div>
    </>
  );
};

export default Register;
