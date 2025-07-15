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
    title: 'Memória Eterna',
    description: 'Guarde com carinho a história do seu pet e celebre para sempre os momentos vividos juntos.',
  },
  {
    icon: Palette,
    title: 'Design Encantador',
    description: 'Você só preenche… a mágica do design a gente já deixou pronta!',
  },
  {
    icon: Globe,
    title: 'Sempre Online',
    description: 'A página do seu pet estará sempre disponível na web, como uma lembrança eterna e acessível.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 bg-background text-foreground">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Tudo que Você Precisa para Eternizar seu Pet
          </h2>
          <p className="text-xl text-petGray dark:text-gray-300 max-w-2xl mx-auto">
            Nossa plataforma oferece todas as ferramentas para criar uma homenagem bonita e duradoura ao seu pet
            querido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recursos.map((recurso, index) => (
            <Card
              key={index}
              className="border-0 bg-white/60 dark:bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-petPurple to-petBlue rounded-full flex items-center justify-center mx-auto mb-4">
                  <recurso.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">{recurso.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-petGray dark:text-gray-300 text-center leading-relaxed">{recurso.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
