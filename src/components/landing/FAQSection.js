'use client';

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const duvidas = [
  {
    question: 'Quanto tempo leva para criar a página do meu pet?',
    answer:
      'Leva apenas alguns minutos! Basta preencher o formulário com as informações do seu pet, enviar as fotos, fazer o pagamento e sua página estará pronta na hora.',
  },
  {
    question: 'Posso editar a página depois de criada?',
    answer:
      'Sim! Você pode editar as informações, atualizar as fotos e modificar o conteúdo a qualquer momento de forma simples.',
  },
  {
    question: 'Qual a diferença entre o plano básico e o plano vitalício?',
    answer:
      'O plano básico mantém a página no ar por 1 ano. Já o plano vitalício garante que a página estará sempre disponível como uma lembrança permanente.',
  },
  {
    question: 'Quantas fotos posso enviar?',
    answer:
      'Você pode enviar uma foto de perfil e até 3 fotos no plano básico, ou até 10 fotos no plano vitalício. Todas otimizadas para carregar rápido e ficar lindas.',
  },
  {
    question: 'Posso compartilhar a página do meu pet nas redes sociais?',
    answer:
      'Com certeza! Cada página tem botões de compartilhamento para WhatsApp, Instagram, Facebook, além de um QR Code exclusivo.',
  },
  {
    question: 'As informações do meu pet estão seguras?',
    answer:
      'Sim, levamos a privacidade a sério. Você controla quem pode acessar a página, e todos os dados são armazenados com segurança.',
  },
  {
    question: 'Posso criar páginas para mais de um pet?',
    answer: 'Sim! Você pode criar uma página diferente para cada pet, com fotos e informações únicas.',
  },
  {
    question: 'Vocês oferecem reembolso?',
    answer:
      'Sim! Oferecemos garantia de 7 dias. Se não ficar satisfeito, é só entrar em contato dentro desse prazo que devolvemos seu dinheiro.',
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 px-4 bg-background text-foreground">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Dúvidas Frequentes</h2>
          <p className="text-xl text-petGray dark:text-gray-300">
            Tudo o que você precisa saber sobre como criar uma página linda para seu pet
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {duvidas.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-gray-200/50 dark:border-white/20 rounded-xl px-6 shadow-sm"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-800 dark:text-white hover:text-petPurple transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-petGray dark:text-gray-300 leading-relaxed pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
