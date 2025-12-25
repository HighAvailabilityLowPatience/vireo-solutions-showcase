import { useState, useEffect, ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

interface PasswordGateProps {
  children: ReactNode;
}

const SESSION_KEY = 'site_unlocked';

export const PasswordGate = ({ children }: PasswordGateProps) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already unlocked in this session
    const unlocked = sessionStorage.getItem(SESSION_KEY);
    setIsUnlocked(unlocked === 'true');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('verify-site-password', {
        body: { password }
      });

      if (fnError) {
        console.error('Function error:', fnError);
        setError('Unable to verify. Please try again.');
        return;
      }

      if (data?.valid) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setIsUnlocked(true);
      } else {
        setError('Incorrect password');
        setPassword('');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Unable to verify. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Still checking session storage
  if (isUnlocked === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Already unlocked, show the site
  if (isUnlocked) {
    return <>{children}</>;
  }

  // Show password gate
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src={logo} 
            alt="Logo" 
            className="h-16 w-auto opacity-90"
          />
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter access code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center bg-card/50 border-border/50 focus:border-primary/50"
              autoFocus
            />
            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !password}
          >
            {isLoading ? 'Verifying...' : 'Enter'}
          </Button>
        </form>

        <p className="text-muted-foreground text-xs text-center">
          This site is invite-only
        </p>
      </div>
    </div>
  );
};
