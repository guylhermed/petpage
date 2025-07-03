import { NextResponse } from 'next/server';
import stripePackage from 'stripe';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { nomePet, uniqueSlug, selectedPlan } = await req.json();

    const priceId =
      selectedPlan === 'basico' ? process.env.STRIPE_PRICE_ID_BASICO : process.env.STRIPE_PRICE_ID_VITALICIO;

    // Validação de nomePet
    if (!nomePet || typeof nomePet !== 'string' || nomePet.trim() === '') {
      return NextResponse.json({ error: 'O nome do pet não pode estar vazio.' }, { status: 400 });
    }

    // Validação de uniqueSlug
    if (!uniqueSlug || typeof uniqueSlug !== 'string' || uniqueSlug.trim() === '') {
      return NextResponse.json({ error: 'O uniqueSlug não pode estar vazio.' }, { status: 400 });
    }
    if (!priceId) {
      return NextResponse.json({ error: 'Plano inválido.' }, { status: 400 });
    }

    // const session = await stripe.checkout.sessions.create({
    //   line_items: [
    //     {
    //       price: priceId,
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'payment',
    //   payment_method_types: ['card', 'boleto'], // Adicione boleto como forma de pagamento
    //   success_url: `${req.headers.get('origin')}/success?uniqueSlug=${uniqueSlug}`,
    //   cancel_url: `${req.headers.get('origin')}/`,
    //   metadata: {
    //     uniqueSlug, // Adiciona o identificador do pet
    //   },
    // });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar a sessão de checkout:', error);
    return NextResponse.json({ error: 'Erro ao criar a sessão de checkout' }, { status: 500 });
  }
}
