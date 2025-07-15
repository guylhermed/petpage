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
      'Atualmente ainda não é possível editar a página após criada, mas já estamos desenvolvendo essa funcionalidade e ela estará disponível em breve para quem adquirir o plano vitalício. Avisaremos sobre essa e outras novidades por e-mail e nas redes sociais!',
  },
  {
    question: 'Qual a diferença entre o plano básico e o plano vitalício?',
    answer:
      'O plano básico mantém a página no ar por 30 dias. Já o plano vitalício garante que a página estará sempre disponível como uma lembrança permanente.',
  },
  {
    question: 'Quantas fotos posso enviar?',
    answer:
      'Você pode enviar uma foto de perfil e até 3 fotos no plano básico, ou até 10 fotos no plano vitalício. Todas otimizadas para carregar rápido e ficar lindas.',
  },
  {
    question: 'Posso compartilhar a página do meu pet nas redes sociais?',
    answer:
      'Com certeza! Você pode copiar o link da página e compartilhar onde quiser. Também oferecemos botões que facilitam o envio do link por WhatsApp, Instagram, Facebook e até um QR Code exclusivo para isso.',
  },
  {
    question: 'As informações do meu pet estão seguras?',
    answer:
      'Sim! As páginas são públicas, mas só quem tiver o link poderá acessá-las. Você escolhe com quem deseja compartilhar. Todos os dados são armazenados com segurança.',
  },
  {
    question: 'Posso criar páginas para mais de um pet?',
    answer: 'Sim! Você pode criar uma página diferente para cada pet, com fotos e informações únicas.',
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
