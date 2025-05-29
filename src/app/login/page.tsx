import { Suspense } from 'react';
import LoginForm from './LoginForm'; // Import the new client component

// export const dynamic = 'force-dynamic'; // No longer needed here, Suspense handles it

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}> {/* Simple fallback UI */}
      <LoginForm />
      {/* Global styles removed from here, will be in LoginForm.tsx */}
    </Suspense>
  );
} 