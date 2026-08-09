import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Sparkles, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Success message state passed from Register page
  const registerSuccess = location.state?.registeredSuccess;
  const registeredEmail = location.state?.registeredEmail;
  const from = location.state?.from?.pathname || '/dashboard';

  // Pre-fill registered email if available
  React.useEffect(() => {
    if (registeredEmail) {
      setEmail(registeredEmail);
    }
  }, [registeredEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setLocalError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col items-center justify-center p-4 font-sans select-none relative">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-4"
      >
        {/* Prominent Always-Visible Top Left Back to Home Button */}
        <div className="flex items-center justify-between w-full">
          <Button
            type="button"
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4 text-[#F97316]" />}
            className="border-[#CBD5E1] text-[#334155] hover:text-[#0F172A] hover:bg-[#F1F5F9] font-semibold h-10 min-h-[44px]"
          >
            ← Back to Home
          </Button>

          <span className="text-[11px] font-mono text-[#64748B]">IntervAI v2.4</span>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <div
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-bold shadow-md shadow-[#F97316]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-[#0F172A]">
              Interv<span className="text-[#F97316]">AI</span>
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">Sign In to Your Account</h2>
          <p className="text-xs text-[#64748B]">Access your technical interview dashboard & AI practice sessions</p>
        </div>

        {/* Card Form */}
        <Card variant="glass" className="bg-white border-[#E2E8F0] p-6 shadow-xl rounded-2xl">
          <CardContent className="space-y-4 p-0">
            {/* Registration Success Banner */}
            {registerSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Account registered successfully! Please log in below.</span>
              </div>
            )}

            {/* Error Banner */}
            {(localError || error) && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{localError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#0F172A] block">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-3 h-11 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#F97316] focus:bg-white transition-all font-sans"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#0F172A] block">Password</label>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-3 h-11 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#F97316] focus:bg-white transition-all font-sans"
                  />
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                isLoading={isLoading}
                variant="glow"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full h-11 min-h-[44px] text-xs font-bold"
              >
                Sign In to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Link to Register */}
        <div className="text-center text-xs text-[#64748B] pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-[#EA580C] hover:underline">
            Register Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
