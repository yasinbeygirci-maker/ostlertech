"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WaitlistProps {
  productName?: string;
  className?: string;
}

import { motion, AnimatePresence } from 'framer-motion';

export default function Waitlist({ productName = "OstlerTech", className }: WaitlistProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{
          email,
          product: productName,
          source: 'landing_page'
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setMessage('Bu e-posta zaten listemizde kayıtlı.');
        } else {
          throw error;
        }
        setStatus('error');
      } else {
        setStatus('success');
        setMessage('Harika! Listeye başarıyla eklendiniz.');
        setEmail('');
      }
    } catch (err) {
      console.error('Waitlist error:', err);
      setStatus('error');
      setMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="flex items-center justify-center space-x-3 p-6 bg-primary/10 border border-primary/20 rounded-3xl"
          >
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <CheckCircle2 className="text-primary w-8 h-8 shrink-0" />
            </motion.div>
            <p className="text-base font-bold text-white tracking-tight">{message}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/10 rounded-[2rem] sm:rounded-full blur opacity-30 group-focus-within:opacity-100 group-hover:opacity-50 transition duration-500"></div>

            <div className="relative flex flex-col sm:flex-row gap-2 p-1.5 rounded-[2rem] sm:rounded-full bg-secondary/50 backdrop-blur-2xl border border-white/10 group-focus-within:border-primary/50 transition-all duration-300">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresinizi girin"
                required
                className="flex-1 bg-transparent px-6 py-4 sm:py-3 text-white placeholder:text-white/20 focus:outline-none min-w-0 text-base sm:text-sm"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary !py-3.5 sm:!py-2.5 !px-8 flex items-center justify-center gap-2 disabled:opacity-70 rounded-[1.5rem] sm:rounded-full"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="sm:hidden uppercase tracking-widest text-xs font-black">Listeye Katıl</span>
                    <span className="hidden sm:inline">Katıl</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-8 left-0 right-0 flex items-center justify-center space-x-1 text-red-400"
              >
                <AlertCircle className="w-4 h-4" />
                <p className="text-xs font-medium">{message}</p>
              </motion.div>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      <p className="mt-6 text-[10px] text-white/20 text-center uppercase tracking-[0.3em] font-black">
        OstlerTech Global Security Infrastructure
      </p>
    </div>
  );
}
