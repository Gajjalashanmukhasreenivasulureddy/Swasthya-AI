import { useState, type ChangeEvent, type FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, getFirebaseAuthErrorMessage, getFirebaseSetupMessage } from '../services/firebase';

function PatientLogin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [notice, setNotice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!identifier.includes('@')) {
      setError('Please use an email address. SMS sign-in needs Firebase Phone Authentication setup.');
      return;
    }

    if (!auth) {
      setError(getFirebaseSetupMessage());
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, identifier, password);
      } else {
        const credential = await createUserWithEmailAndPassword(auth, identifier, password);
        await updateProfile(credential.user, { displayName: fullName });
      }
      navigate('/patient/dashboard');
    } catch (reason) {
      setError(getFirebaseAuthErrorMessage(reason));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (): Promise<void> => {
    setError('');
    setNotice('');
    if (!identifier.includes('@')) {
      setError('Enter your account email address first, then select Forgot Password.');
      return;
    }
    if (!auth) {
      setError(getFirebaseSetupMessage());
      return;
    }
    try {
      await sendPasswordResetEmail(auth, identifier);
      setNotice('Password-reset email sent. Check your inbox and spam folder.');
    } catch (reason) {
      setError(getFirebaseAuthErrorMessage(reason));
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    if (!auth) {
      setError(getFirebaseSetupMessage());
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate('/patient/dashboard');
    } catch (reason) {
      setError(getFirebaseAuthErrorMessage(reason));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white px-6 py-8 sm:px-8 sm:py-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-3">
            {/* Replace this SVG with your exact Figma export later */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="40"
                height="40"
                rx="10"
                fill="#0D9488"
              />
              <path
                d="M11.2002 10H20C20.237 10 20.5234 10.1161 20.7744 10.4297C21.0302 10.7494 21.2002 11.2226 21.2002 11.75V15.5H24.7891C24.7973 15.5069 24.8101 15.5188 24.8242 15.5381L24.875 15.6318L26.5674 19.8594V19.8604C26.6734 20.126 26.8263 20.3767 27.0244 20.5918C27.2228 20.8071 27.4662 20.9853 27.7471 21.1025L27.748 21.1035L29.8633 21.9844C29.8522 21.9797 29.8846 21.9903 29.9258 22.0615C29.9672 22.1332 29.9999 22.2399 30 22.3652V26.875C30 27.0378 29.946 27.1608 29.8965 27.2227C29.8849 27.2372 29.8744 27.2449 29.8682 27.25H26.7002V28.25C26.7002 29.4363 25.966 30 25.5 30C25.034 30 24.2998 29.4363 24.2998 28.25V27.25H15.7002V28.25C15.7002 29.4363 14.966 30 14.5 30C14.034 30 13.2998 29.4363 13.2998 28.25V27.25H10.1318C10.1256 27.2449 10.1151 27.2372 10.1035 27.2227C10.054 27.1608 10 27.0378 10 26.875V11.75C10 11.2226 10.169 10.7494 10.4248 10.4297C10.6759 10.1158 10.9631 10 11.2002 10Z"
                stroke="white"
                strokeWidth="2"
              />
            </svg>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Swasthya
            </h2>
          </div>

          <p className="mt-2 text-[11px] font-semibold tracking-[0.2em] text-teal-600">
            PATIENT PORTAL
          </p>
        </div>

        <h3 className="mt-8 text-center text-2xl font-bold leading-tight text-slate-900">
          Share your health story with AI assistance
        </h3>

        <p className="description mt-3 text-center text-sm leading-6 text-slate-500">
          Calmly explain symptoms, upload records, and prepare for your doctor consult in your language.
        </p>

        <div className="mt-7 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            className={`rounded-md px-4 py-2.5 text-sm font-semibold transition ${
              isLogin
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>

          <button
            type="button"
            className={`rounded-md px-4 py-2.5 text-sm font-semibold transition ${
              !isLogin
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-7">
          {error && <p role="alert" className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {notice && <p role="status" className="mb-5 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-700">{notice}</p>}
          {isLogin ? (
            <>
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number or Email Address
                </label>

                <input
                  type="text"
                  placeholder="e.g., +91 98765 43210 or name@example.com"
                  value={identifier}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setIdentifier(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    Forgot Password?
                  </button>
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />

                <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setShowPassword(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 accent-teal-600"
                  />
                  Show password
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:scale-[0.99]"
              >
                {isSubmitting ? 'Signing in…' : 'Secure Login'}
              </button>
            </>
          ) : (
            <>
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFullName(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number or Email Address
                </label>

                <input
                  type="text"
                  placeholder="e.g., +91 98765 43210 or name@example.com"
                  value={identifier}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setIdentifier(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />

                <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setShowPassword(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 accent-teal-600"
                  />
                  Show password
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:scale-[0.99]"
              >
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </button>
            </>
          )}
        </form>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="whitespace-nowrap text-xs text-slate-400">
            or continue with
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {/* Google Logo SVG */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>

            Google
          </button>

          <button
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 10V14M16 10V14M4 6H20V18H4V6Z"
                stroke="#4a5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            OTP (SMS)
          </button>
        </div>

        <p className="mt-6 text-center text-[11px] leading-5 text-slate-400">
          By continuing, you agree to Swasthya's clinical consent protocols & NDHM guidelines for secure medical data handling.
        </p>
      </div>
    </div>
  );
}

export default PatientLogin;
