import './styles/globals.css';
import { Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';

const mainFontFamily = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-main',
});

export const metadata = {
  title: 'PetPage - Crie uma página inesquecível para seu pet',
  description: 'Transforme as memórias com seu pet em uma linda homenagem online. Fácil, rápido e sem mensalidade.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={mainFontFamily.variable} suppressHydrationWarning>
      <head>
        <meta
          name="description"
          content="Transforme as memórias com seu pet em uma linda homenagem online. Crie sua PetPage agora."
        />
        <meta
          name="keywords"
          content="pet, memorial pet, página pet, cachorro, gato, homenagear pet, petpage, mypetpage, veterinario, dogshow"
        />
        <meta name="author" content="PetPage" />
        <meta property="og:title" content="PetPage - Crie uma página inesquecível para seu pet" />
        <meta property="og:description" content="Homenagens online para seu pet. Fácil, rápido e sem mensalidade." />
        <meta property="og:image" content="/capa-og.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.minhapetpage.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PetPage - Crie uma página inesquecível para seu pet" />
        <meta name="twitter:description" content="Homenagens online para seu pet. Fácil, rápido e sem mensalidade." />
        <meta name="twitter:image" content="/capa-og.png" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="PetPage" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
