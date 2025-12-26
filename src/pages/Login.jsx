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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
      setEmail('');
      setPassword('');
    }
  };




  return (
    <>
      <Navbar userType={'login'} />
      <div className="slide-in-left flex justify-center items-center h-[110vh] max-[769px]:h-[190vh] max-[769px]:gap-5 bg-linear-to-b from-white to-[#00C2CB]">
        <div className="flex xl:flex-row max-[769px]:flex-col">

          <div className="relative flex flex-col items-center xl:w-xl lg:w-lg md:w-md sm:w-sm h-[576px] lg:ml-20 bg-[#00C2CB] p-15 overflow-hidden">
          
            {/* Three people image - can overflow */}
            <img 
              src={icons.login_3_people} 
              alt="login_3_people" 
              className="w-[500px] top-20 relative z-0 -mt-10 ml-10" 
            />

            {/* Logo - on top */}
            <img 
              src={icons.login_logo} 
              alt="login_logo" 
              className="w-20 absolute top-76 right-64 z-20"
              
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


          <div className='bg-[#00C2CB]'>
            <form
              onSubmit={handleLogin}
              className="flex flex-col p-15 bg-white xl:w-xl lg:w-lg sm:w-sm md:w-md h-[576px] rounded-l-3xl"
            >
              <h1 className="font-bold text-2xl text-blue-900">Login</h1>
              <p className="text-blue-900 mb-10 mt-2">Enter your account details</p>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
                className="border rounded outline-none p-2 mb-5 border-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
                className="border rounded outline-none p-2 mb-5 border-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-900 text-white mt-2 mb-2 rounded pt-2 pb-2 cursor-pointer"
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </button>
              <button
                type="button"
                className="text-gray-600 self-start mt-1 hover:text-blue-600 cursor-pointer "
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </button>

              <div className="mt-25">
                <p className="text-gray-600">
                  Don't have an account?
                  <Link to={'/register'} className="text-blue-900 cursor-pointer ml-3">
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
