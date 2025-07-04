import { NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { firebaseConfigSelector } from '@/app/config/firebaseConfigSelector';
import { abacatepayWebhookSecret } from '@/app/utils/utils';

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
    console.log('📦 Evento recebido:', JSON.stringify(evento, null, 2));

    if (evento.event !== 'billing.paid') {
      console.log(`⚠️ Evento ignorado: ${evento.event}`);
      return NextResponse.json({ ok: true });
    }

    const slug =
      evento.data?.billing?.metadata?.uniqueSlug ||
      evento.data?.billing?.products?.[0]?.externalId;

    if (!slug) {
      console.warn('❌ Slug não encontrado no metadata da cobrança');
      return NextResponse.json({ error: 'Missing uniqueSlug' }, { status: 400 });
    }

    const userEmail = evento.data.billing?.customer?.metadata?.email || '';
    const metodoPagamento = evento.data.payment?.method || 'PIX';

    const petRef = doc(db, 'pets', slug);
    await updateDoc(petRef, {
      isPaid: true,
      paymentMethod: metodoPagamento,
      userEmail
    });

    console.log(`✅ PetPage atualizada como paga: ${slug}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('❌ Erro no webhook AbacatePay:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
