import { NextResponse } from 'next/server';
import { abacatepayApiKey } from '@/app/utils/utils';

export async function POST(req) {
  try {
    const body = await req.json();
    const { uniqueSlug, selectedPlan, emailCliente, nomeCliente, cellCliente, cpfCnpjCliente } = body;

    console.log('🟢 Requisição recebida em /api/create-cobranca-abacatepay');
    console.log('📦 Dados recebidos:', JSON.stringify(body, null, 2));

    const planos = {
      basico: {
        externalId: 'pp30dias',
        name: 'PetPage 30 Dias',
        price: 990,
        description: 'Página PetPage personalizada com expiração em 30 dias.',
      },
      vitalicio: {
        externalId: 'ppvitalicio',
        name: 'PetPage Vitalício',
        price: 2990,
        description: 'Página PetPage personalizada com acesso vitalício.',
      },
    };

    const planoSelecionado = planos[selectedPlan];
    if (!planoSelecionado) {
      console.error('❌ Plano inválido:', selectedPlan);
      return NextResponse.json({ error: 'Plano inválido.' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://www.minhapetpage.com';

    if (!emailCliente || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCliente)) {
      console.error('❌ Email inválido recebido:', emailCliente);
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    if (!nomeCliente || !cellCliente || !cpfCnpjCliente) {
      console.warn('⚠️ Dados incompletos do cliente:', {
        nomeCliente,
        cellCliente,
        cpfCnpjCliente,
      });
    }

    const payload = {
      frequency: 'ONE_TIME',
      methods: ['PIX'],
      allowCoupons: true,
      products: [
        {
          externalId: uniqueSlug,
          name: planoSelecionado.name,
          quantity: 1,
          price: planoSelecionado.price,
          description: planoSelecionado.description,
        },
      ],
      returnUrl: `${origin}/`,
      completionUrl: `${origin}/success?uniqueSlug=${uniqueSlug}`,
      customer: {
        email: emailCliente,
        name: nomeCliente || 'Cliente PetPage',
        cellphone: cellCliente || '48999999999',
        taxId: cpfCnpjCliente || '00000000000',
      },
      metadata: {
        uniqueSlug,
        returnUrl: `${origin}/`,
        completionUrl: `${origin}/success?uniqueSlug=${uniqueSlug}`,
      },
    };

    console.log('🔻 Payload enviado para AbacatePay:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://api.abacatepay.com/v1/billing/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${abacatepayApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log('📬 Resposta da AbacatePay:', JSON.stringify(result, null, 2));

    if (result.error || !result.data?.url) {
      console.error('❌ Erro na criação da cobrança AbacatePay:', result);
      return NextResponse.json({ error: 'Erro ao criar cobrança', detalhes: result }, { status: 500 });
    }

    return NextResponse.json({ url: result.data.url });
  } catch (error) {
    console.error('❌ Erro inesperado na rota AbacatePay:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
