'use client'; // Garante que o componente é renderizado no cliente

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const uniqueSlug = searchParams.get('uniqueSlug'); // Pega o parâmetro da URL

  if (!uniqueSlug) {
    return <div>Carregando...</div>; // Exibe um loading caso o slug não tenha sido carregado ainda
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-4">Pet Page criada com sucesso!</h1>
        <p className="text-lg mb-6">Acesse sua Pet Page clicando no link abaixo ou escaneando o QR Code.</p>

        {/* Imagem de QR Code */}
        <div className="mb-6">
          <img src="/qr-code.png" alt="QR Code" className="mx-auto w-40 h-40" />
        </div>

        <div className="flex flex-col space-y-4">
          {/* Botão para acessar a Pet Page */}
          <a
            href={`/${uniqueSlug}`}
            className="border border-white text-white hover:bg-white hover:text-black font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
          >
            Acessar sua Pet Page
          </a>

          {/* Botão para download do QR Code */}
          <button
            onClick={() => {
              // lógica para download do QR Code
            }}
            className="border border-white text-white hover:bg-white hover:text-black font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
