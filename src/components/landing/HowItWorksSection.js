'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Camera, Share } from 'lucide-react';

const etapas = [
  {
    number: '01',
    icon: Edit,
    title: 'Conte a História do Seu Pet',
    description:
      'Preencha nosso formulário simples com nome, datas importantes, apelidos e uma mensagem especial sobre o que torna seu pet único.',
  },
  {
    number: '02',
    icon: Camera,
    title: 'Envie Fotos Incríveis',
    description:
      'Adicione uma foto de perfil e até 5 fotos na galeria para mostrar a personalidade e os melhores momentos do seu pet.',
  },
  {
    number: '03',
    icon: Share,
    title: 'Compartilhe e Celebre',
    description:
      'A página do seu pet estará pronta na hora! Compartilhe com familiares e amigos via QR Code ou redes sociais.',
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-white/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Como Funciona</h2>
          <p className="text-xl text-petGray max-w-2xl mx-auto">
            Criar uma página linda para seu pet é simples e leva apenas alguns minutos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {etapas.map((etapa, index) => (
            <div key={index} className="relative">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg h-full">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl font-bold text-petPurple/20 mb-4">{etapa.number}</div>

                  <div className="w-16 h-16 bg-gradient-to-r from-petPurple to-petBlue rounded-full flex items-center justify-center mx-auto mb-6">
                    <etapa.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{etapa.title}</h3>

                  <p className="text-petGray leading-relaxed">{etapa.description}</p>
                </CardContent>
              </Card>

              {index < etapas.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-petPurple/30">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7 17L17 7M17 7H7M17 7V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
