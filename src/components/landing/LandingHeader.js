'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Menu, Moon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const LandingHeader = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    setIsDark(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const handleToggle = checked => {
    setIsDark(checked);
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <header className="bg-background text-foreground border-b border-gray-200/50 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src={resolvedTheme === 'dark' ? '/logo-horizontal-negativo.png' : '/logo-horizontal.png'}
              alt="Logo PetPage"
              className="h-12 w-auto"
            />
          </Link>

          {/* Navegação */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {[
                { href: '/#features', label: 'Recursos' },
                { href: '/#how-it-works', label: 'Como Funciona' },
                { href: '/#pricing', label: 'Planos' },
                { href: '/#faq', label: 'Dúvidas' },
                { href: '/roadmap', label: 'Roadmap' },
              ].map(({ href, label }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink
                    className="px-4 py-2 text-petGray dark:text-gray-300 hover:text-petPurple transition-colors"
                    href={href}
                  >
                    {label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Ações */}
          <div className="flex items-center gap-3">
            {/* Menu para mobile usando Sheet */}
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Abrir menu"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold text-petPurple">Menu</SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 space-y-4">
                    <Link
                      href="/login"
                      className="block text-base text-foreground hover:text-petPurple transition-colors"
                    >
                      Login
                    </Link>

                    {[
                      { href: '/#features', label: 'Recursos' },
                      { href: '/#how-it-works', label: 'Como Funciona' },
                      { href: '/#pricing', label: 'Planos' },
                      { href: '/#faq', label: 'Dúvidas' },
                      { href: '/roadmap', label: 'Roadmap' },
                    ].map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className="block text-base text-foreground hover:text-petPurple transition-colors"
                      >
                        {label}
                      </Link>
                    ))}

                    <div className="flex items-center justify-between pt-4 border-t border-muted">
                      <span className="flex items-center gap-2 text-sm">
                        <Moon className="w-4 h-4" />
                        Tema Escuro
                      </span>
                      <Switch checked={isDark} onCheckedChange={handleToggle} />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <Button variant="outline" className="hidden sm:flex rounded-xl">
              <Link href="/login">Login</Link>
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
      <AlertDialog open={modalAberto} onOpenChange={setModalAberto}>
        <AlertDialogContent className="bg-white dark:bg-gray-950 border border-petPurple/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-petPurple text-base font-semibold">
              🚧 Em desenvolvimento
            </AlertDialogTitle>
            <p className="text-sm text-muted-foreground">
              Em breve você poderá acessar sua PetPage com seu e-mail e visualizar tudo aqui!
            </p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setModalAberto(false)}
              className="bg-petPurple hover:bg-petBlue text-white"
            >
              Fechar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default LandingHeader;
