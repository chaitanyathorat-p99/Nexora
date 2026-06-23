import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Assuming you have a central place for API URL
// import FormInput from '../components/FormInput'; // Assuming a FormInput component exists
// import { InlineLoader, OverlayLoader } from '../components/LoadingSpinner'; // Assuming loading components exist
import { message } from 'antd'; // Using antd message instead of react-toastify
import { url } from '../../components/common/api';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) {
      // Redirect to forgot password if email is not found in local storage
      navigate('/forgot-password');
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${url}/auth/verify-reset-otp`, { email, otp });
      message.success('OTP verified successfully');
      // Store OTP for the next step
      localStorage.setItem('resetOTP', otp);
      navigate('/reset-password');
    } catch (error) {
      console.error('Verify OTP error:', error);
      message.error(error.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify OTP
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter the OTP sent to your email
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <div className="mt-1">
                {/* Replace with FormInput component if available */}
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                 {/* Replace with InlineLoader component if available */}
                {loading ? 'Verifying OTP...' : 'Verify OTP'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
              Back to Forgot Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP; 