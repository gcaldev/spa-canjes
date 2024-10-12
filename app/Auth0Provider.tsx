'use client';

import { getConfig } from '@/utils/config';
import { Auth0Provider } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin); // Definir el valor solo en el cliente
    }
  }, []);

  const onRedirectCallback = (appState: any) => {
    router.push(appState?.returnTo || '/canjes');
  };

  if (!origin) {
    // Mientras `window.location.origin` se carga, puedes devolver un fragmento vacío o un loading spinner
    return null;
  }

  const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  onRedirectCallback,
  authorizationParams: {
    redirect_uri: window.location.origin + '/callback',

    ...(config.audience ? { audience: config.audience } : null),
    scope: 'openid profile email',
  },
};


  return (
/*
    //console.log('AUTH0 Domain:', process.env.NEXT_PUBLIC_AUTH0_DOMAIN),
    //console.log('AUTH0 Client ID:', process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID),
    //console.log(`${origin}/callback`),
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: `${origin}/callback`, // Usar `origin` solo cuando esté disponible
        //audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        scope: 'openid profile email',
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens
    >
      {children}
    </Auth0Provider>
    ;*/
      <Auth0Provider {...providerConfig}>
        {children}
      </Auth0Provider>
  )
};

export default AuthProvider;
