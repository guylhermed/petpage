import { NextResponse } from 'next/server';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firebaseConfigSelector } from '@/app/config/firebaseConfigSelector';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const { db } = firebaseConfigSelector();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  console.log('✅ Webhook Stripe chamado!');

  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    console.log('📌 Assinatura Stripe recebida:', signature ? 'Sim' : '❌ Não recebida');
    console.log('📌 Webhook Secret carregado:', secret ? 'Sim' : '❌ Não carregado');

    if (!secret || !signature) {
      console.error('🚨 Erro: Missing secret or signature');
      throw new Error('Missing secret or signature');
    }

    console.log('🔍 Tentando construir o evento do Stripe...');
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, secret);
    } catch (err) {
      console.error('🚨 Erro ao construir evento:', err);
      throw err;
    }

    console.log('🔹 Dados do evento:', JSON.stringify(event, null, 2));
    console.log('🔹 Tipo do evento recebido:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('✅ Evento: checkout.session.completed');

        const paymentStatus = event.data.object.payment_status;
        const uniqueSlug = event.data.object.metadata?.uniqueSlug;
        const userEmail = event.data.object.customer_details?.email;

        console.log('📌 Status do pagamento:', paymentStatus);
        console.log('📌 Slug único:', uniqueSlug);
        console.log('📌 Email do usuário:', userEmail);

        if (paymentStatus === 'paid') {
          console.log('🔥 Pagamento por cartão confirmado! Atualizando Firestore...');
          const petDocRef = doc(db, 'pets', uniqueSlug);
          try {
            await updateDoc(petDocRef, { isPaid: true, userEmail, paymentMethod: 'card' });
            console.log(`✅ Documento atualizado: ${uniqueSlug} -> isPaid: true`);
          } catch (updateError) {
            console.error(`❌ Erro ao atualizar Firestore: ${updateError}`);
          }
        }
        break;

      default:
        console.log(`⚠️ Evento ${event.type} não tratado`);
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error('❌ Erro no webhook-stripe:', error);
    return NextResponse.json({ message: `Webhook error: ${error}`, ok: false }, { status: 500 });
  }
}

