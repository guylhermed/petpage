import { NextResponse } from 'next/server';
import stripePackage from 'stripe';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { nomePet } = await req.json();

  // Verifique se nomePet está vazio
  if (!nomePet || typeof nomePet !== 'string' || nomePet.trim() === '') {
    return NextResponse.json({ error: 'O nome do pet não pode estar vazio.' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: nomePet,
            },
            unit_amount: 999, // Valor em centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Erro ao criar a sessão de checkout' }, { status: 500 });
  }
}
