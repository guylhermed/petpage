'use client';

import React from 'react';
import { Clock, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingHeader from '@/components/landing/LandingHeader';

const itensRoadmap = [
  {
    id: 1,
    titulo: 'Login com Acesso às Páginas',
    descricao:
      'Permitirá acessar todas as páginas PetPage vinculadas ao e-mail, definindo uma senha após receber link.',
    status: 'em-progresso',
    planos: ['vitalicio', 'mensal'],
    trimestre: '3º trimestre de 2025',
  },
  {
    id: 2,
    titulo: 'Edição da Página Pet',
    descricao: 'Será possível alterar fotos, frases, datas e demais dados da página personalizada.',
    status: 'em-progresso',
    planos: ['vitalicio', 'mensal'],
    trimestre: '3º trimestre de 2025',
  },
  {
    id: 3,
    titulo: 'Lançamento do Plano Mensal',
    descricao: 'Plano recorrente com os recursos do plano vitalício e funcionalidades extras exclusivas.',
    status: 'planejado',
    planos: ['mensal'],
    trimestre: '4º trimestre de 2025',
  },
  {
    id: 4,
    titulo: 'Aba de Saúde do Pet',
    descricao:
      'Área dedicada ao acompanhamento de vacinas, vermífugos, peso, altura, exames e histórico médico do pet.',
    status: 'pesquisa',
    planos: ['mensal'],
    trimestre: '4º trimestre de 2025',
  },
  {
    id: 5,
    titulo: 'Alertas e Notificações de Cuidados',
    descricao:
      'Envio automático de lembretes sobre vacinas, vermífugos e visitas ao veterinário por e-mail e WhatsApp.',
    status: 'pesquisa',
    planos: ['mensal'],
    trimestre: '4º trimestre de 2025',
  },
  {
    id: 6,
    titulo: 'Cupons, Parcerias e Comunidade',
    descricao: 'Sistema de resgate de cupons de desconto com marcas parceiras e criação de uma comunidade de tutores.',
    status: 'em-progresso',
    planos: ['mensal', 'vitalicio'],
    trimestre: '4º trimestre de 2025',
  },
];

const obterVariantePlano = plano => {
  switch (plano) {
    case 'vitalicio':
      return 'default';
    case 'mensal':
      return 'secondary';
    default:
      return 'outline';
  }
};

const obterIconeStatus = status => {
  switch (status) {
    case 'em-progresso':
      return <Zap className="h-4 w-4 text-yellow-500" />;
    case 'planejado':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'pesquisa':
      return <Star className="h-4 w-4 text-purple-500" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const obterTextoStatus = status => {
  switch (status) {
    case 'em-progresso':
      return 'Em progresso';
    case 'planejado':
      return 'Planejado';
    case 'pesquisa':
      return 'Em pesquisa';
    default:
      return 'Planejado';
  }
};

const PaginaRoadmap = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-petPurple/20 via-white to-petBlue/10 dark:from-background dark:via-background dark:to-background">
      {/* Cabeçalho */}
      <LandingHeader />

      {/* Título */}
      <div className="text-center mt-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Roadmap da PetPage</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Veja o que estamos preparando para deixar a PetPage ainda mais especial.
        </p>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap justify-center gap-4 my-8">
        <div className="flex items-center gap-2">
          <Badge variant="default">Plano Vitalício</Badge>
          <Badge variant="secondary">Plano Mensal</Badge>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Em progresso</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Planejado</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-purple-500" />
            <span>Pesquisa</span>
          </div>
        </div>
      </div>

      {/* Itens do roadmap */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-4">
        {itensRoadmap.map(item => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{item.titulo}</CardTitle>
                {obterIconeStatus(item.status)}
              </div>
              <CardDescription className="dark:text-gray-300">{item.descricao}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Status:</span>
                  <span className="font-medium">{obterTextoStatus(item.status)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Previsão:</span>
                  <span className="font-medium">{item.trimestre}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.planos.map(plano => (
                    <Badge key={plano} variant={obterVariantePlano(plano)} className="text-xs">
                      {plano === 'vitalicio' ? 'Plano Vitalício' : 'Plano Mensal'}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12 mb-20 px-4">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Pronto para criar a página do seu pet?
        </h3>
        <p className="text-muted-foreground mb-6">Comece agora e aproveite todas as novidades que estão por vir.</p>
        <Link href="/criar">
          <Button size="lg" className="bg-gradient-to-r from-petPurple to-petBlue text-white">
            Criar Página Pet Agora
          </Button>
        </Link>
      </div>
      <LandingFooter />
    </div>
  );
};

export default PaginaRoadmap;
