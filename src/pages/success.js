import { useRouter } from 'next/router'; // Importando o useRouter do Next.js
import Link from 'next/link';
import '../app/styles/globals.css';

export default function SuccessPage() {
  const router = useRouter(); // Hook para acessar a URL
  const { uniqueSlug } = router.query; // Pegando o uniqueSlug da URL

  console.log('Router Query:', router.query); // Verifica a query

  if (!uniqueSlug) {
    return <div>Carregando...</div>; // Exibe uma mensagem de carregamento até que o uniqueSlug seja obtido
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-4">Pet Page criada com sucesso!</h1>
        <p className="text-lg mb-6">Acesse sua Pet Page clicando no link abaixo ou escaneando o QR Code.</p>

        {/* Imagem de QR Code */}
        <div className="mb-6">
          <img src="/qr-code.png" alt="QR Code" className="mx-auto w-40 h-40" />
        </div>

        <div className="flex flex-col space-y-4">
          {/* Botão para acessar a Pet Page */}
          <Link href={`/${uniqueSlug}`} passHref>
            <button className="border border-white text-white hover:bg-white hover:text-black font-bold py-2 px-4 rounded transition-colors duration-300">
              Acessar sua Pet Page
            </button>
          </Link>

          {/* Botão para download do QR Code */}
          <button
            onClick={() => {
              /* lógica para download do QR Code */
            }}
            className="border border-white text-white hover:bg-white hover:text-black font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
