import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.functions.invoke(
      'verify-admin-password',
      { body: { password, type: 'admin' } }
    );
    if (error) setError('Error verifying');
    else if (data?.valid) setUnlocked(true);
    else setError('Incorrect passcode');
    setLoading(false);
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={verify} className="space-y-4 w-80">
          <img src={logo} className="h-12 mx-auto" />
          <Input
            type="password"
            placeholder="Admin passcode"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            {loading ? 'Checking...' : 'Enter Admin'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p>You're in.</p>
      {/* keep your existing dashboard components here */}
    </div>
  );
};

export default Admin;
