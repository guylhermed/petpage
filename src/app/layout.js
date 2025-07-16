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
  keywords: [
    'pet',
    'memorial pet',
    'página pet',
    'cachorro',
    'gato',
    'homenagear pet',
    'petpage',
    'mypetpage',
    'veterinario',
    'dogshow',
  ],
  authors: [{ name: 'PetPage' }],
  openGraph: {
    title: 'PetPage - Crie uma página inesquecível para seu pet',
    description: 'Homenagens online para seu pet. Fácil, rápido e sem mensalidade.',
    url: 'https://www.minhapetpage.com/',
    siteName: 'PetPage',
    images: [
      {
        url: '/capa-og.png',
        width: 1200,
        height: 630,
        alt: 'Imagem de capa da PetPage',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetPage - Crie uma página inesquecível para seu pet',
    description: 'Homenagens online para seu pet. Fácil, rápido e sem mensalidade.',
    images: ['/capa-og.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={mainFontFamily.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
