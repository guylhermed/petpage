import { NextResponse } from 'next/server';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firebaseConfigSelector } from '@/app/config/firebaseConfigSelector';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const { db } = firebaseConfigSelector();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!secret || !signature) {
      console.error('🚨 Erro: Secret ou assinatura do webhook ausentes.');
      return NextResponse.json({ message: 'Missing secret or signature', ok: false }, { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, secret);
    } catch (err) {
      console.error('🚨 Erro ao construir o evento do Stripe:', err);
      return NextResponse.json({ message: `Webhook error: ${err.message}`, ok: false }, { status: 400 });
    }

    console.log('🔹 Tipo do evento recebido:', event.type);
    console.log('🔹 Dados do evento:', JSON.stringify(event.data, null, 2));

    const eventData = event.data.object;
    const uniqueSlug = eventData.metadata?.uniqueSlug;
    const userEmail = eventData.customer_details?.email;

    // Verificação global para eventos que precisam de uniqueSlug
    if (!uniqueSlug) {
      console.error(`❌ Erro: uniqueSlug ausente para o evento ${event.type}`);
      return NextResponse.json({ message: `Missing uniqueSlug for ${event.type}`, ok: false }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('✅ Evento: checkout.session.completed');

        if (eventData.payment_status === 'paid') {
          console.log('🔥 Pagamento confirmado! Atualizando Firestore...');

          const petDocRef = doc(db, 'pets', uniqueSlug);
          try {
            await updateDoc(petDocRef, { isPaid: true, userEmail, paymentMethod: 'card' });
            console.log(`✅ Documento atualizado: ${uniqueSlug} -> isPaid: true`);
          } catch (updateError) {
            console.error(`❌ Erro ao atualizar Firestore para ${uniqueSlug}:`, updateError);
          }
        } else {
          console.log(`⚠️ Pagamento não concluído (${eventData.payment_status}) para ${uniqueSlug}.`);
        }
        break;

      case 'checkout.session.async_payment_succeeded':
        console.log('✅ Pagamento via boleto confirmado');

        const boletoDocRef = doc(db, 'pets', uniqueSlug);
        try {
          await updateDoc(boletoDocRef, { isPaid: true, paymentMethod: 'boleto' });
          console.log(`✅ Documento atualizado: ${uniqueSlug} -> isPaid: true`);
        } catch (updateError) {
          console.error(`❌ Erro ao atualizar Firestore para ${uniqueSlug}:`, updateError);
        }
        break;

      case 'checkout.session.expired':
        console.log('⚠️ Checkout expirado. Excluindo documento...');
        try {
          await deleteDoc(doc(db, 'pets', uniqueSlug));
          console.log(`✅ Documento ${uniqueSlug} deletado com sucesso.`);
        } catch (deleteError) {
          console.error(`❌ Erro ao deletar o documento ${uniqueSlug}:`, deleteError);
        }
        break;

      case 'checkout.session.async_payment_failed':
        console.log('❌ Boleto não pago e expirado. Deletando documento...');
        try {
          await deleteDoc(doc(db, 'pets', uniqueSlug));
          console.log(`✅ Documento ${uniqueSlug} deletado.`);
        } catch (deleteError) {
          console.error(`❌ Erro ao deletar o documento ${uniqueSlug}:`, deleteError);
        }
        break;

      default:
        console.log(`⚠️ Evento ${event.type} não tratado.`);
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error('❌ Erro no webhook-stripe:', error);
    return NextResponse.json({ message: `Webhook error: ${error.message}`, ok: false }, { status: 500 });
  }
}