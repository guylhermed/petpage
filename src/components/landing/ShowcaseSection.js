'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const exemplosPets = [
  {
    name: 'Luna',
    type: 'Golden Retriever',
    timeWithFamily: '2 anos',
    description: 'A companheira mais doce que traz alegria todos os dias.',
    image: '/placeholder.svg',
  },
  {
    name: 'Milo',
    type: 'Gato Laranja (Tabby)',
    timeWithFamily: '6 meses',
    description: 'Um explorador curioso com energia infinita e muitos ronrons.',
    image: '/placeholder.svg',
  },
  {
    name: 'Bella',
    type: 'Bulldog Francês',
    timeWithFamily: '3 anos',
    description: 'Nossa princesinha que ama carinho na barriga e petiscos.',
    image: '/placeholder.svg',
  },
  {
    name: 'Charlie',
    type: 'Maine Coon',
    timeWithFamily: '1 ano',
    description: 'Um gigante gentil com o pelo mais macio e o coração maior ainda.',
    image: '/placeholder.svg',
  },
  {
    name: 'Max',
    type: 'Border Collie',
    timeWithFamily: '4 anos',
    description: 'Um amigo inteligente que adora frisbee e longas caminhadas.',
    image: '/placeholder.svg',
  },
];

const ShowcaseSection = () => {
  return (
    <section className="py-20 px-4 bg-background text-foreground">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Veja o que Outros Donos de Pets Criaram
          </h2>
          <p className="text-xl text-petGray dark:text-gray-300 max-w-2xl mx-auto">
            Junte-se a milhares de famílias que já criaram páginas lindas para seus pets amados.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {exemplosPets.map((pet, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="border-0 bg-white/60 dark:bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 overflow-hidden">
                    <CardContent className="p-0">
                      {/* Imagem do Pet */}
                      <div className="aspect-square bg-gradient-to-br from-petPurple/10 to-petBlue/10 flex items-center justify-center">
                        <Heart className="w-16 h-16 text-petPurple/60" />
                      </div>

                      {/* Info do Pet */}
                      <div className="p-6">
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{pet.name}</h3>
                          <p className="text-petGray dark:text-gray-300 text-sm font-medium">{pet.type}</p>
                        </div>

                        <div className="bg-gradient-to-r from-petPurple/10 to-petBlue/10 rounded-xl p-3 mb-4 text-center">
                          <p className="text-petPurple font-semibold">{pet.timeWithFamily}</p>
                          <p className="text-petGray dark:text-gray-300 text-xs">com a família</p>
                        </div>

                        <p className="text-petGray dark:text-gray-300 text-sm text-center italic mb-4">
                          "{pet.description}"
                        </p>

                        <div className="flex justify-center">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Heart
                                key={i}
                                className={`w-3 h-3 ${
                                  i < 4 ? 'text-red-400 fill-red-400' : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-petPurple to-petBlue hover:from-petPurple/90 hover:to-petBlue/90 text-white rounded-xl px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Link href="/criar" className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Criar Página do Seu Pet Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
