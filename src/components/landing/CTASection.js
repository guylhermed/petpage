'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-petPurple to-petBlue text-white dark:from-petPurple dark:to-petBlue">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para Criar a Página do Seu Pet?</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de tutores que já eternizaram os momentos com seus companheiros. Comece a criar agora
            mesmo!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-petPurple hover:bg-gray-50 dark:hover:bg-white/10 dark:text-white dark:bg-white/20 rounded-xl px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href="/criar" className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Criar Agora
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-xl px-8 py-3 text-lg backdrop-blur-sm border-2
             text-petPurple border-petPurple hover:bg-petPurple hover:text-white
             dark:text-white dark:border-white/30 dark:hover:bg-white/10"
            >
              Ver Exemplos
            </Button>
          </div>

          <p className="mt-6 text-sm opacity-75">Sem mensalidade • Garantia de 7 dias • Página pronta em minutos</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
