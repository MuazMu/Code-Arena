'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Github } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signupSchema = loginSchema.extend({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: LoginFormData | SignupFormData) => Promise<void>;
  loading: boolean;
}

export function AuthForm({ type, onSubmit, loading }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(type === 'login' ? loginSchema : signupSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(type === 'signup' && {
        username: '',
        name: '',
      }),
    },
  });

  const handleSubmit = async (data: LoginFormData | SignupFormData) => {
    try {
      setError(null);
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {type === 'login' 
            ? 'Enter your credentials to access your account'
            : 'Sign up to start coding challenges'}
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {type === 'signup' && (
            <>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : type === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm">
        {type === 'login' ? (
          <p>
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </Card>
  );
}