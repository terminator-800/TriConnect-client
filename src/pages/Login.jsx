import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import Navbar from './Navbar';
import icons from '../assets/svg/Icons';
import '../components/animation/animation.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password, rememberMe });
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
      setEmail('');
      setPassword('');
    }
  };

  return (
    <>
      <Navbar userType={'login'} />
      <div className="slide-in-left flex justify-center items-center h-[110vh] max-[769px]:h-[190vh] max-[769px]:gap-5 bg-linear-to-b from-white to-[#00C2CB] overflow-x-hidden">
        <div className="flex max-[769px]:flex-col">

          <div className="relative flex flex-col items-center 
            xl:max-w-xl 
            lg:max-w-lg lg:ml-20 
            md:max-w-md md:ml-0
            max-[769px]:max-w-full max-[769px]:w-full
            bg-[#00C2CB] p-15 overflow-hidden">          
            {/* Three people image - can overflow */}
            <img 
              src={icons.login_3_people} 
              alt="login_3_people" 
              className="w-[500px] top-20 relative z-0 -mt-10 ml-10
                max-[1024px]:w-full
              " 
            />

            <img
              src={icons.circle}
              alt="circle"
              className="w-50 absolute top-113 right-20 z-20"
              style={{
                animation: 'float 4s ease-in-out infinite',
              }}
            />

             <img
              src={icons.circle}
              alt="circle"
              className="float-orbit w-40 absolute top-[-30px] right-100 z-20"
            />

            <img
              src={icons.circle}
              alt="circle"
              className="float w-60 absolute top-25 right-115"
            />

             <img
              src={icons.circle}
              alt="circle"
              className="float-orbit w-80 absolute top-90 right-90"
            />

             <img
              src={icons.tool_login}
              alt="tool"
              className="float w-150 absolute top-[-150px] right-[-300px]"
            />
          </div>


          <div className="bg-[#00C2CB] 
            max-[769px]:w-full 
            max-[769px]:flex max-[769px]:justify-center">    
           <form
            onSubmit={handleLogin}
            className="flex flex-col p-15 bg-white 
              xl:w-xl xl:rounded-l-3xl
              lg:w-lg lg:rounded-l-3xl
              md:w-md md:rounded-l-3xl
              max-[769px]:w-full max-[769px]:rounded-3xl max-[769px]:mx-4
              h-[576px]"
          >
              <h1 className="font-bold text-3xl text-[#1E293B]">Welcome to <span className='text-blue-900'>TriConnect!</span></h1>
              <p className="text-[#64748B] mb-10 mt-2">Login your account details</p>

              <label htmlFor="email" className="text-[#334155] font-bold">
                Username
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your username"
                required
                className="border rounded outline-none px-5 py-2 mb-5 border-[#E2E8F0] text-sm bg-[rgba(94,209,214,0.1)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="password" className="text-[#334155] font-bold">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  className="border rounded outline-none px-5 py-2 pr-12 mb-5 border-[#E2E8F0] text-sm bg-[rgba(94,209,214,0.1)] w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/3 -translate-y-1/2 cursor-pointer"
                >
                  <img
                    src={showPassword ? icons.hide_password : icons.show_password}
                    alt="toggle password"
                    className="w-5 h-5"
                  />
                </button>
              </div>
              
              {/* REMEMBER ME */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="cursor-pointer accent-blue-900 hover:accent-[#2563EB]"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-[#64748B] hover:text-[#2563EB] cursor-pointer "
                  >
                    Remember me
                  </label>
                </div>
              
                {/* FORGOT PASSWORD */}
                <button
                  type="button"
                  className="text-[#64748B] hover:text-[#2563EB] cursor-pointer text-sm"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot password?
                </button>
              </div>

              
             {/* LOGIN BUTTON */}
              <div className="mt-10 flex items-center flex-col">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="hover:bg-[#2563EB] bg-blue-900 text-white mt-2 py-2 cursor-pointer w-full max-w-[250px] mb-5"
                >
                  {isLoading ? 'Signing in...' : 'Login'}
                </button>

                <p className="text-gray-600 text-sm">
                  Don't have an account?
                  <Link to={'/register'} className="hover:text-[#2563EB] text-blue-900 cursor-pointer ml-3">
                    Sign up
                  </Link>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
