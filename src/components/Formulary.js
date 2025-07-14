'use client';
import React, { useState, useEffect } from 'react';
import { firebaseConfigSelector } from '@/app/config/firebaseConfigSelector';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { baseUrl } from '@/app/utils/utils';
import ModalDadosObrigatorios from '@/components/ModalDadosObrigatorios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Heart, Upload, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const { db, storage } = firebaseConfigSelector();

const Formulary = ({ formData, setFormData }) => {
  const router = useRouter();
  const [birthDateEnabled, setBirthDateEnabled] = useState(formData.mostrarDataNascimento);
  const [adoptionDateEnabled, setAdoptionDateEnabled] = useState(formData.mostrarDataAdocao);
  const [nicknames, setNicknames] = useState([]);
  const [nickname, setNickname] = useState('');
  const [images, setImages] = useState([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [apelidoString, setApelidoString] = useState('');

  // Valida se o botão deve ser habilitado
  useEffect(() => {
    const isNameFilled = formData.name.trim() !== '';
    const isDateFilled = (birthDateEnabled && formData.birthDate) || (adoptionDateEnabled && formData.adoptionDate);
    const isMessageFilled = formData.message && formData.message.trim() !== '';
    const isProfilePhotoUploaded = !!formData.photo;
    const isGalleryUploaded = formData.galleryPhotos.length > 0;
    const isPlanSelected = formData.selectedPlan !== '';

    setIsButtonEnabled(
      isNameFilled && (isDateFilled || isMessageFilled) && isProfilePhotoUploaded && isGalleryUploaded && isPlanSelected
    );
  }, [formData, birthDateEnabled, adoptionDateEnabled]);

  useEffect(() => {
    if (!birthDateEnabled) {
      setFormData(prev => ({ ...prev, birthDate: '' }));
    }
  }, [birthDateEnabled]);

  useEffect(() => {
    if (!adoptionDateEnabled) {
      setFormData(prev => ({ ...prev, adoptionDate: '' }));
    }
  }, [adoptionDateEnabled]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, mostrarDataNascimento: birthDateEnabled }));
  }, [birthDateEnabled]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, mostrarDataAdocao: adoptionDateEnabled }));
  }, [adoptionDateEnabled]);

  const handleAddNickname = () => {
    if (nickname.trim() !== '') {
      const newNicknames = [...nicknames, nickname];
      setNicknames(newNicknames);
      setFormData({ ...formData, nicknames: newNicknames });
      setNickname('');
    }
  };

  const handleImageUpload = e => {
    const files = Array.from(e.target.files);
    if (files.length + images.length <= 5) {
      const newImages = [...images, ...files];
      setImages(newImages);
      setFormData({ ...formData, images: newImages });
    } else {
      alert('Você pode selecionar até 5 imagens.');
    }
  };

  const handleRemoveImage = index => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setFormData({ ...formData, images: newImages });
  };

  const criarCobrancaAbacatepay = async cliente => {
    const petId = uuidv4();
    const nomePet = formData.name || 'Pet Sem Nome';
    const uniqueSlug = `${nomePet.replace(/\s+/g, '-').toLowerCase()}-${petId.slice(0, 8)}`;
    const email = cliente.email || 'teste@teste.com';

    setLoading(true);

    try {
      // Upload das imagens no Firebase
      const imageUrls = await Promise.all(
        images.map(async (image, index) => {
          const imageRef = ref(storage, `pets/${uniqueSlug}/${uniqueSlug}-${index + 1}.${image.name.split('.').pop()}`);
          await uploadBytes(imageRef, image);
          return await getDownloadURL(imageRef);
        })
      );

      // Salvando dados no Firestore com isPaid: false
      await setDoc(doc(db, 'pets', uniqueSlug), {
        ...formData,
        images: imageUrls,
        createdAt: new Date(),
        isPaid: false,
        paymentMethod: '',
        userEmail: email || '',
        petId,
        uniqueSlug,
        cellphone: cliente.telefone || '',
        taxId: cliente.cpfCnpj || '',
        name: cliente.nome || '',
      });

      // Chamada para AbacatePay
      const response = await fetch(`${baseUrl}/api/create-cobranca-abacatepay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uniqueSlug,
          selectedPlan: formData.selectedPlan,
          emailCliente: email,
          nomeCliente: cliente.nome,
          cellCliente: cliente.telefone,
          cpfCnpjCliente: cliente.cpfCnpj,
        }),
      });

      const data = await response.json();
      console.log('Resposta da Cobrança AbacatePay:', data);

      if (data.url) {
        router.push(data.url); // Redireciona para a URL de pagamento do AbacatePay
      } else {
        console.error('Erro ao criar cobrança AbacatePay:', data);
      }
    } catch (error) {
      console.error('Erro na cobrança:', error);
    } finally {
      setLoading(false);
    }
  };

  async function aoConfirmarModal(dadosCliente) {
    setLoading(true);
    await criarCobrancaAbacatepay(dadosCliente);
    setLoading(false);
  }

  const handlePhotoUpload = event => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const photoUrl = e.target?.result;
        setFormData(prev => ({ ...prev, photo: photoUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
  };

  const handleGalleryUpload = event => {
    const files = event.target.files;
    if (files) {
      const newPhotos = [];
      let processedCount = 0;

      Array.from(files)
        .slice(0, 5 - formData.galleryPhotos.length)
        .forEach(file => {
          const reader = new FileReader();
          reader.onload = e => {
            const photoUrl = e.target?.result;
            newPhotos.push(photoUrl);
            processedCount++;

            if (processedCount === Math.min(files.length, 5 - formData.galleryPhotos.length)) {
              setFormData(prev => ({
                ...prev,
                galleryPhotos: [...prev.galleryPhotos, ...newPhotos],
              }));
            }
          };
          reader.readAsDataURL(file);
        });
    }
  };

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const removeGalleryPhoto = index => {
    setFormData(prev => {
      const novasFotos = prev.galleryPhotos.filter((_, i) => i !== index);
      return { ...prev, galleryPhotos: novasFotos };
    });
  };

  return (
    <Card className="w-full max-w-lg shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-petPurple to-petBlue text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Heart className="w-5 h-5 animate-bounce-gentle" />
          Preencha o formulário e visualize no preview
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Nome do Pet */}
        <div className="space-y-2">
          <Label htmlFor="nome-pet" className="text-petPurple font-medium">
            Nome do Pet
          </Label>
          <Input
            id="nome-pet"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder="Ex: Thor"
          />
        </div>

        {/* Datas - switches e inputs */}
        <div className="space-y-3">
          {/* Nascimento */}
          <div className="flex items-center justify-between p-3 bg-petLight rounded-xl">
            <div>
              <Label className="text-petPurple font-medium">Incluir Data de Nascimento</Label>
              <p className="text-sm text-petGray">Aparecerá na página</p>
            </div>
            <Switch checked={birthDateEnabled} onCheckedChange={setBirthDateEnabled} />
          </div>
          {birthDateEnabled && (
            <Input
              type="date"
              value={formData.birthDate}
              onChange={e => handleInputChange('birthDate', e.target.value)}
            />
          )}

          {/* Adoção */}
          <div className="flex items-center justify-between p-3 bg-petLight rounded-xl">
            <div>
              <Label className="text-petPurple font-medium">Incluir Data de Adoção</Label>
              <p className="text-sm text-petGray">Quando o pet chegou até você</p>
            </div>
            <Switch checked={adoptionDateEnabled} onCheckedChange={setAdoptionDateEnabled} />
          </div>
          {adoptionDateEnabled && (
            <Input
              type="date"
              value={formData.adoptionDate}
              onChange={e => handleInputChange('adoptionDate', e.target.value)}
            />
          )}
        </div>

        {/*/!* Apelidos *!/*/}
        {/*<div className="space-y-2">*/}
        {/*  <Label htmlFor="apelido" className="text-petPurple font-medium">*/}
        {/*    Apelidos*/}
        {/*  </Label>*/}
        {/*  <div className="flex gap-2">*/}
        {/*    <Input*/}
        {/*      id="apelido"*/}
        {/*      value={nickname}*/}
        {/*      onChange={e => setNickname(e.target.value)}*/}
        {/*      placeholder="Ex: fofucho"*/}
        {/*    />*/}
        {/*    <Button type="button" onClick={handleAddNickname}>*/}
        {/*      Adicionar*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*  {nicknames.length > 0 && (*/}
        {/*    <div className="flex flex-wrap gap-2 mt-2">*/}
        {/*      {nicknames.map((nick, idx) => (*/}
        {/*        <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">*/}
        {/*          {nick}*/}
        {/*        </span>*/}
        {/*      ))}*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*</div>*/}

        {/* Apelidos separados por vírgula */}
        <div className="space-y-2">
          <Label htmlFor="apelidos" className="text-petPurple font-medium">
            Apelidos
          </Label>
          <p className="text-xs text-petGray">Separe os apelidos com vírgulas (,)</p>
          <Input
            id="apelidos"
            value={apelidoString}
            onChange={e => {
              const valor = e.target.value;
              setApelidoString(valor);
              const lista = valor
                .split(',')
                .map(ap => ap.trim())
                .filter(Boolean);
              setFormData(prev => ({ ...prev, nicknames: lista }));
            }}
            placeholder="Fofucho, Thorzinho, Bebê"
          />
        </div>

        {/* Mensagem */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-petPurple font-medium">
            Mensagem Especial
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={e => handleInputChange('message', e.target.value)}
            placeholder="Escreva algo especial sobre o seu pet..."
          />
        </div>

        {/* Imagem de perfil */}
        <div className="space-y-2">
          <Label className="text-petPurple font-medium">Foto de Perfil</Label>
          {formData.photo && (
            <div className="relative inline-block mb-3">
              <img src={formData.photo} alt="Foto de perfil" className="w-20 h-20 object-cover rounded-lg" />
              <button
                onClick={removeProfilePhoto}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-petBlue">
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="upload-foto" />
            <label htmlFor="upload-foto" className="cursor-pointer text-sm text-petBlue">
              {formData.photo ? 'Trocar foto' : 'Enviar foto'}
            </label>
          </div>
        </div>

        {/* Galeria */}
        <div className="space-y-2">
          <Label className="text-petPurple font-medium">Fotos da Galeria (até 5)</Label>
          {formData.galleryPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {formData.galleryPhotos.map((photo, idx) => (
                <div key={idx} className="relative group">
                  <img src={photo} className="w-full h-20 object-cover rounded" />
                  <button
                    onClick={() => removeGalleryPhoto(idx)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {formData.galleryPhotos.length < 5 && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-petBlue">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
                id="upload-galeria"
              />
              <label htmlFor="upload-galeria" className="cursor-pointer text-sm text-petBlue">
                Adicionar imagens ({5 - formData.galleryPhotos.length} restantes)
              </label>
            </div>
          )}
        </div>

        {/* Planos */}
        <div className="space-y-3">
          <Label className="text-petPurple font-medium">Escolha o Plano</Label>
          {[
            { tipo: 'basico', texto: '30 dias', preco: 'R$9,90' },
            { tipo: 'vitalicio', texto: 'Vitalício', preco: 'R$29,90' },
          ].map(({ tipo, texto, preco }) => (
            <div
              key={tipo}
              className={`border-2 rounded-xl p-4 cursor-pointer ${
                formData.selectedPlan === tipo
                  ? 'border-petBlue bg-petBlue/5'
                  : 'border-gray-200 hover:border-petBlue/50'
              }`}
              onClick={() => handleInputChange('selectedPlan', tipo)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{texto}</p>
                  <p className="text-sm text-petGray">{tipo === 'basico' ? 'Plano temporário' : 'Para sempre'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-petPurple font-bold">{preco}</span>
                  {formData.selectedPlan === tipo && (
                    <div className="w-6 h-6 bg-petBlue rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Criar Página */}
        <div className="pt-4">
          <Button
            className={`w-full bg-gradient-to-r from-petPurple to-petBlue hover:from-petPurple/90 hover:to-petBlue/90 text-white rounded-xl py-3 font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
              isButtonEnabled && !loading ? '' : 'opacity-30 cursor-not-allowed'
            }`}
            onClick={e => {
              e.preventDefault();
              if (isButtonEnabled && !loading) {
                setMostrarModal(true);
              }
            }}
            disabled={!isButtonEnabled || loading}
          >
            {loading ? (
              <>
                <svg
                  className="h-7 w-7 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" />
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 12a8 8 0 0116 0"
                  />
                </svg>
                <span>Criando sua PetPage...</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4" />
                <span>Criar Página</span>
              </>
            )}
          </Button>

          <ModalDadosObrigatorios
            aberto={mostrarModal}
            aoFechar={() => setMostrarModal(false)}
            aoConfirmar={aoConfirmarModal}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Formulary;
