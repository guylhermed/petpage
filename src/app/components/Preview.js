import React from 'react';
import { FaImage } from 'react-icons/fa'; // Importando o ícone de imagem do react-icons

// Função para capitalizar a primeira letra de cada palavra
const capitalizeFirstLetter = string => {
  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const Preview = ({ formData }) => {
  // Formata o nome do pet para o URL
  const petPageUrl = `petpage.com/${formData.name ? formData.name.toLowerCase().replace(/\s+/g, '-') : ''}`;

  // Garante que nicknames seja um array, mesmo que não esteja definido
  const nicknames = formData.nicknames || [];
  const nicknameText = nicknames.length > 0 ? nicknames.join(', ') : '';

  // Calcula a data de permanência na família
  const calculateTimeInFamily = () => {
    if (formData.adoptionDate) {
      const adoptionDate = new Date(formData.adoptionDate);
      const now = new Date();
      const diff = now - adoptionDate;
      return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365))} anos, ${Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24))} dias`;
    } else if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const now = new Date();
      const diff = now - birthDate;
      return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365))} anos, ${Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24))} dias`;
    }
    return '';
  };

  const timeInFamily = calculateTimeInFamily();

  // Garante que images seja um array, mesmo que não esteja definido
  const images = formData.images || [];

  return (
    <div className="flex justify-center items-center mb-8 md:mb-0 lg:mb-0">
      <div className="rounded-lg shadow-lg overflow-hidden w-80 md:w-96">
        {/* Simulação de Navegador */}
        <div className="bg-gray-800 text-white p-2 text-sm">
          <p>{petPageUrl}</p>
        </div>
        {/* Retângulo representando a tela do celular */}
        <div className="h-160 bg-gray-900 flex flex-col p-4 overflow-y-auto">
          {/* Área para a imagem do pet */}
          <div className="relative w-full h-100 bg-gray-200 border-4 border-primaryGreen mb-2 flex items-center justify-center rounded-lg">
            {/* Exibe a imagem carregada no formulário, ajustando-a */}
            {images.length > 0 ? (
              <img src={URL.createObjectURL(images[0])} alt="Imagem do Pet" className="w-full h-full object-cover" />
            ) : (
              <FaImage className="text-primaryGreen w-16 h-16" /> // Ícone de imagem no centro
            )}
          </div>
          {/* Informações do Pet */}
          <div className="text-center text-white">
            {formData.name ? <h2 className="text-xl font-bold mb-2">{capitalizeFirstLetter(formData.name)}</h2> : ''}
            {nicknameText && <p className="text-md mb-2">Também me chamam de: {capitalizeFirstLetter(nicknameText)}</p>}
            {timeInFamily && <p className="text-md mb-2">Estou na família há {timeInFamily}</p>}
            {formData.message ? <p className="text-md mb-2">{formData.message}</p> : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
