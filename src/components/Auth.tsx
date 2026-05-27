import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Route as RouteIcon, Mail, Lock, Shield, Globe, Loader2 } from 'lucide-react';

interface AuthProps {
    view: 'sign-in' | 'sign-up';
    onViewChange: (view: 'sign-in' | 'sign-up') => void;
}

const Auth: React.FC<AuthProps> = ({ view, onViewChange }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (view === 'sign-up') {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialAuth = async (provider: 'google' | 'github') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#030712] relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506012733851-00f78348a501?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/80 via-[#030712]/40 to-[#030712]"></div>

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl mb-4">
                        <RouteIcon className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Sunday Drives</h1>
                    <p className="text-slate-400 text-sm mt-1">Premium Route Exploration</p>
                </div>

                <div className="bg-[#090d16]/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-xl font-semibold text-white mb-2">
                        {view === 'sign-in' ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                    <p className="text-slate-400 text-sm mb-6">
                        {view === 'sign-in' ? 'Welcome back! Please enter your details.' : 'Start your journey with us today.'}
                    </p>

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-emerald-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm uppercase tracking-wider mt-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : view === 'sign-in' ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                            <span className="bg-[#090d16] px-3 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => handleSocialAuth('google')}
                            className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 py-2.5 rounded-xl text-sm font-medium text-slate-300 transition-all"
                        >
                            <Globe className="w-4 h-4" />
                            <span>Google</span>
                        </button>
                        <button 
                            onClick={() => handleSocialAuth('github')}
                            className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 py-2.5 rounded-xl text-sm font-medium text-slate-300 transition-all"
                        >
                            <Shield className="w-4 h-4" />
                            <span>GitHub</span>
                        </button>
                    </div>

                    <p className="mt-8 text-center text-xs text-slate-500">
                        {view === 'sign-in' ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button 
                            onClick={() => onViewChange(view === 'sign-in' ? 'sign-up' : 'sign-in')}
                            className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                        >
                            {view === 'sign-in' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
