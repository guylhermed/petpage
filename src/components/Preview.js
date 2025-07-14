import React, { useEffect, useState } from 'react';
import { calculateTimeInFamily, } from '@/app/utils/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, Share } from 'lucide-react';


const Preview = ({ formData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeView, setActiveView] = useState('message');
  const [enlargedPhoto, setEnlargedPhoto] = useState(null);

  // Formata o nome do pet para o URL
  const petPageUrl = `petpage.com/${formData.name ? formData.name.toLowerCase().replace(/\s+/g, '-') : ''}`;

  // Garante que apelidos seja um array, mesmo que não esteja definido
  const nicknames = formData.nicknames || [];
  const nicknameText = nicknames.length > 0 ? nicknames.join(', ') : '';

  // Garante que images seja um array, mesmo que não esteja definido
  const images = formData.images || [];

  // Calcula o tempo que o pet está na família
  const timeInFamily = calculateTimeInFamily(formData);

  const handlePhotoClick = (url) => {
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
    return formData.nicknames?.length > 0 ? `Também chamado de ${formData.nicknames.join(', ')}` : '';
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


  const handleSocialShare = (platform) => {
    const slug = formData.name?.toLowerCase().replace(/\s+/g, '-');
    const pageUrl = `https://mypetpage.com/${slug}`;
    const shareText = `Confira a página de ${formData.name} na PetPage!`;

    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      instagram: `https://www.instagram.com/`, // Instagram não permite link direto
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };


  const dataTexto = getDateText(formData);

  return (
    <>
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        {/* Header with gradient */}
        <div className="h-32 bg-gradient-to-br from-pet-purple via-pet-blue to-purple-600 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-4 right-4">
            <Heart className="w-6 h-6 text-white/80 animate-bounce-gentle" />
          </div>
        </div>

        <CardContent className="relative px-6 pb-6">
          {/* Pet Photo */}
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt={formData.name}
                  className="w-full h-full rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handlePhotoClick(formData.photo)}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-pet-purple/20 to-pet-blue/20 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-pet-purple/60" />
                </div>
              )}
            </div>
          </div>

          {/* Pet Name */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              {formData.name || 'Your Pet\'s Name'}
            </h1>
            {formatNicknames() && (
              <p className="text-pet-gray text-sm font-medium">
                {formatNicknames()}
              </p>
            )}
          </div>

          {/* Time in Family */}
          {calculateTimeInFamily() && (
            <div className="bg-gradient-to-r from-pet-purple/10 to-pet-blue/10 rounded-xl p-4 mb-4 text-center">
              <p className="text-pet-purple font-semibold text-lg">
                {calculateTimeInFamily()}
              </p>
              <p className="text-pet-gray text-sm">with our family</p>
            </div>
          )}

          {/* View Toggle Buttons */}
          <div className="flex gap-1 mb-4">
            <Button
              variant={activeView === 'message' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('message')}
              className={`flex-1 rounded-xl transition-all duration-200 text-xs ${
                activeView === 'message'
                  ? 'bg-gradient-to-r from-pet-purple to-pet-blue text-white'
                  : 'border-pet-purple text-pet-purple hover:bg-pet-purple hover:text-white'
              }`}
            >
              Special Message
            </Button>
            <Button
              variant={activeView === 'gallery' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('gallery')}
              className={`flex-1 rounded-xl transition-all duration-200 text-xs ${
                activeView === 'gallery'
                  ? 'bg-gradient-to-r from-pet-purple to-pet-blue text-white'
                  : 'border-pet-purple text-pet-purple hover:bg-pet-purple hover:text-white'
              }`}
            >
              Gallery
            </Button>
            <Button
              variant={activeView === 'share' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('share')}
              className={`flex-1 rounded-xl transition-all duration-200 text-xs ${
                activeView === 'share'
                  ? 'bg-gradient-to-r from-pet-purple to-pet-blue text-white'
                  : 'border-pet-purple text-pet-purple hover:bg-pet-purple hover:text-white'
              }`}
            >
              Share
            </Button>
          </div>

          {/* Content based on active view */}
          {activeView === 'message' ? (
            <>
              {/* Special Message */}
              {formData.message && (
                <div className="bg-pet-light rounded-xl p-4 mb-4">
                  <p className="text-gray-700 text-center italic leading-relaxed">
                    "{formData.message}"
                  </p>
                </div>
              )}

              {/* Date Info */}
              {dataTexto && (
                <div className="text-center text-sm text-pet-gray mb-4">
                  <p>{dataTexto}</p>
                </div>
              )}

              {/* Heart decoration */}
              <div className="flex justify-center">
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
            </>
          ) : activeView === 'gallery' ? (
            <>
              {/* Gallery View */}
              <div className="space-y-4">
                {formData.galleryPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {formData.galleryPhotos.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-xl overflow-hidden">
                        <img
                          src={photo}
                          alt={`${formData.name} photo ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                          onClick={() => handlePhotoClick(photo)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-pet-purple/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-8 h-8 text-pet-purple/60" />
                    </div>
                    <p className="text-pet-gray">No photos uploaded yet</p>
                    <p className="text-sm text-pet-gray">Add photos to create a gallery</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Share View */}
              <div className="space-y-4">
                {/* QR Code */}
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <div className="w-24 h-24 bg-black rounded-lg flex items-center justify-center">
                      <div className="text-white text-xs font-mono leading-tight">
                        QR CODE
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-pet-gray mb-4">Scan to visit {formData.name}'s page</p>
                </div>

                {/* Social Share Buttons */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-pet-purple text-center mb-3">Share on social media</p>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialShare('whatsapp')}
                      className="rounded-xl border-green-500 text-green-600 hover:bg-green-50"
                    >
                      <Share className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialShare('facebook')}
                      className="rounded-xl border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Share className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialShare('instagram')}
                      className="rounded-xl border-pink-500 text-pink-500 hover:bg-pink-50"
                    >
                      <Share className="w-4 h-4 mr-2" />
                      Instagram
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialShare('twitter')}
                      className="rounded-xl border-blue-400 text-blue-400 hover:bg-blue-50"
                    >
                      <Share className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Photo Enlargement Modal */}
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
              alt="Enlarged photo"
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
