// layout.js
export const metadata = {
  title: 'Page Pet',
  description: '',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
    <head>
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="apple-mobile-web-app-title" content="PetPage" />
      <link rel="manifest" href="/site.webmanifest" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      {/* Adicionando meta tag para responsividade */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>{children}</body>
    </html>
  );
}
