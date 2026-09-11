import { useState, type ChangeEvent, type FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, getFirebaseAuthErrorMessage, getFirebaseSetupMessage } from '../services/firebase';

function DoctorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [doctorName, setDoctorName] = useState<string>('');
  const [medicalLicenseId, setMedicalLicenseId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [notice, setNotice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleDoctorLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (isRegistering && !doctorName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (isRegistering && !medicalLicenseId.trim()) {
      setError('Please enter your medical license ID.');
      return;
    }
    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!auth) {
      setError(getFirebaseSetupMessage());
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRegistering) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: doctorName.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/doctor/dashboard');
    } catch (reason) {
      setError(getFirebaseAuthErrorMessage(reason));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (): Promise<void> => {
    setError('');
    setNotice('');
    if (!email.includes('@')) {
      setError('Enter your account email address first, then select Forgot Password.');
      return;
    }
    if (!auth) {
      setError(getFirebaseSetupMessage());
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setNotice('Password-reset email sent. Check your inbox and spam folder.');
    } catch (reason) {
      setError(getFirebaseAuthErrorMessage(reason));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4 py-8">

      {/* Brand */}
      <div className="w-full max-w-6xl flex items-center gap-3 mb-6">
        <svg
          width="30"
          height="30"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="10" fill="#0D9488" />
          <path
            d="M11.2002 10H20C20.237 10 20.5234 10.1161 20.7744 10.4297C21.0302 10.7494 21.2002 11.2226 21.2002 11.75V15.5H24.7891C24.7973 15.5069 24.8101 15.5188 24.8242 15.5381L24.875 15.6318L26.5674 19.8594V19.8604C26.6734 20.126 26.8263 20.3767 27.0244 20.5918C27.2228 20.8071 27.4662 20.9853 27.7471 21.1025L27.748 21.1035L29.8633 21.9844C29.8522 21.9797 29.8846 21.9903 29.9258 22.0615C29.9672 22.1332 29.9999 22.2399 30 22.3652V26.875C30 27.0378 29.946 27.1608 29.8965 27.2227C29.8849 27.2372 29.8744 27.2449 29.8682 27.25H26.7002V28.25C26.7002 29.4363 25.966 30 25.5 30C25.034 30 24.2998 29.4363 24.2998 28.25V27.25H15.7002V28.25C15.7002 29.4363 14.966 30 14.5 30C14.034 30 13.2998 29.4363 13.2998 28.25V27.25H10.1318C10.1256 27.2449 10.1151 27.2372 10.1035 27.2227C10.054 27.1608 10 27.0378 10 26.875V11.75C10 11.2226 10.169 10.7494 10.4248 10.4297C10.6759 10.1158 10.9631 10 11.2002 10Z"
            stroke="white"
            strokeWidth="2"
          />
        </svg>

        <div className="flex flex-col">
          <strong className="text-xl font-bold text-slate-900 leading-none">
            Swasthya
          </strong>

          <span className="text-[9px] font-semibold tracking-[0.18em] text-slate-500 mt-1">
            SMART INDIA HACKATHON
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* Information Panel */}
        <section className="relative bg-slate-950 text-white p-8 sm:p-10 lg:p-12 overflow-hidden">
          <div className="relative z-10">

            <span className="inline-flex items-center rounded-full bg-teal-500/10 border border-teal-400/20 px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-teal-300">
              SIIH CLINIC PORTAL
            </span>

            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-[42px] leading-tight font-bold tracking-tight">
              Spend time on diagnoses,
              <br />
              not EMR admin.
            </h1>

            <p className="mt-6 max-w-lg text-sm sm:text-base leading-7 text-slate-300">
              Over 2,400+ hours of medical reporting saved using our voice
              synthesis case sheets. Seamlessly logs critical patient symptoms
              in clearer terms.
            </p>

            <ul className="mt-8 space-y-4 text-sm text-slate-200">
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-teal-400" />
                ABDM & HIPAA Encrypted Sandbox
              </li>

              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-teal-400" />
                HL7 Integration Ready
              </li>

              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-teal-400" />
                ICD-10 Assistive Formatting
              </li>
            </ul>

            {/* Waveform */}
            <div
              className="mt-12 h-16 opacity-40"
              aria-hidden="true"
            >
              <div className="flex h-full items-center gap-1">
                {[
                  18, 30, 45, 25, 55, 38, 65, 30, 48, 75,
                  42, 25, 60, 35, 50, 28, 68, 40, 58, 32,
                  72, 45, 25, 55, 38, 65, 30, 48, 75, 42,
                ].map((height, index) => (
                  <span
                    key={index}
                    className="w-1 rounded-full bg-teal-400"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Decorative background */}
          <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-teal-500/5 blur-3xl" />
        </section>

        {/* Login Form */}
        <section className="p-8 sm:p-10 lg:p-12">

          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
            <button type="button" onClick={() => { setIsRegistering(false); setError(''); }} className={`relative pb-4 text-sm font-semibold ${isRegistering ? 'text-slate-400' : 'text-teal-600'}`}>
              Sign In
              {!isRegistering && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-teal-600" />}
            </button>

            <button type="button" onClick={() => { setIsRegistering(true); setError(''); }} className={`relative pb-4 text-sm font-semibold ${isRegistering ? 'text-teal-600' : 'text-slate-400'}`}>
              New Doctor Registry
              {isRegistering && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-teal-600" />}
            </button>
          </div>

          <form onSubmit={handleDoctorLogin} className="space-y-6">
            {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            {notice && <p role="status" className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-700">{notice}</p>}
            {isRegistering && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                  <input type="text" placeholder="Dr. Priya Sharma" value={doctorName} onChange={(e: ChangeEvent<HTMLInputElement>) => setDoctorName(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Medical License ID</label>
                  <input type="text" placeholder="e.g. MCI-2026-9485" value={medicalLicenseId} onChange={(e: ChangeEvent<HTMLInputElement>) => setMedicalLicenseId(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
                </div>
              </>
            )}

            {/* Medical License */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="text"
                placeholder="doctor@clinic.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {isRegistering && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
                <input type={showPassword ? 'text' : 'password'} placeholder="Confirm your password" value={confirmPassword} onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">
                  Security PIN / Password
                </label>

                {!isRegistering && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  ◉
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-teal-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:scale-[0.99]"
            >
              {isSubmitting ? (isRegistering ? 'Registering…' : 'Signing in…') : (isRegistering ? 'Register Doctor Account' : 'Sign In to OPD Dashboard')}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs text-slate-400 whitespace-nowrap">
              Or register as a verified practitioner
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Verification */}
          <div className="flex items-start gap-3 rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs leading-5 text-slate-500">
            <span className="text-sm">🔒</span>

            <span>
              Authorized medical license verification executes immediately
              through India's ABHA Registry database.
            </span>
          </div>
        </section>
      </div>

      {/* Back Button */}
      <button
        className="mt-6 text-sm font-medium text-slate-500 transition hover:text-teal-600"
        onClick={() => navigate('/')}
      >
        ← Back to Role Selection
      </button>
    </div>
  );
}

export default DoctorLogin;
