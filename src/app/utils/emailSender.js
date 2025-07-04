export async function enviarEmailConfirmacao({ nome, email, linkPetPage }) {
  const payload = {
    to: email,
    subject: `Sua PetPage está no ar! 🐾`,
    html: `
      <h1>Olá ${nome},</h1>
      <p>O pagamento foi confirmado com sucesso! 🥳</p>
      <p>Acesse a página do seu pet pelo link abaixo:</p>
      <a href="${linkPetPage}" target="_blank">${linkPetPage}</a>
      <p>Obrigado por usar a PetPage ❤️</p>
    `,
  };

  await fetch(`${process.env.EMAIL_API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
