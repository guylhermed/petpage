import { NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { firebaseConfigSelector } from '@/app/config/firebaseConfigSelector';
import { abacatepayWebhookSecret } from '@/app/utils/utils';
import { enviarEmailConfirmacaoPagamento } from '@/app/services/email/enviarEmailConfirmacaoPagamento';

const { db } = firebaseConfigSelector();

export async function POST(req) {
  console.log('✅ Webhook AbacatePay recebido');

  try {
    const secretRecebido = req.nextUrl.searchParams.get('webhookSecret');

    if (!secretRecebido || secretRecebido !== abacatepayWebhookSecret) {
      console.warn('❌ Webhook com secret inválido ou ausente');
      return NextResponse.json({ error: 'Invalid webhook secret' }, { status: 401 });
    }

    const evento = await req.json();
    // console.log('📦 Evento recebido:', JSON.stringify(evento, null, 2));

    if (evento.event !== 'billing.paid') {
      // console.log(`⚠️ Evento ignorado: ${evento.event}`);
      return NextResponse.json({ ok: true });
    }

    const billing = evento.data?.billing || {};
    const payment = evento.data?.payment || {};
    const metadata = billing.customer?.metadata || {};
    const slug = billing.metadata?.uniqueSlug || billing.products?.[0]?.externalId;

    if (!slug) {
      console.warn('❌ Slug não encontrado no metadata da cobrança');
      return NextResponse.json({ error: 'Missing uniqueSlug' }, { status: 400 });
    }

    const petRef = doc(db, 'pets', slug);
    await updateDoc(petRef, {
      isPaid: true,
      paymentMethod: payment.method || 'PIX',
      userEmail: metadata.email || '',
      cellphone: metadata.cellphone || '',
      taxId: metadata.taxId || '',
      name: metadata.name || 'Cliente PetPage',
      amount: billing.amount || 0,
      paidAmount: billing.paidAmount || 0,
      couponsUsed: billing.couponsUsed?.[0] || '',
    });

    // console.log(`✅ PetPage atualizada como paga: ${slug}`);

    const linkPetPage = `https://www.minhapetpage.com/${slug}`;

    await enviarEmailConfirmacaoPagamento({
      nome: metadata.name || 'Cliente PetPage',
      email: metadata.email || 'email@cliente.com',
      linkPetPage,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('❌ Erro no webhook AbacatePay:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
