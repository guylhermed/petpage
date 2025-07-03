import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const payloadSimulado = {
      event: 'billing.paid',
      data: {
        payment: {
          amount: 990,
          fee: 80,
          method: 'PIX'
        },
        billing: {
          amount: 990,
          status: 'PAID',
          products: [
            {
              externalId: 'teste3-3895ded1', // slug que será atualizado no Firestore
              id: 'prod_simulado',
              quantity: 1
            }
          ],
          customer: {
            metadata: {
              name: 'Teste Usuário',
              email: 'teste@teste.com.br',
              cellphone: '47999999999',
              taxId: '12345678900'
            }
          }
        }
      },
      devMode: true
    };

    const secret = process.env.ABACATEPAY_WEBHOOK_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/webhook-abacatepay?webhookSecret=${secret}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payloadSimulado)
    });

    const result = await response.json();
    return NextResponse.json({ webhookResponse: result });
  } catch (error) {
    console.error('Erro ao testar webhook AbacatePay:', error);
    return NextResponse.json({ error: 'Erro interno ao testar' }, { status: 500 });
  }
}
