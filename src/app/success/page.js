'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { baseUrl } from '@/app/utils/utils';

function SuccessContent() {
  const searchParams = useSearchParams();
  const uniqueSlug = searchParams.get('uniqueSlug');
  const qrCanvasRef = useRef(null);

  if (!uniqueSlug) {
    return <div>Carregando...</div>;
  }

  const petPageUrl = `${baseUrl}/${uniqueSlug}`;

  console.log('uniqueSlug', uniqueSlug);

  const handleDownload = () => {
    const qrCanvas = qrCanvasRef.current;
    if (qrCanvas) {
      // A URL já gerada pela renderização do canvas
      const qrCodeUrl = qrCanvas.toDataURL('image/png');

      // Cria um link de download
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = 'qr-code-minha-pet-page.png';
      link.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-backgroundColor mx-10">
      <div className="text-center max-w-lg">
        <img src={'/logo.png'} alt={'Logo da Minha PetPage'} className="md:w-44 w-28 object-cover mx-auto mb-2" />

        <h1 className="text-4xl font-black mb-5 text-primaryBlue">Pet Page criada com sucesso!</h1>
        <p className="text-base mb-6 leading-snug text-primaryGray font-medium">
          Acesse sua Pet Page clicando no link abaixo ou escaneando o QR Code.
        </p>

        {/* Gerando o QR Code dinamicamente */}
        <div className="mb-6">
          <QRCodeCanvas
            value={petPageUrl}
            size={160}
            level="H"
            className="mx-auto h-32 md:w-40 md:h-40"
            ref={qrCanvasRef}
          />
        </div>

        <div className="flex flex-col space-y-4">
          {/* Botão para acessar a Pet Page */}
          <a
            href={`/${uniqueSlug}`}
            className="md:min-w-52 border border-primaryPurple text-primaryPurple px-12 py-3 rounded-full text-lg hover:bg-primaryPurple hover:text-white transition"
          >
            Acessar sua Pet Page
          </a>

          {/* Botão para download do QR Code */}
          <button
            onClick={handleDownload}
            className="md:min-w-52 border border-primaryPurple text-primaryPurple px-12 py-3 rounded-full text-lg hover:bg-primaryPurple hover:text-white transition"
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
