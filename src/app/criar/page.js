'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Formulary from '@/components/Formulary';
import Preview from '@/components/Preview';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import LandingFooter from '@/components/landing/LandingFooter';

export default function CriarPagina() {
  const router = useRouter();
  const [petData, setPetData] = useState({
    name: '',
    adoptionDate: '',
    birthDate: '',
    nicknames: '',
    message: '',
    photo: null,
    galleryPhotos: [],
    isPublic: true,
    mostrarDataNascimento: true,
    mostrarDataAdocao: true,
    selectedPlan: '',
    images: [],
  });

  const { resolvedTheme } = useTheme();

  return (
    <div className={`min-h-screen ${resolvedTheme === 'dark' ? 'bg-background' : 'bg-white'}`}>
      {/* Cabeçalho */}
      <header className="bg-white/80 dark:bg-background backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img
                src={resolvedTheme === 'dark' ? '/logo-horizontal-negativo.png' : '/logo-horizontal.png'}
                alt="Logo PetPage"
                className="h-12 w-auto"
              />
            </Link>

            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="container mx-auto px-4 py-8 md:mb-20">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-petPurple to-petBlue bg-clip-text text-transparent mb-4 leading-relaxed">
            Crie a Página do Seu Pet
          </h2>
          <p className="text-petGray text-lg max-w-2xl mx-auto">
            Preencha as informações para gerar uma página linda, única e especial para compartilhar com a família e
            amigos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Formulário */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Fale sobre seu pet</h3>
              <p className="text-petGray dark:text-gray-300">
                As informações abaixo serão usadas para criar a página personalizada.
              </p>
            </div>
            <Formulary formData={petData} setFormData={setPetData} />
          </div>

          {/* Preview */}
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Visualização em tempo real</h3>
              <p className="text-petGray dark:text-gray-300">
                Veja como sua página ficará antes de finalizar a criação.
              </p>
            </div>
            <div className="sticky top-24">
              <Preview formData={petData} />
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
