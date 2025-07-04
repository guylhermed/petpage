import * as React from 'react';

export function EmailTemplateConfirmacaoPagamento({ nome, linkPetPage }) {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f8f8',
        padding: '32px',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          background: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            backgroundColor: '#5c00c8',
            color: 'white',
          }}
        >
          <h1 style={{ fontSize: '22px', margin: 0 }}>🐾 Sua PetPage está no ar!</h1>
        </div>

        <div style={{ padding: '24px', fontSize: '16px', lineHeight: '1.6', textAlign: 'center' }}>
          <p>
            Olá <strong>{nome}</strong>,
          </p>
          <p>
            O pagamento foi confirmado com sucesso! Sua página está pronta e você já pode acessá-la clicando abaixo:
          </p>

          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <a
              href={linkPetPage}
              style={{
                display: 'inline-block',
                backgroundColor: '#5c00c8',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                maxWidth: '100%',
              }}
            >
              Acessar minha PetPage
            </a>
          </div>

          <p>Se tiver qualquer dúvida, é só responder este e-mail. ❤️</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="https://minhapetpage.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://minhapetpage.com/logo.png"
              alt="PetPage"
              width="100"
              style={{ display: 'inline-block' }}
            />
          </a>
        </div>

        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#666',
          }}
        >
          PetPage · Um produto feito com carinho
        </div>
      </div>
    </div>
  );
}
