import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { uniqueSlug, selectedPlan, emailCliente, nomePet } = await req.json();

    // Definir valores base
    const planos = {
      basico: {
        externalId: 'pp30dias',
        name: 'PetPage 30 Dias',
        price: 990,
        description: 'Página PetPage personalizada com expiração em 30 dias.'
      },
      vitalicio: {
        externalId: 'ppvitalicio',
        name: 'PetPage Vitalício',
        price: 2990,
        description: 'Página PetPage personalizada com acesso vitalício.'
      }
    };

    const planoSelecionado = planos[selectedPlan];
    if (!planoSelecionado) {
      return NextResponse.json({ error: 'Plano inválido.' }, { status: 400 });
    }

    const payload = {
      frequency: 'ONE_TIME',
      methods: ['PIX'],
      products: [
        {
          externalId: uniqueSlug,
          name: planoSelecionado.name,
          quantity: 1,
          price: planoSelecionado.price,
          description: planoSelecionado.description
        }
      ],
      returnUrl: `${req.headers.get('origin')}/`,
      completionUrl: `${req.headers.get('origin')}/success?uniqueSlug=${uniqueSlug}`,
      customer: {
        email: emailCliente || 'email@cliente.com.br',
        name: nomePet || 'Cliente PetPage',
        cellphone: '48999999999',
        taxId: '08881523965'
      },
      metadata: {
        uniqueSlug,
        returnUrl: `${req.headers.get('origin')}/`,
        completionUrl: `${req.headers.get('origin')}/success?uniqueSlug=${uniqueSlug}`
      },
      allowCoupons: true,
    };

    const response = await fetch('https://api.abacatepay.com/v1/billing/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.error || !result.data?.url) {
      console.error('Erro na criação da cobrança:', result);
      return NextResponse.json({ error: 'Erro ao criar cobrança' }, { status: 500 });
    }

    return NextResponse.json({ url: result.data.url });
  } catch (error) {
    console.error('Erro geral na rota AbacatePay:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
