'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';

type AuthMode = 'signin' | 'signup';

export default function SignIn() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const errors = [];
    if (!requirements.minLength) errors.push("At least 8 characters");
    if (!requirements.hasUpper) errors.push("One uppercase letter");
    if (!requirements.hasLower) errors.push("One lowercase letter");
    if (!requirements.hasNumber) errors.push("One number");
    if (!requirements.hasSpecial) errors.push("One special character");

    return {
      isValid: Object.values(requirements).every(Boolean),
      errors
    };
  };

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signIn('google', {
        callbackUrl: '/auth/terms',
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (mode === 'signup') {
      const validation = validatePassword(password);
      if (!validation.isValid) {
        setPasswordErrors(validation.errors);
        return;
      }
    }
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/auth/terms');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center heading-font text-2xl">
              Welcome to fromany.country
            </CardTitle>
            <p className="text-center text-sm text-link mt-2">
              Your global life, simplified. {mode === 'signin' ? 'Sign in' : 'Sign up'} to manage your travels, documents, and more.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <form onSubmit={handleEmailAuth} className="space-y-3">
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {mode === 'signup' && (
                  <>
                    <Input
                      type="text"
                      placeholder="Display Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="terms" className="text-sm">
                        I accept the terms and conditions
                      </label>
                    </div>
                  </>
                )}
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (mode === 'signup') {
                        const validation = validatePassword(e.target.value);
                        setPasswordErrors(validation.errors);
                      }
                    }}
                    required
                  />
                  {mode === 'signup' && passwordErrors.length > 0 && (
                    <div className="mt-2 text-sm text-red-500">
                      <p>Password must contain:</p>
                      <ul className="list-disc pl-5">
                        {passwordErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary p-3 text-text hover:bg-accent transition-colors duration-200"
                >
                  {mode === 'signin' ? 'Sign In' : 'Sign Up'} with Email
                </button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary p-3 text-text hover:bg-accent transition-colors duration-200"
              >
                <svg
                  className="h-5 w-5"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
              
              <p className="text-center text-sm text-muted-foreground">
                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-primary hover:underline"
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
