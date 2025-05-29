'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const CORRECT_PASSWORD = 'artgallery';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryPassword = searchParams.get('pw');
    if (queryPassword) {
      setPassword(queryPassword);
      if (queryPassword === CORRECT_PASSWORD) {
        document.cookie = "sitePasswordProtected=true; path=/; max-age=" + (60 * 60 * 24 * 30);
        router.push('/');
      }
    }
  }, [searchParams, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (password === CORRECT_PASSWORD) {
      document.cookie = "sitePasswordProtected=true; path=/; max-age=" + (60 * 60 * 24 * 30);
      router.push('/');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundImage: 'url(/images/home-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
      {/* Global styles moved back here as this is a Client Component */}
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Arial', sans-serif;
        }
        .bg-gray-100 { 
          background-color: #f7fafc;
        }
        input[type="password"] {
          color: black !important;
        }
      `}</style>
    </div>
  );
} 