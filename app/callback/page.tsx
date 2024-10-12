// app/callback/page.tsx
'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';




const CallbackPage = () => {
  const { user, error, isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    console.log({ isAuthenticated, isLoading, error, user });
    console.log(isAuthenticated)
    if (isAuthenticated) {
      console.log("Autenticado, redirigiendo...");
      router.push('/profile');
    } else if (!isLoading && error) {
      console.error('Error during authentication:', error);
    }
  }, [isAuthenticated, isLoading, error, router]);
  

  return (
    <div>
      <p>no pasa nada</p> 
      
    </div>
  );
};

export default CallbackPage;
