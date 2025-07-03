'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

const LoginRegisterForm: React.FC = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('welcome'); // 'welcome', 'email', 'otp'
  
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const sendOTP = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setSending(true);
    setSuccess('');
    setError('');

    const res = await fetch('/api/email/send', {
      method: 'POST',
      body: JSON.stringify({
        to: email,
        subject: 'Your OTP Code - Home Services',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    setSending(false);

    if (res.ok) {
      setSuccess('OTP sent successfully to your email!');
      setStep('otp');
    } else {
      setError(data.error || 'Failed to send OTP.');
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP code');
      return;
    }

    setSending(true);
    setError('');
    
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, name: email.split('@')[0], password: otp }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    setSending(false);

    if (!res.ok) {
      setError(data.error || 'Invalid OTP code');
    } else {
      // Auto-login after register
      await signIn('credentials', {
        email,
        redirect: true,
        callbackUrl,
      });
    }
  };

  const showEmailForm = () => {
    setStep('email');
    setError('');
    setSuccess('');
  };

  const goBack = () => {
    if (step === 'otp') {
      setStep('email');
    } else if (step === 'email') {
      setStep('welcome');
    }
    setError('');
    setSuccess('');
  };

  return (
    <div className="tf-login-form">
      {/* Welcome Step */}
      {step === 'welcome' && (
        <div>
          <h5 className="mb_36 text-center">Welcome</h5>
          <p className="mb_30">
            To access our home services you need to be a member.
          </p>
          <div className="auth-feature mb_30">
            <i className="fas fa-check-circle text-success me-2"></i>
            <span>No charge. That's totally free</span>
          </div>

          <div className="social-login-buttons mb_30">
            <button 
              className="tf-btn w-100 radius-3 btn-line mb_15 justify-content-center"
              onClick={() => signIn('facebook', { callbackUrl })}
            >
              <i className="fab fa-facebook-f me-2"></i>
              Continue with Facebook
            </button>

            <button 
              className="tf-btn w-100 radius-3 btn-line mb_15 justify-content-center"
              onClick={() => signIn('google', { callbackUrl })}
            >
              <i className="fab fa-google me-2"></i>
              Continue with Google
            </button>
          </div>

          <div className="tf-divider mb_30">
            <span>or</span>
          </div>

          <button 
            className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
            onClick={showEmailForm}
          >
            Continue with email
          </button>
        </div>
      )}

      {/* Email Step */}
      {step === 'email' && (
        <div>
          <div className="mb_36">
            <button className="tf-btn btn-line mb_15" onClick={goBack}>
              <i className="fas fa-arrow-left me-2"></i>
              Back
            </button>
            <h5 className="mb_15">Enter your email</h5>
            <p>We'll send you a verification code</p>
          </div>

          {error && (
            <div className="alert alert-danger mb_15" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success mb_15" role="alert">
              {success}
            </div>
          )}

          <div className="tf-field style-1 mb_30">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="tf-field-input tf-input"
              id="email"
              required
            />
            <label className="tf-field-label" htmlFor="email">
              Email address
            </label>
          </div>

          <button
            className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
            onClick={sendOTP}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Continue'}
          </button>
        </div>
      )}

      {/* OTP Step */}
      {step === 'otp' && (
        <div>
          <div className="mb_36">
            <button className="tf-btn btn-line mb_15" onClick={goBack}>
              <i className="fas fa-arrow-left me-2"></i>
              Back
            </button>
            <h5 className="mb_15">Enter verification code</h5>
            <p>Please enter the code we sent to {email}</p>
          </div>

          {error && (
            <div className="alert alert-danger mb_15" role="alert">
              {error}
            </div>
          )}

          <div className="tf-field style-1 mb_30">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="tf-field-input tf-input"
              id="otp"
              required
            />
            <label className="tf-field-label" htmlFor="otp">
              Verification Code
            </label>
          </div>

          <button
            className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
            onClick={verifyOTP}
            disabled={sending}
          >
            {sending ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginRegisterForm; 