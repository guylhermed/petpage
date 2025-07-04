import { Resend } from 'resend';
import { EmailTemplateConfirmacaoPagamento } from '@/emails/EmailTemplateConfirmacaoPagamento';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmailConfirmacaoPagamento({ nome, email, linkPetPage }) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'PetPage <contato@minhapetpage.com>',
      to: email,
      subject: 'Sua PetPage está no ar!',
      react: EmailTemplateConfirmacaoPagamento({ nome, linkPetPage }), // usando JSX aqui!
    });

    if (error) {
      console.error('Erro ao enviar e-mail:', error);
      return;
    }

    console.log('E-mail enviado com sucesso:', data);
  } catch (err) {
    console.error('Erro inesperado ao enviar e-mail:', err);
  }
}
