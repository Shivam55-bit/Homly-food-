import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { loginUser } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { ShieldCheck, ArrowRight, RotateCcw, Lock } from 'lucide-react';

export const OTPVerification: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const phone = location.state?.phone || '9876543210';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      dispatch(
        addToast({
          type: 'warning',
          title: 'Enter Complete OTP',
          message: 'Please enter all 6 digits of the OTP.'
        })
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(loginUser(phone));
      dispatch(
        addToast({
          type: 'success',
          title: 'Phone Verified Successfully!',
          message: 'Welcome back to Homly Food'
        })
      );
      navigate('/');
    }, 400);
  };

  const handleResend = () => {
    setTimer(45);
    setOtp(['', '', '', '', '', '']);
    inputsRef.current[0]?.focus();
    dispatch(
      addToast({
        type: 'info',
        title: 'New OTP Sent',
        message: `Verification code resent to +91 ${phone}`
      })
    );
  };

  // Auto verify if demo filled
  const handleFillDemoOtp = () => {
    setOtp(['5', '4', '3', '2', '1', '0']);
    setTimeout(() => {
      dispatch(loginUser(phone));
      dispatch(
        addToast({
          type: 'success',
          title: 'OTP Auto-Verified!',
          message: 'Logged in successfully'
        })
      );
      navigate('/');
    }, 200);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 mb-3">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Verify Phone Number
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Enter the 6-digit code sent to{' '}
          <span className="font-bold text-slate-800">+91 {phone}</span>
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
        <form onSubmit={handleVerify} className="space-y-6">
          {/* OTP Box Inputs */}
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-13 text-center text-xl font-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend timer */}
        <div className="mt-5 flex items-center justify-between text-xs pt-4 border-t border-slate-100">
          <span className="text-slate-500">
            {timer > 0 ? (
              <span>Resend code in <strong className="text-slate-800">{timer}s</strong></span>
            ) : (
              'Didn\'t receive OTP?'
            )}
          </span>

          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0}
            className="text-orange-600 font-bold hover:underline disabled:opacity-40 disabled:hover:no-underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resend OTP</span>
          </button>
        </div>

        {/* Fast Fill Demo Button */}
        <button
          type="button"
          onClick={handleFillDemoOtp}
          className="w-full mt-4 py-2 bg-orange-50 hover:bg-orange-100/80 text-orange-700 font-bold rounded-xl text-xs border border-orange-200 transition-colors"
        >
          ⚡ Auto-Fill Demo OTP (543210)
        </button>
      </div>
    </div>
  );
};
