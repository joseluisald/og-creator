import React, { useState } from 'react';
import { Mail, KeyRound, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPass = password.trim();

      if (normalizedEmail === 'admin@mmserver.com.br' && normalizedPass === 'admin@test123A') {
        localStorage.setItem('og_auth_user', JSON.stringify({ email: 'admin@mmserver.com.br', loggedAt: Date.now() }));
        onLoginSuccess('admin@mmserver.com.br');
      } else {
        setError('E-mail ou senha incorretos. Verifique suas credenciais.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] flex items-center justify-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#d4af37]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0f1115] border border-[#ffffff15] rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#f9e79f] mx-auto flex items-center justify-center shadow-lg shadow-[#d4af3720] ring-1 ring-[#f9e79f]/30 mb-4">
            <Sparkles className="w-7 h-7 text-black" />
          </div>
          <h1 className="font-bold text-2xl text-[#f9e79f] font-['Cormorant_Garamond',serif] italic tracking-wide">
            OG Gen Studio
          </h1>
          <p className="text-xs text-[#71717a] mt-1.5">
            Acesso restrito para geração de Open Graph em 1200×630
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2">
              E-mail de Acesso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717a]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu-email@dominio.com"
                className="w-full pl-10 pr-4 py-3 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] placeholder-[#52525b] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717a]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] placeholder-[#52525b] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#71717a] hover:text-[#e5e5e5] transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-6 rounded-full text-xs uppercase tracking-widest font-bold bg-[#d4af37] hover:bg-[#c19a2e] text-black shadow-lg shadow-[#d4af3720] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Entrar no Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
