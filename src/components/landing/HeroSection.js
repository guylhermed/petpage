'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-20 pb-16 px-4 bg-background text-foreground">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          {/* Selo de confiança */}
          <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-gray-200/50 dark:border-white/20 rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-petGray dark:text-gray-300">
              Confiado por milhares de pais de pets
            </span>
          </div>

          {/* Título principal */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
            Crie páginas lindas para seu
            <span className="bg-gradient-to-r from-petPurple to-petBlue bg-clip-text text-transparent">
              {' '}
              Pet Querido
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl text-petGray dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Compartilhe a história, as fotos e os momentos especiais do seu pet com uma página personalizada que celebra
            seu companheiro de quatro patas.
          </p>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-petPurple to-petBlue hover:from-petPurple/90 hover:to-petBlue/90 text-white rounded-xl px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href="/criar">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Criar Página do Pet
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-xl px-8 py-3 text-lg border-2 border-petPurple text-petPurple hover:bg-petPurple hover:text-white transition-all duration-200"
            >
              Ver Exemplos
            </Button>
          </div>

          {/* Imagem de destaque / prévia */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-gray-200/50 dark:border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="aspect-video rounded-xl overflow-hidden shadow-xl">
                <img
                  src="/capa-petpage.png"
                  alt="Prévia da página linda do seu pet"
                  className="w-full h-full object-cover [object-position:center_20%]"
                />
              </div>
            </div>

            {/* Elementos decorativos flutuantes */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce-gentle"></div>
            <div
              className="absolute -top-2 -right-6 w-6 h-6 bg-pink-400 rounded-full animate-bounce-gentle"
              style={{ animationDelay: '0.5s' }}
            ></div>
            <div
              className="absolute -bottom-4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-bounce-gentle"
              style={{ animationDelay: '1s' }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
