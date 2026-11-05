import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Cpu } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 bg-radial-gradient">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 items-center justify-center font-bold text-white shadow-glow-indigo">
            <Cpu className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Reset Password</h1>
          <p className="text-xs text-slate-400">Recover your enterprise account credentials</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-glass space-y-5">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Recovery Instructions Sent</h3>
              <p className="text-xs text-slate-400">
                If an account exists for <strong className="text-slate-200">{email}</strong>, a secure reset token has been dispatched.
              </p>
              <Link
                to="/login"
                className="inline-block mt-2 px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <p className="text-xs text-slate-400">
                Enter your verified corporate email address to receive password reset instructions.
              </p>
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Corporate Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@workforce.io"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-glow-indigo transition"
              >
                Send Password Reset Token
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center text-xs text-slate-400 hover:text-slate-200 gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
