'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseConfigSelector } from '@/app/config/firebaseConfigSelector';
import { FaImage } from 'react-icons/fa';
import { calculateTimeInFamily, capitalizeFirstLetter } from '@/app/utils/utils';

export default function PetPage() {
  const { uniqueSlug } = useParams(); // Pegando o uniqueSlug corretamente no App Router
  const [petData, setPetData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeInFamily, setTimeInFamily] = useState(null);
  const { db } = firebaseConfigSelector();
  const slug = Array.isArray(uniqueSlug) ? uniqueSlug[0] : uniqueSlug; // Sempre será string

  // Carregamento dos dados do pet
  useEffect(() => {
    (async () => {
      if (!slug) return;

      try {
        const petDocRef = doc(db, 'pets', slug);
        const petDoc = await getDoc(petDocRef);

        if (petDoc.exists()) {
          const petData = petDoc.data();
          setPetData(petData);

          const time = calculateTimeInFamily(petData);
          setTimeInFamily(time);
          console.log('Petdata setado:', petData);
        } else {
          console.log('Pet não encontrado!');
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do pet:', error);
      }
    })();
  }, [slug]);

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
      <div className="flex justify-center items-center h-screen bg-backgroundColor">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primaryPurple border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primaryPurple mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-backgroundColor">
      <div className="rounded-lg shadow-lg overflow-hidden w-80 md:w-96 bg-primaryPurple">
        {/* Simulação de Navegador */}
        <div className="bg-primaryBlue text-white p-2 text-sm">
          <p>{`petpage.com/${uniqueSlug}`}</p>
        </div>
        {/* Tela do celular */}
        <div className="h-160 flex flex-col p-4 overflow-y-auto">
          {/* Imagem do Pet */}
          <div className="relative w-full h-100 bg-gray-200 border-4 border-primaryBlue mb-2 flex items-center justify-center rounded-lg">
            {petData.images && petData.images.length > 0 ? (
              <img
                src={petData.images[currentImageIndex]}
                alt={petData.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <FaImage className="text-primaryPurple w-16 h-16" />
            )}
          </div>
          {/* Informações do Pet */}
          <div className="text-center text-white">
            {petData.name ? (
              <h2 className="text-3xl text-primaryBlue font-bold mb-2 mt-2">{capitalizeFirstLetter(petData.name)}</h2>
            ) : (
              ''
            )}
            {petData.nicknames?.length > 0 && (
              <p className="text-sm mb-3 font-extralight">
                Também sou chamado carinhosamente de <span className="font-medium">{petData.nicknames.join(', ')}</span>
              </p>
            )}
            {timeInFamily && (
              <p className="text-sm mb-4 font-extralight">
                Estou na família há <br />
                <span className="text-md font-bold">{timeInFamily}</span>
              </p>
            )}
            {petData.message ? (
              <p className="text-lg mb-3 italic font-light leading-tight break-words overflow-hidden">
                {petData.message}
              </p>
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
