import React, { useState } from 'react';

type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
  onSubmit: (email: string, password: string, username?: string) => void;
  onSwitchMode: (mode: AuthMode) => void;
}

export function AuthModal({ mode, onClose, onSubmit, onSwitchMode }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSubmit(email, password, username);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="fixed inset-0 bg-black/80 z-30 flex items-center justify-center" onClick={onClose}>
      <div className="bg-brand-secondary rounded-lg shadow-2xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
        <div className="flex mb-6 border-b border-brand-border">
          <button
            onClick={() => onSwitchMode('login')}
            className={`px-6 py-2 text-lg font-bold ${isLogin ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-text-muted'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => onSwitchMode('signup')}
            className={`px-6 py-2 text-lg font-bold ${!isLogin ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-text-muted'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
                <label className="block text-sm font-medium text-brand-text mb-1" htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 bg-brand-surface border border-brand-border rounded-md text-brand-text focus:ring-2 focus:ring-brand-accent focus:outline-none transition-all"
                  required
                />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-brand-surface border border-brand-border rounded-md text-brand-text focus:ring-2 focus:ring-brand-accent focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-brand-surface border border-brand-border rounded-md text-brand-text focus:ring-2 focus:ring-brand-accent focus:outline-none transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 bg-brand-accent text-black font-bold rounded-md hover:bg-brand-accent-hover hover:shadow-glow-accent transition-all disabled:bg-brand-disabled"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}