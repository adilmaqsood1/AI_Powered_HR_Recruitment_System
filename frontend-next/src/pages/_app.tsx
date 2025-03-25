import '../styles/tailwind.css';
import type { AppProps } from 'next/app';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      
    </div>
  );
}

export default MyApp;