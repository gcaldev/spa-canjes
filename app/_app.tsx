import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    console.log("ACA MYAPP")
  return (
    <div className='accacacaca'>

      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
