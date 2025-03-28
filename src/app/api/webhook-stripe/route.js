import { NextResponse } from 'next/server';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firebaseConfigSelector } from '@/app/config/firebaseConfigSelector';
import Stripe from 'stripe';
import { headers } from "next/headers";

const { db } = firebaseConfigSelector();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
    try {
        const body = await req.text();
        const signature = headers().get("stripe-signature");

        if (!secret || !signature) {
            throw new Error("Missing secret or signature");
        }

        const event = stripe.webhooks.constructEvent(body, signature, secret);

        console.log("🔹 Dados do evento:", JSON.stringify(event.data, null, 2));

        switch (event.type) {
            case "checkout.session.completed":

                // Pagamento por cartão com sucesso
                if (event.data.object.payment_status === "paid") {

                    const uniqueSlug = event.data.object.metadata?.uniqueSlug;
                    const userEmail = event.data.object.customer_details?.email;
                    const petDocRef = doc(db, 'pets', uniqueSlug);
                    const paymentMethod = 'card'
                    try {
                        await updateDoc(petDocRef, {
                            isPaid: true,
                            userEmail: userEmail,
                            paymentMethod: paymentMethod
                        });
                        console.log(`Documento ${uniqueSlug} atualizado com sucesso para isPaid: true.`);
                    } catch (updateError) {
                        console.error(`Erro ao atualizar o documento ${uniqueSlug}:`, updateError);
                    }
                    console.log("Pagamento por cartão com sucesso:", uniqueSlug);
                }

                // Pagamento por boleto
                if (
                    event.data.object.payment_status === "unpaid" &&
                    event.data.object.payment_intent
                ) {
                    const paymentIntentId = event.data.object.payment_intent;
                    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

                    const hostedVoucherUrl =
                        paymentIntent.next_action?.boleto_display_details
                            ?.hosted_voucher_url;

                    const uniqueSlug = event.data.object.metadata?.uniqueSlug;
                    const userEmail = event.data.object.customer_details?.email;

                    if (hostedVoucherUrl) {
                        // O cliente gerou um boleto, manda um email pra ele
                        console.log("Gerou o boleto e o link é:", hostedVoucherUrl);

                        // Atualiza o banco de dados com o email do usuário
                        const petDocRef = doc(db, 'pets', uniqueSlug);
                        try {
                            await updateDoc(petDocRef, {
                                userEmail: userEmail
                            });
                            console.log(`Documento ${uniqueSlug} atualizado com sucesso com userEmail: ${userEmail}.`);
                        } catch (updateError) {
                            console.error(`Erro ao atualizar o documento ${uniqueSlug}:`, updateError);
                        }

                        // Aqui você pode adicionar a lógica para enviar um email ao usuário

                    } else {
                        console.log("Nenhum link de boleto encontrado.");
                    }
                }
                break;

            // O cliente saiu do checkout e expirou
            case "checkout.session.expired":
                if (event.data.object.payment_status === "unpaid") {
                    const uniqueSlug = event.data.object.metadata?.uniqueSlug;
                    const petDocRef = doc(db, 'pets', uniqueSlug);
                    try {
                        await deleteDoc(petDocRef);
                        console.log(`Documento ${uniqueSlug} deletado por sair do checkout ou expirar.`);
                    } catch (deleteError) {
                        console.error(`Erro ao deletar o documento ${uniqueSlug}:`, deleteError);
                    }
                    console.log("Checkout expirado:", uniqueSlug);
                }
                break;

            // O cliente pagou o boleto e o pagamento foi confirmado
            case "checkout.session.async_payment_succeeded":
                if (event.data.object.payment_status === "paid") {
                    const uniqueSlug = event.data.object.metadata?.uniqueSlug;
                    const petDocRef = doc(db, 'pets', uniqueSlug);
                    const paymentMethod = 'boleto'
                    try {
                        await updateDoc(petDocRef, {
                            isPaid: true,
                            paymentMethod: paymentMethod
                        });
                        console.log(`Documento ${uniqueSlug} atualizado com sucesso para isPaid: true.`);

                    } catch (updateError) {
                        console.error(`Erro ao atualizar o documento ${uniqueSlug}:`, updateError);
                    }
                    console.log("Pagamento do boleto confirmado:", uniqueSlug);
                }
                break;

            // O cliente não pagou o boleto e ele venceu
            case "checkout.session.async_payment_failed":
                if (event.data.object.payment_status === "unpaid") {
                    const uniqueSlug = event.data.object.metadata?.uniqueSlug;
                    const petDocRef = doc(db, 'pets', uniqueSlug);
                    try {
                        await deleteDoc(petDocRef);
                        console.log(`Documento ${uniqueSlug} deletado pois o boleto venceu e não foi pago.`);
                    } catch (deleteError) {
                        console.error(`Erro ao deletar o documento ${uniqueSlug}:`, deleteError);
                    }
                    console.log("Pagamento do boleto falhou:", uniqueSlug);
                }
                break;

            // O cliente cancelou o pagamento
            case "customer.subscription.deleted":
                console.log("Assinatura do cliente deletada");
                break;

            case "payment_intent.payment_failed":
                const failureReason = event.data.object.last_payment_error;

                console.error("Pagamento falhou:", failureReason);

                if (failureReason?.code === "card_declined" && failureReason?.decline_code === "insufficient_funds") {
                    console.log("O cartão foi recusado por fundos insuficientes.");
                }
                break;

        }

        return NextResponse.json({ result: event, ok: true });
    } catch (error) {
        console.error("Erro no webhook-stripe:", error);
        return NextResponse.json(
            {
                message: `Webhook error: ${error}`,
                ok: false,
            },
            { status: 500 }
        );
    }
}
