import React, { useEffect, useState } from 'react';
import { FaImage } from 'react-icons/fa';
import { calculateTimeInFamily, capitalizeFirstLetter } from '@/app/utils/utils';

const Preview = ({ formData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Formata o nome do pet para o URL
  const petPageUrl = `petpage.com/${formData.name ? formData.name.toLowerCase().replace(/\s+/g, '-') : ''}`;

  // Garante que apelidos seja um array, mesmo que não esteja definido
  const nicknames = formData.nicknames || [];
  const nicknameText = nicknames.length > 0 ? nicknames.join(', ') : '';

  // Garante que images seja um array, mesmo que não esteja definido
  const images = formData.images || [];

  // Calcula o tempo que o pet está na família
  const timeInFamily = calculateTimeInFamily(formData);

  // Efeito para alternar as imagens automaticamente
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 3000); // Troca de imagem a cada 3 segundos

      return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }
  }, [images]);

  return (
    <div className="rounded-lg shadow-lg overflow-hidden h-full w-full md:w-96">
      {/* Simulação de Navegador */}
      <div className="bg-primaryBlue text-white p-2 text-sm">
        <p>{petPageUrl}</p>
      </div>
      {/* Retângulo representando a tela do celular */}
      <div className="h-160 bg-primaryPurple flex flex-col p-4 overflow-y-auto">
        {/* Área para a imagem do pet */}
        <div className="relative w-full h-100 bg-gray-200 border-4 border-primaryBlue mb-2 flex items-center justify-center rounded-lg">
          {/* Exibe a imagem carregada no formulário, ajustando-a */}
          {images.length > 0 ? (
            <img
              src={URL.createObjectURL(images[currentImageIndex])}
              alt="Imagem do Pet"
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          ) : (
            <FaImage className="text-primaryPurple w-16 h-16" />
          )}
        </div>
        {/* Informações do Pet */}
        <div className="text-center text-white">
          {formData.name ? (
            <h2 className="text-3xl text-primaryBlue font-bold mb-2 mt-2">{capitalizeFirstLetter(formData.name)}</h2>
          ) : (
            ''
          )}
          {nicknameText && (
            <p className="text-sm mb-3 font-extralight">
              Também sou chamado carinhosamente de{' '}
              <span className="font-medium">{capitalizeFirstLetter(nicknameText)}</span>
            </p>
          )}
          {timeInFamily && (
            <p className="text-sm mb-4 font-extralight">
              Estou na família há <br />
              <span className="text-md font-bold">{timeInFamily}</span>
            </p>
          )}
          {formData.message ? (
            <p className="text-lg mb-3 italic font-light leading-tight break-words overflow-hidden">
              {formData.message}
            </p>
          ) : (
            ''
          )}
          <p>❤️</p>
        </div>
      </div>
    </div>
  );
};

export default Preview;
