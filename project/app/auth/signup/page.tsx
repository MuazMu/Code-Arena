'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/firebase/auth';
import { AuthForm } from '@/components/auth/auth-form';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (data: { email: string; password: string; username?: string; name?: string }) => {
  setLoading(true);
  try {
    if (!data.username || !data.name) {
      throw new Error('Username and name are required');
    }
    await signUp(data.email, data.password, data.username, data.name);
    router.push('/auth/login');
    toast({
      title: 'Success',
      description: 'Account created successfully. Please log in.',
    });
  } catch (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to create account',
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
};

  return <AuthForm type="signup" onSubmit={handleSignup} loading={loading} />;
}