"use client";

import React, { useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Github, Chrome } from 'lucide-react';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await getSupabase().auth.signUp({ email, password });
        if (error) throw error;
        alert('Kayıt başarılı! Lütfen e-postanızı kontrol edin.');
      } else {
        const { error } = await getSupabase().auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/dashboard'; // Redirect on success
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      const { error } = await getSupabase().auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-10 border-white/[0.05] relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />

        <div className="text-center mb-8 space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight">
            {isSignUp ? 'Erken Erişim' : 'Hoş Geldiniz'}
          </h2>
          <p className="text-white/40 text-sm font-medium">
            {isSignUp ? 'OstlerTech dünyasına ilk adımı atın.' : 'Kasanıza güvenli bir giriş yapın.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">E-Posta</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Şifre</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all"
                required
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full !py-4 flex items-center justify-center gap-2 group mt-6"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-white/20">
            <span className="bg-[#0D1B2A] px-4">VEYA</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSocialLogin('github')}
            className="flex items-center justify-center gap-2 p-3 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.05] transition-colors text-white/60 text-xs font-bold"
          >
            <Github size={18} /> GitHub
          </button>
          <button
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-2 p-3 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.05] transition-colors text-white/60 text-xs font-bold"
          >
            <Chrome size={18} /> Google
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-bold text-white/40 hover:text-primary transition-colors"
          >
            {isSignUp ? 'Zaten hesabınız var mı? Giriş Yap' : 'Henüz hesabınız yok mu? Kayıt Ol'}
          </button>
        </div>
      </motion.div>

      <div className="mt-8 flex items-center justify-center gap-4 text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-primary/50" />
          End-To-End Encrypted
        </div>
        <div className="w-1 h-1 rounded-full bg-white/10" />
        <div>Auth v2.4</div>
      </div>
    </div>
  );
}
