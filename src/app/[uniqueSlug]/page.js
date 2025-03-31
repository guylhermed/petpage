'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseConfigSelector } from '@/app/config/firebaseConfigSelector';
import { FaImage } from 'react-icons/fa';

export default function PetPage() {
  const { uniqueSlug } = useParams(); // Pegando o uniqueSlug corretamente no App Router
  const [petData, setPetData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { db } = firebaseConfigSelector();

  // Carregamento dos dados do pet
  useEffect(() => {
    const fetchPetData = async () => {
      if (uniqueSlug) {
        const petDocRef = doc(db, 'pets', uniqueSlug);
        const petDoc = await getDoc(petDocRef);

        if (petDoc.exists()) {
          setPetData(petDoc.data());
          console.log('Dados do pet encontrados:', petDoc.data());
        } else {
          console.log('Pet não encontrado!');
        }
      }
    };

    fetchPetData();
  }, [uniqueSlug]);

  // Alternar imagens automaticamente
  useEffect(() => {
    if (petData?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % petData.images.length);
      }, 3000);

      return () => clearInterval(interval); // Limpar intervalo quando o componente for desmontado
    }
  }, [petData]);

  if (!petData) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  const capitalizeFirstLetter = string => {
    return string
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const calculateTimeInFamily = () => {
    if (petData.adoptionDate) {
      const adoptionDate = new Date(petData.adoptionDate);
      const now = new Date();
      const diff = now - adoptionDate;
      return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365))} anos e ${Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24))} dias`;
    } else if (petData.birthDate) {
      const birthDate = new Date(petData.birthDate);
      const now = new Date();
      const diff = now - birthDate;
      return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365))} anos e ${Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24))} dias`;
    }
    return '';
  };

  const timeInFamily = calculateTimeInFamily();

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="rounded-lg shadow-lg overflow-hidden w-80 md:w-96 bg-gray-900">
        {/* Simulação de Navegador */}
        <div className="bg-gray-800 text-white p-2 text-sm">
          <p>{`petpage.com/${uniqueSlug}`}</p>
        </div>
        {/* Tela do celular */}
        <div className="h-160 flex flex-col p-4 overflow-y-auto">
          {/* Imagem do Pet */}
          <div className="relative w-full h-100 bg-gray-200 border-4 border-primaryPurple mb-2 flex items-center justify-center rounded-lg">
            {petData.images && petData.images.length > 0 ? (
              <img
                src={petData.images[currentImageIndex]}
                alt={petData.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <FaImage className="text-green-500 w-16 h-16" />
            )}
          </div>
          {/* Informações do Pet */}
          <div className="text-center text-white">
            {petData.name ? (
              <h2 className="text-3xl text-primaryPurple font-bold mb-2 mt-2">{capitalizeFirstLetter(petData.name)}</h2>
            ) : (
              ''
            )}
            {petData.nicknames?.length > 0 && (
              <p className="text-sm mb-5 font-extralight">
                Também sou chamado carinhosamente de <span className="font-medium">{petData.nicknames.join(', ')}</span>
              </p>
            )}
            {timeInFamily && <p className="text-md mb-2 font-extralight">Estou na família há {timeInFamily}</p>}
            {petData.message ? (
              <p className="text-lg mb-4 italic font-extralight leading-tight">{petData.message}</p>
            ) : (
              ''
            )}
            <p>❤️</p>
          </div>
        </div>
      </div>
    </div>
  );
}
