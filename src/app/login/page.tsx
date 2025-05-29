'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const CORRECT_PASSWORD = 'artgallery'; // Define password as a constant

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryPassword = searchParams.get('pw');
    if (queryPassword) {
      setPassword(queryPassword);
      if (queryPassword === CORRECT_PASSWORD) {
        // Automatically log in
        document.cookie = "sitePasswordProtected=true; path=/; max-age=" + (60 * 60 * 24 * 30); // Expires in 30 days
        router.push('/'); // Redirect to home page
      }
    }
  }, [searchParams, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (password === CORRECT_PASSWORD) {
      // Set a cookie to remember the login
      document.cookie = "sitePasswordProtected=true; path=/; max-age=" + (60 * 60 * 24 * 30);
      router.push('/');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100" style={{ backgroundImage: 'url(/images/home-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="p-8 bg-white shadow-xl rounded-lg max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <Image src="/motif.png" alt="Logo" width={100} height={100} />
        </div>
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Enter Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 text-black"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out">
            Enter
          </Button>
        </form>
      </div>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Arial', sans-serif; /* Example font */
        }
        .bg-gray-100 { /* Ensure this class has a fallback or is defined if not using Tailwind elsewhere */
          background-color: #f7fafc;
        }
        /* Custom style for password input text color */
        input[type="password"] {
          color: black !important; /* Ensure text (dots) are black */
        }
      `}</style>
    </div>
  );
} 