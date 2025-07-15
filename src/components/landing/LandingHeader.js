'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

const LandingHeader = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-petPurple to-petBlue rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-petPurple to-petBlue bg-clip-text text-transparent">
              PetPage
            </h1>
          </Link>

          {/* Navegação */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="px-4 py-2 text-petGray hover:text-petPurple transition-colors"
                  href="#features"
                >
                  Recursos
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="px-4 py-2 text-petGray hover:text-petPurple transition-colors"
                  href="#how-it-works"
                >
                  Como Funciona
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="px-4 py-2 text-petGray hover:text-petPurple transition-colors"
                  href="#pricing"
                >
                  Planos
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="px-4 py-2 text-petGray hover:text-petPurple transition-colors"
                  href="#faq"
                >
                  Dúvidas
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Botões de ação */}
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex rounded-xl">
              Ver Minha Página
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-petPurple to-petBlue hover:from-petPurple/90 hover:to-petBlue/90 rounded-xl"
            >
              <Link href="/criar">Criar Página</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
