import React from 'react';
import { FaImage } from 'react-icons/fa';

const Preview = ({ formData }) => {
  // Formata o nome do pet para o URL
  const petPageUrl = `petpage.com/${formData.name ? formData.name.toLowerCase().replace(/\s+/g, '-') : ''}`;

  // Garante que nicknames seja um array, mesmo que não esteja definido
  const nicknames = formData.nicknames || [];
  const nicknameText = nicknames.length > 0 ? nicknames.join(', ') : '';

  // Garante que images seja um array, mesmo que não esteja definido
  const images = formData.images || [];

  // Calcula a data de permanência na família
  const calculateTimeInFamily = () => {
    const now = new Date();
    const adoptionDate = new Date(formData.adoptionDate);
    const birthDate = new Date(formData.birthDate);
    const diffAdopt = now - adoptionDate;
    const diffBirth = now - birthDate;
    if (formData.adoptionDate) {
      return `${Math.floor(diffAdopt / (1000 * 60 * 60 * 24 * 365))} anos e ${Math.floor((diffAdopt % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24))} dias`;
    } else if (formData.birthDate) {
      return `${Math.floor(diffBirth / (1000 * 60 * 60 * 24 * 365))} anos e ${Math.floor((diffBirth % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24))} dias`;
    }
    return '';
  };

  const timeInFamily = calculateTimeInFamily();

  const capitalizeFirstLetter = string => {
    return string
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

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
            <img src={URL.createObjectURL(images[0])} alt="Imagem do Pet" className="w-full h-full object-cover" />
          ) : (
            <FaImage className="text-primaryPurple w-16 h-16" /> // Ícone de imagem no centro
          )}
        </div>
        {/* Informações do Pet */}
        <div className="text-center text-white">
          {formData.name ? (
            <h2 className="text-3xl text-primaryPurple font-bold mb-2 mt-2">{capitalizeFirstLetter(formData.name)}</h2>
          ) : (
            ''
          )}
          {nicknameText && (
            <p className="text-sm mb-5 font-extralight">
              Também sou chamado carinhosamente de{' '}
              <span className="font-medium">{capitalizeFirstLetter(nicknameText)}</span>
            </p>
          )}
          {timeInFamily && <p className="text-md mb-2 font-extralight">Estou na família há {timeInFamily}</p>}
          {formData.message ? (
            <p className="text-lg mb-4 italic font-extralight leading-tight">{formData.message}</p>
          ) : (
            ''
          )}
          <p>❤️</p>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Preview;
