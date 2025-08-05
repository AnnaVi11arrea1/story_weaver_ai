import React from 'react';
import { SocialUser } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import DownloadIcon from './icons/DownloadIcon';
import PlayIcon from './icons/PlayIcon';
import UsersIcon from './icons/UsersIcon';

interface HeaderProps {
    onDownload: () => void;
    onPresent: () => void;
    onSocialClick: () => void;
    isSocialView: boolean;
    user: SocialUser | null;
    onLoginClick: () => void;
    onSignupClick: () => void;
    onLogout: () => void;
    onSave: () => void;
    onShare: () => void;
    isStorySaved: boolean;
}

const Button = ({ onClick, children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 bg-brand-surface text-sm text-brand-text font-semibold rounded-md hover:bg-brand-border transition-colors ${className}`}
        {...props}
    >
        {children}
    </button>
);

const AccentButton = ({ onClick, children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 bg-brand-accent text-sm text-black font-bold rounded-md hover:shadow-glow-accent hover:bg-brand-accent-hover transition-all ${className}`}
        {...props}
    >
        {children}
    </button>
);

function Header({ 
    onDownload, 
    onPresent, 
    onSocialClick,
    isSocialView,
    user, 
    onLoginClick,
    onSignupClick,
    onLogout,
    onSave,
    onShare,
    isStorySaved
}: HeaderProps): React.ReactNode {
  return (
    <header className="flex items-center justify-between p-4 bg-brand-secondary shadow-md shrink-0 border-b border-brand-border z-20">
      <div className="flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-brand-accent" />
        <h1 className="text-2xl font-bold text-brand-text tracking-tight font-orbitron">Story Weaver AI</h1>
      </div>
      <div className="flex items-center gap-3">
        {!isSocialView && (
          <>
            <Button onClick={onDownload}>
              <DownloadIcon className="w-5 h-5 text-brand-accent" />
              PDF
            </Button>
            <Button onClick={onPresent}>
              <PlayIcon className="w-5 h-5 text-brand-accent" />
              Present
            </Button>
            <div className="w-px h-6 bg-brand-border"></div>
          </>
        )}

        {user && (
          <Button onClick={onSocialClick} className={isSocialView ? 'bg-brand-accent/20' : ''}>
              <UsersIcon className="w-5 h-5 text-brand-accent" />
              {isSocialView ? 'Back to Editor' : 'Social'}
          </Button>
        )}
        <div className="w-px h-6 bg-brand-border"></div>


        {user ? (
            <>
                {isStorySaved && !isSocialView ? (
                  <AccentButton onClick={onShare}>Share</AccentButton>
                ) : (
                  !isSocialView && <AccentButton onClick={onSave}>Save Story</AccentButton>
                )}
                <span className="text-sm text-brand-text-muted">Welcome, {user.username}</span>
                <button onClick={onLogout} className="px-3 py-2 text-sm text-brand-text-muted font-semibold rounded-md hover:bg-brand-surface transition-colors">Logout</button>
            </>
        ) : (
            <>
                <button onClick={onLoginClick} className="px-3 py-2 text-sm text-brand-text font-semibold rounded-md hover:bg-brand-surface transition-colors">Sign In</button>
                <AccentButton onClick={onSignupClick}>Sign Up</AccentButton>
            </>
        )}
      </div>
    </header>
  );
}

export default Header;