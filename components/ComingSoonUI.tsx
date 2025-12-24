"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight, TrendingUp, Shield, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import SocialMediaLinks from "./SocialMediaLinks";

export default function ComingSoonUI() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'exists'>('idle');
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message.includes('already registered')) {
          setStatus('exists');
          setMessage("You're already on our waitlist!");
        } else {
          setStatus('success');
          setMessage("Welcome to the waitlist! We'll notify you when we launch.");
          setEmail(""); // Clear email on success
        }
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Waitlist submission error:', error);
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
      // Clear status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage("");
      }, 5000);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'exists':
        return <CheckCircle className="h-4 w-4 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'exists':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cyan-500 text-black px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Main content - Flex grow to push footer down */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center relative z-10" role="main">
        <section id="main-content" className="w-full max-w-4xl space-y-6 md:space-y-8" aria-labelledby="main-heading">
          {/* Logo with glow effect - Smaller on mobile */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
            role="img"
            aria-label="SCALPTRA Logo"
          >
            <div className="relative">
              <div className="h-16 w-16 md:h-24 md:w-24 rounded-2xl md:rounded-3xl flex items-center justify-center p-1.5 md:p-2">
                <Image
                  src="/scalptra_logo.png"
                  alt="SCALPTRA - AI-Powered Quantitative Trading Platform Logo"
                  width={60}
                  height={60}
                  className="rounded-xl md:rounded-2xl object-contain md:w-[80px] md:h-[80px]"
                  priority
                />
              </div>
              <div className="absolute inset-0 h-16 w-16 md:h-24 md:w-24 rounded-2xl md:rounded-3xl bg-linear-to-br from-cyan-400 via-blue-500 to-purple-600 blur-lg md:blur-xl opacity-50 animate-pulse" aria-hidden="true" />
            </div>
          </motion.div>

          {/* Main heading - Responsive text size */}
          <motion.h1
            id="main-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight bg-linear-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent"
          >
            SCALPTRA
          </motion.h1>

          {/* Subtitle - Smaller on mobile */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm md:text-xl font-light tracking-[0.2em] md:tracking-[0.3em] text-cyan-100/80 uppercase"
            role="doc-subtitle"
          >
            AI-Powered Quantitative Trading
          </motion.p>

          {/* Animated divider - Smaller on mobile */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mx-auto h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent md:w-[120px]"
            aria-hidden="true"
          />

          {/* Description - More compact on mobile */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-base md:text-lg text-gray-300 max-w-xl md:max-w-2xl mx-auto leading-relaxed px-4"
          >
            Preparing the most precise Agentic Trading system for you. 
            <span className="hidden md:inline"><br /></span>
            <span className="md:hidden"> </span>
            Start trading with next-generation AI algorithms on DEX/CEX, coming soon.
          </motion.p>

          {/* Features - Stack on mobile, grid on desktop */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-xs md:max-w-3xl mx-auto px-4"
            aria-labelledby="features-heading"
          >
            <h2 id="features-heading" className="sr-only">Key Features</h2>
            
            <article className="flex flex-col items-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-cyan-400 mb-2 md:mb-3" aria-hidden="true" />
              <h3 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Smart Analytics</h3>
              <p className="text-gray-400 text-xs md:text-sm text-center">Advanced market analysis with AI-driven insights</p>
            </article>
            
            <article className="flex flex-col items-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Zap className="h-6 w-6 md:h-8 md:w-8 text-cyan-400 mb-2 md:mb-3" aria-hidden="true" />
              <h3 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Lightning Fast</h3>
              <p className="text-gray-400 text-xs md:text-sm text-center">Execute trades in milliseconds with optimal timing</p>
            </article>
            
            <article className="flex flex-col items-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Shield className="h-6 w-6 md:h-8 md:w-8 text-cyan-400 mb-2 md:mb-3" aria-hidden="true" />
              <h3 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Risk Management</h3>
              <p className="text-gray-400 text-xs md:text-sm text-center">Intelligent risk assessment and portfolio protection</p>
            </article>
          </motion.section>

          {/* Social Media Section - Compact on mobile */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="px-4"
            aria-labelledby="social-heading"
          >
            <h2 id="social-heading" className="text-gray-300 text-xs md:text-sm font-light tracking-wider uppercase mb-4">
              Follow us on
            </h2>
            <SocialMediaLinks className="scale-90 md:scale-100" />
          </motion.section>

          {/* Email signup form - Mobile optimized with extra bottom margin */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="px-4 mb-8 md:mb-12"
            aria-labelledby="waitlist-heading"
          >
            <h2 id="waitlist-heading" className="sr-only">Join Our Waitlist</h2>
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex flex-col md:flex-row max-w-sm md:max-w-md gap-3 md:gap-2 p-3 md:p-2 rounded-2xl md:rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl"
              noValidate
            >
              <div className="flex flex-1 items-center px-4 py-2 md:py-0">
                <Mail className="mr-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" aria-hidden="true" />
                <label htmlFor="email-input" className="sr-only">
                  Email address for early access
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for early access"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                  required
                  disabled={isSubmitting}
                  aria-describedby={status !== 'idle' ? 'form-status' : undefined}
                  autoComplete="email"
                />
              </div>
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-xl md:rounded-full bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                aria-describedby={isSubmitting ? 'button-status' : undefined}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" aria-hidden="true" />
                    <span id="button-status">Joining...</span>
                  </>
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Status message */}
            {status !== 'idle' && message && (
              <motion.div
                id="form-status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 flex items-center justify-center gap-2 text-sm ${getStatusColor()} px-4`}
                role="status"
                aria-live="polite"
              >
                {getStatusIcon()}
                <span className="text-center">{message}</span>
              </motion.div>
            )}
          </motion.section>
        </section>

        {/* Floating elements - Fewer on mobile */}
        <div className="absolute top-20 left-4 md:left-10 w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-ping opacity-75" aria-hidden="true" />
        <div className="absolute top-32 right-4 md:top-40 md:right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse" aria-hidden="true" />
        <div className="absolute bottom-32 left-4 md:bottom-40 md:left-20 w-1 h-1 md:w-1.5 md:h-1.5 bg-purple-400 rounded-full animate-bounce" aria-hidden="true" />
      </main>

      {/* Footer - Now properly positioned at bottom with better visibility */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.7 }}
        className="py-6 md:py-8 text-xs md:text-sm tracking-widest text-gray-400 uppercase text-center px-4 relative z-20 bg-slate-950/80 backdrop-blur-md border-t border-white/10"
        role="contentinfo"
      >
        <div className="max-w-4xl mx-auto">
          © 2025 Scalptra • Powered By CytrexLab
        </div>
      </motion.footer>
    </div>
  );
}