import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CookiesProvider } from "react-cookie";
import { Inter } from '@next/font/google';
import localFont from "@next/font/local";

// we still need the inter font for initial UI hydration
const inter = Inter({ subsets: ['latin'] });
// custom craftwork sans fonts loading locally
const craftworkSans = localFont({
  src: [
    {
      path: '../styles/fonts/CraftworkSans-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/fonts/CraftworkSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/fonts/CraftworkSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/fonts/CraftworkSans-Bold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../styles/fonts/CraftworkSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../styles/fonts/CraftworkSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-craftworksans',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <html className={`${craftworkSans.variable} font-sans`}>
        <Component {...pageProps} />
      </html>
    </CookiesProvider>
  );
}
