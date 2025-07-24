import React, { useEffect, useState } from 'react';
import { calculateTimeInFamily } from '@/app/utils/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

const Preview = ({ formData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeView, setActiveView] = useState('message');
  const [enlargedPhoto, setEnlargedPhoto] = useState(null);

  const { resolvedTheme } = useTheme();

  // Formata o nome do pet para o URL
  const petPageUrl = `petpage.com/${formData.petName ? formData.petName.toLowerCase().replace(/\s+/g, '-') : ''}`;

  // Garante que apelidos seja um array, mesmo que não esteja definido
  const nicknames = formData.nicknames || [];
  const nicknameText = nicknames.length > 0 ? nicknames.join(', ') : '';

  // Garante que images seja um array, mesmo que não esteja definido
  const images = formData.images || [];

  // Calcula o tempo que o pet está na família
  const timeInFamily = calculateTimeInFamily(formData);

  const { toast } = useToast();

  const handlePhotoClick = url => {
    setEnlargedPhoto(url);
  };

  // Efeito para alternar as imagens automaticamente
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 3000); // Troca de imagem a cada 3 segundos

      return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }
  }, [images]);

  const formatNicknames = () => {
    return formData.nicknames?.length ? formData.nicknames.join(' • ') : '';
  };

  const getDateText = formData => {
    if (!formData) return '';

    if (formData.mostrarDataNascimento && formData.birthDate) {
      return `Nascimento em ${new Date(formData.birthDate).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`;
    } else if (formData.mostrarDataAdocao && formData.adoptionDate) {
      return `Adoção em ${new Date(formData.adoptionDate).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`;
    }

    return '';
  };

  const dataTexto = getDateText(formData);

  return (
    <>
      <Card
        className={`w-full max-w-lg shadow-2xl border-0 overflow-hidden backdrop-blur-sm ${resolvedTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white/90 text-gray-800'}`}
      >
        <div className="h-32 bg-gradient-to-br from-petPurple via-petBlue to-purple-600 relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-4 right-4">
            <Heart className="w-6 h-6 text-white/80 animate-bounce-gentle" />
          </div>
        </div>

        <CardContent className="relative px-6 pb-6">
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt={formData.petName}
                  className="w-full h-full rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handlePhotoClick(formData.photo)}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-petPurple/20 to-petBlue/20 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-petPurple/60" />
                </div>
              )}
            </div>
          </div>

          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold mb-1">{formData.petName || 'Nome do Pet'}</h1>
            {formatNicknames() && <p className="text-petGray text-sm font-medium">{formatNicknames()}</p>}
          </div>

          {timeInFamily && (
            <div className="bg-gradient-to-r from-petPurple/10 to-petBlue/10 rounded-xl p-4 mb-4 text-center">
              <p className="text-petPurple font-semibold text-lg">{timeInFamily}</p>
              <p className="text-petGray text-sm">com nossa família</p>
            </div>
          )}

          <div className="flex gap-1 mb-4">
            {['message', 'gallery', 'share'].map(view => (
              <Button
                key={view}
                variant={activeView === view ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView(view)}
                className={`flex-1 rounded-xl text-xs transition-all duration-200 ${
                  activeView === view
                    ? 'bg-gradient-to-r from-petPurple to-petBlue text-white'
                    : 'border-petPurple text-petPurple hover:bg-petPurple hover:text-white'
                }`}
              >
                {view === 'message' ? 'Mensagem' : view === 'gallery' ? 'Galeria' : 'Compartilhar'}
              </Button>
            ))}
          </div>

          {activeView === 'message' && (
            <>
              {formData.message && (
                <div className="bg-petLight rounded-xl p-4 mb-4">
                  <p className="text-gray-700 dark:text-gray-300 text-center italic leading-relaxed">
                    "{formData.message}"
                  </p>
                </div>
              )}
              {dataTexto && (
                <div className="text-center text-sm text-petGray mb-4">
                  <p>{dataTexto}</p>
                </div>
              )}
              <div className="flex justify-center">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-4 h-4 ${i < 3 ? 'text-red-400 fill-red-400' : 'text-gray-300'} transition-all duration-200 hover:scale-110`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {activeView === 'gallery' && (
            <div className="space-y-4">
              {formData.galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {formData.galleryPhotos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-xl overflow-hidden">
                      <img
                        src={photo}
                        alt={`${formData.petName} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        onClick={() => handlePhotoClick(photo)}
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
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                    <img src="/qrcode-petpage.png" alt="QR Code PetPage" className="w-20 h-20 object-contain" />
                  </div>
                </div>
                <p className="text-sm text-petGray mb-4">
                  Após criado: aponte a câmera para visitar a página de {formData.petName}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-petPurple text-center mb-3">Compartilhar</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'WhatsApp', color: 'bg-green-500', text: 'text-green-600' },
                    { label: 'Facebook', color: 'bg-blue-600', text: 'text-blue-600' },
                    { label: 'Instagram', color: 'bg-pink-500', text: 'text-pink-500' },
                    { label: 'Twitter', color: 'bg-blue-400', text: 'text-blue-400' },
                  ].map(({ label, color, text }) => (
                    <Button
                      key={label}
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: 'Indisponível no Preview',
                          description: 'Após criar sua PetPage, os botões estarão ativos para compartilhar.',
                        })
                      }
                      className={`rounded-xl ${text} hover:${color}/10`}
                    >
                      <Share className="w-4 h-4 mr-2" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
    </>
  );
};

export default Preview;
