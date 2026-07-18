import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../../redux/slices/authSlice.js';
import { Lock, Mail, ShieldAlert, Award } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      redirectUser(user.role);
    }
    dispatch(reset());
  }, [isAuthenticated, user, navigate, dispatch]);

  const redirectUser = (role) => {
    switch (role) {
      case 'State Agent':
        navigate('/state-dashboard');
        break;
      case 'Divisional Agent':
        navigate('/divisional-dashboard');
        break;
      case 'District Agent':
        navigate('/district-dashboard');
        break;
      case 'Pincode Agent':
        navigate('/pincode-dashboard');
        break;
      case 'Admin':
        navigate('/state-dashboard'); // Admin can view State dashboard
        break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(login({ email, password }));
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setIsForgotLoading(true);
    setForgotMessage('');
    setForgotError('');

    try {
      const response = await axios.post('/api/auth/forgot-password', { email: forgotEmail });
      setForgotMessage(response.data.message);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forge-darker flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-forge-accent opacity-20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-forge-gold opacity-10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md bg-forge-dark/80 backdrop-blur-md border border-forge-card/50 rounded-2xl shadow-2xl p-8 relative z-10">
        
        {/* Logo and Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-forge-card border border-forge-gold/30 rounded-xl flex items-center justify-center mb-3 shadow-lg">
            <Award className="w-10 h-10 text-forge-gold animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider text-white">
            FORGE INDIA
          </h1>
          <p className="text-xs text-forge-gold font-semibold uppercase tracking-widest mt-1">
            Connect Hierarchy
          </p>
        </div>

        {/* Status Error Display */}
        {isError && (
          <div className="mb-6 bg-red-950/50 border border-red-800/80 text-red-200 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
            <span>{message || 'Invalid credentials'}</span>
          </div>
        )}

        {!showForgot ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-2">
                Email-id
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-forge-grayText">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="agent@forgeindia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white pl-10 pr-4 py-3 rounded-lg outline-none transition duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-forge-grayText">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white pl-10 pr-4 py-3 rounded-lg outline-none transition duration-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-forge-gold hover:underline font-medium transition"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-forge-gold to-yellow-600 hover:from-yellow-600 hover:to-forge-gold text-forge-dark font-bold py-3 rounded-lg shadow-lg hover:shadow-yellow-500/20 active:scale-[0.98] transition-all duration-200"
            >
              {isLoading ? 'Signing In...' : 'Login Securely'}
            </button>

            {/* Quick Demo Credentials Panel */}
            <div className="mt-8 pt-6 border-t border-forge-card/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-forge-gold mb-2">
                Demo Accounts (Password: password123)
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-forge-grayText">
                <div>State: <span className="text-white block font-medium">stateagent@forgeindia.com</span></div>
                <div>Division: <span className="text-white block font-medium">divisionagent@forgeindia.com</span></div>
                <div>District: <span className="text-white block font-medium">districtagent@forgeindia.com</span></div>
                <div>Pincode: <span className="text-white block font-medium">pincodeagent@forgeindia.com</span></div>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
            <h2 className="text-lg font-bold text-white mb-2">Reset Password</h2>
            <p className="text-xs text-forge-grayText mb-4">
              Enter your email address and we'll simulate sending you a password reset link.
            </p>

            {forgotMessage && (
              <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs px-3 py-2 rounded">
                {forgotMessage}
              </div>
            )}

            {forgotError && (
              <div className="bg-red-950/40 border border-red-800 text-red-200 text-xs px-3 py-2 rounded">
                {forgotError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-2">
                Email-id
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-forge-grayText">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="agent@forgeindia.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white pl-10 pr-4 py-3 rounded-lg outline-none transition duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isForgotLoading}
              className="w-full bg-forge-gold text-forge-dark font-bold py-3 rounded-lg shadow-lg hover:bg-forge-goldHover transition"
            >
              {isForgotLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForgot(false);
                setForgotMessage('');
                setForgotError('');
              }}
              className="w-full text-forge-grayText hover:text-white font-medium py-2 text-center text-sm block"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
