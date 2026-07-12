import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Anchor, Shield, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side: Premium illustration & Info */}
      <div className="hidden lg:flex w-1/2 bg-port-navy p-16 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-port-blue opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-success opacity-10 rounded-full blur-3xl"></div>
        
        {/* Brand */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-port-blue rounded flex items-center justify-center shadow-card">
            <Anchor size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-title-lg font-bold tracking-wider leading-none">VADHVAN PORT</h1>
            <span className="text-[10px] text-white/50 tracking-widest font-semibold uppercase">Smart TransitSync</span>
          </div>
        </div>

        {/* Feature info */}
        <div className="z-10 max-w-lg space-y-8 my-auto">
          <h2 className="text-display-lg font-bold leading-tight">
            Smart Transit & Resource Synchronization Platform
          </h2>
          <p className="text-body-md text-white/70">
            Digitally sync containers, ships, cranes, rail yards, warehouses, vehicles, and drivers into a single cohesive Digital Twin ERP.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1 bg-white/10 rounded">
                <Shield size={16} className="text-port-blue" />
              </div>
              <div>
                <h4 className="text-body-sm font-semibold">Port Command Center</h4>
                <p className="text-xs text-white/50">Live maps, health scores, alerts, and turnaround time monitoring.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1 bg-white/10 rounded">
                <Shield size={16} className="text-port-blue" />
              </div>
              <div>
                <h4 className="text-body-sm font-semibold">Recommendation Dispatch Engine</h4>
                <p className="text-xs text-white/50">Algorithmic selection of optimal vehicle, driver, and crane configurations.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-xs text-white/40 flex justify-between items-center">
          <span>Vadhvan Port Operations Command © 2026</span>
          <span className="flex items-center gap-1">TransitOps Problem Statement <ArrowRight size={12} /></span>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-container-low">
        <div className="w-full max-w-md bg-white border border-outline-variant rounded-md shadow-card p-10">
          <div className="text-center mb-8">
            <h3 className="text-headline-md font-bold text-on-surface">Sign in to PortSync</h3>
            <p className="text-body-sm text-on-surface-variant mt-1">Enter your credentials to manage port operations</p>
          </div>

          {errorMsg && (
            <div className="alert-error text-xs mb-6">
              <p className="font-semibold">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="operator@vadhvanport.in"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="form-label mb-0">Password</label>
                <a href="#forgot" className="text-[11px] text-port-blue font-semibold hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="form-input pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-outline-variant text-port-blue focus:ring-port-blue/20"
                defaultChecked
              />
              <label htmlFor="remember" className="ml-2 text-xs text-on-surface-variant select-none">
                Keep me signed in for 7 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-2.5 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Credentials info */}
          <div className="mt-8 pt-6 border-t border-outline-variant/60">
            <h4 className="text-xs font-bold text-on-surface mb-2 uppercase tracking-wider">Demo Access Credentials</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant bg-surface-container-low p-3 rounded">
              <div>
                <p className="font-semibold text-on-surface">Administrator:</p>
                <p>admin@vadhvanport.in</p>
                <p>Admin@123</p>
              </div>
              <div>
                <p className="font-semibold text-on-surface">Fleet Manager:</p>
                <p>fleet@vadhvanport.in</p>
                <p>Fleet@123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
