import { useResendVerification } from '../../../hooks/useResendVeification';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ROLE } from '../../../utils/role';
import BackButton from '../../components/BackButton';
import axios from 'axios';
import Navbar from '../Navbar';
import VerifyAccount from '../../components/VerifyAccount';
import icons from '../../assets/svg/Icons';
import '../../components/animation/animation.css';

const RegisterAccount = () => {
  const { mutate: resendVerification, isLoading: isResending } = useResendVerification();
  const [showResend, setShowResend] = useState(false);

  const { accountType, type } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const individual = 'individual';
  const business = 'business';

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsRegistering(true);

    try {
      // if (accountType === 'employer') {
      //   if (type === business) {
      //     try {
      //       const data = {
      //         email: email,
      //         password: password,
      //         role: ROLE.BUSINESS_EMPLOYER,
      //       };
      //       const businessRes = await axios.post(
      //         `${import.meta.env.VITE_API_URL}/register/${ROLE.BUSINESS_EMPLOYER}`,
      //         data
      //       );
      //       if (businessRes.status === 201) {
      //         // In handleRegister
      //         navigate('/register/employer/business/account/verify', { state: { email } });
      //         // alert("Business employer account created successfully");
      //       } else {
      //         alert('Business employer account creation failed');
      //       }
      //     } catch (error) {
      //       if (error.response && error.response.status === 409) {
      //         setShowResend(true);
      //         alert('Email already exists. Would you like to resend the verification email?');
      //       } else {
      //         alert('Account creation failed');
      //       }
      //     }
      //   } else if (type === individual) {
      //     try {
      //       const data = {
      //         email: email,
      //         password: password,
      //         role: ROLE.INDIVIDUAL_EMPLOYER,
      //       };
      //       const individualRes = await axios.post(
      //         `${import.meta.env.VITE_API_URL}/register/${ROLE.INDIVIDUAL_EMPLOYER}`,
      //         data
      //       );

      //       if (individualRes.status === 201) {
      //         // alert("Individual employer account created successfully");
      //         navigate('/register/employer/business/account/verify', { state: { email } });
      //       } else {
      //         alert('Individual employer account creation failed');
      //       }
      //     } catch (error) {
      //       if (error.response && error.response.status === 409) {
      //         setShowResend(true);
      //         alert('Email already exists. Would you like to resend the verification email?');
      //       } else {
      //         alert('Account creation failed');
      //       }
      //     }
      //   }
      // } else {
        try {
          const data = {
            email: email,
            password: password,
            role: accountType,
          };
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/register/${accountType}`,
            data
          );
          if (res.status === 201) {
            navigate(`/register/${accountType}/verify`, { state: { email } });
          } else {
            alert('Account creation failed');
          }
        } catch (error) {
          if (error.response && error.response.status === 409) {
            setShowResend(true);
            alert('Email already exists. Would you like to resend the verification email?');
          } else {
            alert('Account creation failed');
          }
        }
      // }
    } catch (error) {
      if (error.response && error.response.status === 409) {
      } else {
        alert('Account creation failed');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      <Navbar userType={'register'} />
      <div className="slide-in-left flex justify-center items-center h-screen flex-col">
        <div className="pt-20 pb-20 pl-15 pr-15 rounded-2xl max-w-4xl flex flex-col bg-[rgba(94,209,214,0.1)] shadow-xl">

          <img className='w-15 h-15 mx-auto mb-5' src={icons.account_creation} alt="" />

          <div className='flex flex-col items-center'>
            <h1 className="font-bold text-2xl text-left text-[#1E293B]">
                Create Account as  
                {accountType === 'jobseeker' ? ' Job Seeker'
                  : 
                accountType === 'manpower-provider' ? ' Manpower Provider'
                  :
                accountType === 'business-employer' ? ' Business Employer'
                  :
                accountType === 'individual-employer' ? ' Individual Employer'
                  :
                ''}
                
            </h1>
            <span className='text-[#64748B] mb-10'>
              Fill in your details to get started 
            </span>
          </div>
        
          <form
            onSubmit={handleRegister}
            className="flex rounded-md flex-col"
          >
            <label htmlFor="email" className="mt-2 font-bold text-[#334155]">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              name="email"
              id="name"
              type="email"
              placeholder="Enter your email address"
              className="outline-none border border-[#E2E8F0] py-2 pl-5 h-auto text-sm rounded-lg text-[#94A3B8] mb-5 bg-white"
            />

           {/* Password */}
            <label htmlFor="password" className="mt-2 font-bold text-[#334155]">
              Enter password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="outline-none border border-[#E2E8F0] py-2 pl-5 pr-10 h-auto text-sm rounded-lg text-[#94A3B8] mb-5 bg-white w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/3 -translate-y-1/2 flex items-center justify-center cursor-pointer"
              >
                <img
                  src={showPassword ? icons.hide_password : icons.show_password}
                  alt="toggle password visibility"
                  className="w-5 h-5"
                />
              </button>
            </div>

            {/* Confirm Password */}
            <label htmlFor="confirmpassword" className="mt-2 font-bold text-[#334155]">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your password again"
                className="outline-none border border-[#E2E8F0] py-2 pl-5 pr-10 h-auto text-sm rounded-lg text-[#94A3B8] mb-5 bg-white w-full"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/3 -translate-y-1/2 flex items-center justify-center cursor-pointer"
              >
                <img
                  src={showConfirmPassword ? icons.hide_password : icons.show_password}
                  alt="toggle password visibility"
                  className="w-5 h-5"
                />
              </button>
            </div>

            <div className="flex justify-center mt-5 gap-10">
              <button
                type="submit"
                disabled={isRegistering} 
                className={`bg-[#2563EB] text-white pt-1 pb-1 pl-10 pr-10 w-50 text-sm ${
                  isRegistering
                    ? 'cursor-not-allowed bg-gray-400' 
                    : 'hover:bg-blue-800 cursor-pointer'
                }`}
              >
                {isRegistering ? 'Registering...' : 'Create Account'}
              </button>
            </div>
          </form>

          {showResend && (
            <div className="text-center mt-4">
              <p>Didn't get the verification email?</p>
              <button
                onClick={() => {
                  if (!email) {
                    alert('Please enter your email address first.');
                    return;
                  }

                  const resolvedRole =
                    accountType === 'employer'
                      ? type === business
                        ? ROLE.BUSINESS_EMPLOYER
                        : ROLE.INDIVIDUAL_EMPLOYER
                      : accountType;

                  resendVerification(
                    { email, role: resolvedRole },
                    {
                      onSuccess: () => {
                        alert('Verification email resent. Please check your inbox.');
                      },
                      onError: (error) => {
                        alert('Failed to resend verification email.');
                      },
                    }
                  );
                }}
                disabled={isResending}
                className={`text-blue-800 underline ${
                  isResending ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'
                }`}
              >
                {isResending ? 'Resending...' : 'Resend Verification Email'}
              </button>
            </div>
          )}

          <div className="flex justify-center mt-5 gap-10">
            <button
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => navigate(-1)} 
            >
              <img src={icons.back_arrow} alt="back" className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default RegisterAccount;
