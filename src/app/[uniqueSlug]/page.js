'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseConfigSelector } from '@/app/config/firebaseConfigSelector';
import { FaImage } from 'react-icons/fa';
import { calculateTimeInFamily, capitalizeFirstLetter } from '@/app/utils/utils';
import { Heart, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export default function PetPage() {
  const { uniqueSlug } = useParams(); // Pegando o uniqueSlug corretamente no App Router
  const [petData, setPetData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeInFamily, setTimeInFamily] = useState(null);
  const { db } = firebaseConfigSelector();
  const slug = Array.isArray(uniqueSlug) ? uniqueSlug[0] : uniqueSlug; // Sempre será string
  const petPageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [enlargedPhoto, setEnlargedPhoto] = useState(null);
  const [activeView, setActiveView] = useState('message');

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

  const formatApelidos = () => {
    return petData?.nicknames?.length ? petData.nicknames.join(' • ') : '';
  };

  const getDateText = () => {
    if (!petData) return '';

    if (petData.mostrarDataNascimento && petData.birthDate) {
      return `Nascimento em ${new Date(petData.birthDate).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`;
    } else if (petData.mostrarDataAdocao && petData.adoptionDate) {
      return `Adoção em ${new Date(petData.adoptionDate).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`;
    }

    return '';
  };

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
    <div className="min-h-screen bg-backgroundColor flex justify-center items-center p-4">
      <div className="w-full max-w-lg shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden rounded-xl">
        {/* Cabeçalho com gradiente */}
        <div className="h-32 bg-gradient-to-br from-petPurple via-petBlue to-purple-600 relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-4 right-4">
            <Heart className="w-6 h-6 text-white/80 animate-bounce-gentle" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="relative px-6 pb-6">
          {/* Avatar central */}
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
              {petData.images?.[0] ? (
                <img
                  src={petData.images[0]}
                  alt={petData.petName}
                  className="w-full h-full rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setEnlargedPhoto(petData.images[0])}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-petPurple/20 to-petBlue/20 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-petPurple/60" />
                </div>
              )}
            </div>
          </div>

          {/* Nome e apelidos */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{petData.petName || 'Nome do Pet'}</h1>
            {formatApelidos() && <p className="text-petGray text-sm font-medium">{formatApelidos()}</p>}
          </div>

          {/* Tempo na família */}
          {timeInFamily && (
            <div className="bg-gradient-to-r from-petPurple/10 to-petBlue/10 rounded-xl p-4 mb-4 text-center">
              <p className="text-petPurple font-semibold text-lg">{timeInFamily}</p>
              <p className="text-petGray text-sm">com nossa família</p>
            </div>
          )}

          {/* Mensagem */}
          {petData.message && (
            <div className="bg-petLight rounded-xl p-4 mb-4">
              <p className="text-gray-700 text-center italic leading-relaxed">"{petData.message}"</p>
            </div>
          )}

          {/* Data de nascimento/adoção */}
          {getDateText() && (
            <div className="text-center text-sm text-petGray mb-4">
              <p>{getDateText()}</p>
            </div>
          )}

          {/* Coraçãozinhos */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${
                    i < 3 ? 'text-red-400 fill-red-400' : 'text-gray-300'
                  } transition-all duration-200 hover:scale-110`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-1 mb-4 px-6">
            {['message', 'gallery', 'share'].map(view => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`flex-1 rounded-xl text-xs px-3 py-2 font-medium transition-all duration-200 ${
                  activeView === view
                    ? 'bg-gradient-to-r from-petPurple to-petBlue text-white'
                    : 'border border-petPurple text-petPurple hover:bg-petPurple hover:text-white'
                }`}
              >
                {view === 'message' ? 'Mensagem' : view === 'gallery' ? 'Galeria' : 'Compartilhar'}
              </button>
            ))}
          </div>

          {activeView === 'gallery' && (
            <div className="px-6 pb-6">
              {petData.images?.length > 1 ? (
                <div className="grid grid-cols-2 gap-3">
                  {petData.images.slice(1).map((photo, index) => (
                    <div key={index} className="aspect-square rounded-xl overflow-hidden">
                      <img
                        src={photo}
                        alt={`${petData.name} ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        onClick={() => setEnlargedPhoto(photo)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-petPurple/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-8 h-8 text-petPurple/60" />
                  </div>
                  <p className="text-petGray">Nenhuma foto enviada ainda</p>
                  <p className="text-sm text-petGray">Adicione imagens para montar a galeria</p>
                </div>
              )}
            </div>
          )}

          {activeView === 'share' && (
            <div className="px-6 pb-6 space-y-4">
              <div className="text-center">
                <div className="w-52 h-52 bg-gray-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <div className="w-44 h-44 bg-white rounded-lg flex items-center justify-center">
                    <QRCodeCanvas value={petPageUrl} size={160} level="H" className="mx-auto" />
                  </div>
                </div>
                <p className="text-sm text-petGray mb-4">Aponte a câmera para visitar a página de {petData.name}</p>
              </div>

              <p className="text-sm font-medium text-petPurple text-center">Compartilhar</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: 'WhatsApp',
                    color: 'green-600',
                    href: `https://wa.me/?text=${encodeURIComponent(petPageUrl)}`,
                  },
                  {
                    label: 'Facebook',
                    color: 'blue-600',
                    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(petPageUrl)}`,
                  },
                  {
                    label: 'Instagram',
                    color: 'pink-500',
                    href: `https://www.instagram.com/`, // Instagram não aceita link direto de compartilhamento
                    disabled: true,
                  },
                  {
                    label: 'Twitter',
                    color: 'blue-400',
                    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(petPageUrl)}`,
                  },
                ].map(({ label, color, href, disabled }) => (
                  <a
                    key={label}
                    href={disabled ? '#' : href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-xl border text-sm py-1 text-center border-${color} text-${color} hover:bg-${color}/10 ${
                      disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal da imagem ampliada */}
      {enlargedPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setEnlargedPhoto(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 z-10"
            >
              <X className="w-4 h-4 text-gray-800" />
            </button>
            <img
              src={enlargedPhoto}
              alt="Foto ampliada"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={() => setEnlargedPhoto(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
