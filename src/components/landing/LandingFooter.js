'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Instagram } from 'lucide-react';
import { useTheme } from 'next-themes';

const LandingFooter = () => {
  const { resolvedTheme } = useTheme();

  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marca */}
          <div className="md:col-span-1">
            <Link href="/" className="block mb-4">
              <img
                src={resolvedTheme === 'dark' ? '/logo-horizontal.png' : '/logo-horizontal-negativo.png'}
                alt="Logo PetPage"
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-300 mb-4">
              Criando memórias lindas e duradouras para famílias com pets em todo o Brasil.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Heart className="w-4 h-4 text-petPurple" />
              <span>Feito com amor para os pets</span>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/criar" className="text-gray-300 hover:text-white transition-colors">
                  Criar Página
                </Link>
              </li>
              <li>
                <a href="/#features" className="text-gray-300 hover:text-white transition-colors">
                  Recursos
                </a>
              </li>
              <li>
                <a href="/#pricing" className="text-gray-300 hover:text-white transition-colors">
                  Planos
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-gray-300 hover:text-white transition-colors">
                  Dúvidas
                </a>
              </li>
              <li>
                <Link href="/roadmap" className="text-gray-300 hover:text-white transition-colors">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          {/*<div>*/}
          {/*  <h4 className="font-semibold mb-4">Suporte</h4>*/}
          {/*  <ul className="space-y-2">*/}
          {/*    <li>*/}
          {/*      <a href="#" className="text-gray-300 hover:text-white transition-colors">*/}
          {/*        Central de Ajuda*/}
          {/*      </a>*/}
          {/*    </li>*/}
          {/*    <li>*/}
          {/*      <a href="#" className="text-gray-300 hover:text-white transition-colors">*/}
          {/*        Fale Conosco*/}
          {/*      </a>*/}
          {/*    </li>*/}
          {/*    <li>*/}
          {/*      <a href="#" className="text-gray-300 hover:text-white transition-colors">*/}
          {/*        Política de Privacidade*/}
          {/*      </a>*/}
          {/*    </li>*/}
          {/*    <li>*/}
          {/*      <a href="#" className="text-gray-300 hover:text-white transition-colors">*/}
          {/*        Termos de Uso*/}
          {/*      </a>*/}
          {/*    </li>*/}
          {/*  </ul>*/}
          {/*</div>*/}

          {/* Contato */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>contato@petpage.com.br</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Instagram className="w-4 h-4" />
                <a
                  href="https://www.instagram.com/minhapetpage/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @minhapetpage
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé final */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2023 PetPage. Todos os direitos reservados. Criando memórias lindas, um pet por vez.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
