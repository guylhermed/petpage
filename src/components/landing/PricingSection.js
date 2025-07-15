'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Heart, Star } from 'lucide-react';

const planos = [
  {
    nome: 'Plano Básico',
    preco: 'R$9,99',
    validade: 'por 1 ano',
    descricao: 'Ideal para quem quer começar com uma linda homenagem.',
    recursos: [
      'Página personalizada válida por 1 ano',
      'Até 3 fotos na galeria',
      'Perfil com nome, datas e mensagem',
      'Compartilhamento via QR Code',
      'Integração com redes sociais',
      'Layout adaptado para celular',
    ],
    popular: false,
    textoBotao: 'Escolher Plano Básico',
  },
  {
    nome: 'Plano Vitalício',
    preco: 'R$29,99',
    validade: 'acesso vitalício',
    descricao: 'A memória do seu pet para sempre com você.',
    recursos: [
      'Página permanente (vitalícia)',
      'Até 10 fotos e 1 vídeo',
      'Perfil com nome, datas e mensagem',
      'Compartilhamento via QR Code',
      'Integração com redes sociais',
      'Layout adaptado para celular',
      'Suporte prioritário',
      'Mais opções de personalização',
    ],
    popular: true,
    textoBotao: 'Escolher Plano Vitalício',
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-4 bg-white/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Preços Simples e Transparentes</h2>
          <p className="text-xl text-pet-gray max-w-2xl mx-auto">
            Escolha o plano que melhor se encaixa para você. Sem mensalidades, sem taxas escondidas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {planos.map((plano, index) => (
            <Card
              key={index}
              className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden ${
                plano.popular
                  ? 'bg-gradient-to-br from-pet-purple/5 to-pet-blue/5 ring-2 ring-pet-purple/20'
                  : 'bg-white/80 backdrop-blur-sm'
              }`}
            >
              {plano.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-pet-purple to-pet-blue text-white text-center py-2">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold">Mais Popular</span>
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              )}

              <CardHeader className={`text-center ${plano.popular ? 'pt-12' : 'pt-8'}`}>
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">{plano.nome}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-pet-purple">{plano.preco}</span>
                  <span className="text-pet-gray ml-2">{plano.validade}</span>
                </div>
                <p className="text-pet-gray">{plano.descricao}</p>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <ul className="space-y-3 mb-8">
                  {plano.recursos.map((recurso, recursoIndex) => (
                    <li key={recursoIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-pet-gray">{recurso}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full rounded-xl py-3 text-lg transition-all duration-200 ${
                    plano.popular
                      ? 'bg-gradient-to-r from-pet-purple to-pet-blue hover:from-pet-purple/90 hover:to-pet-blue/90 text-white shadow-lg hover:shadow-xl'
                      : 'border-2 border-pet-purple text-pet-purple hover:bg-pet-purple hover:text-white'
                  }`}
                  variant={plano.popular ? 'default' : 'outline'}
                >
                  <Link href="/criar" className="flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    {plano.textoBotao}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-pet-gray">
            Todos os planos têm garantia de reembolso de 7 dias. Dúvidas?{' '}
            <a href="#faq" className="text-pet-purple hover:underline">
              Veja nosso FAQ
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
