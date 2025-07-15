'use client';

import React from 'react';
import { Heart, Share, Camera, Shield, Palette, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const recursos = [
  {
    icon: Heart,
    title: 'Perfil Personalizado',
    description:
      'Crie páginas lindas e personalizadas com fotos, histórias e lembranças especiais do seu companheiro querido.',
  },
  {
    icon: Camera,
    title: 'Galeria de Fotos',
    description: 'Envie e destaque suas fotos favoritas em galerias que capturam cada momento adorável.',
  },
  {
    icon: Share,
    title: 'Compartilhamento Fácil',
    description: 'Compartilhe a página do seu pet com amigos e familiares por QR Code ou redes sociais.',
  },
  {
    icon: Shield,
    title: 'Privacidade Segura',
    description: 'Defina quem pode ver a página do seu pet com opções de privacidade e hospedagem segura.',
  },
  {
    icon: Palette,
    title: 'Design Encantador',
    description: 'Modelos profissionais que deixam qualquer pet incrível — sem precisar entender de design.',
  },
  {
    icon: Globe,
    title: 'Sempre Online',
    description: 'A página do seu pet estará sempre disponível na web, como uma lembrança eterna e acessível.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Tudo que Você Precisa para Celebrar seu Pet
          </h2>
          <p className="text-xl text-pet-gray max-w-2xl mx-auto">
            Nossa plataforma oferece todas as ferramentas para criar uma homenagem bonita e duradoura ao seu pet
            querido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recursos.map((recurso, index) => (
            <Card
              key={index}
              className="border-0 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pet-purple to-pet-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <recurso.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">{recurso.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-pet-gray text-center leading-relaxed">{recurso.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
