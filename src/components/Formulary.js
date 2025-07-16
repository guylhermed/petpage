'use client';
import React, { useState, useEffect } from 'react';
import { firebaseConfigSelector } from '@/app/config/firebaseConfigSelector';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { baseUrl } from '@/app/utils/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Heart, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { formatarCpfCnpj, formatarTelefone } from '@/app/utils/formatadores';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const { db, storage } = firebaseConfigSelector();

const Formulary = ({ formData, setFormData }) => {
  const router = useRouter();
  const [birthDateEnabled, setBirthDateEnabled] = useState(formData.mostrarDataNascimento);
  const [adoptionDateEnabled, setAdoptionDateEnabled] = useState(formData.mostrarDataAdocao);
  const [images, setImages] = useState([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apelidoString, setApelidoString] = useState('');
  const [mostrarSecaoPagamento, setMostrarSecaoPagamento] = useState(false);
  const [dadosPagamento, setDadosPagamento] = useState({ nome: '', cpfCnpj: '', telefone: '', email: '' });
  const [alertaAberto, setAlertaAberto] = useState(false);

  const { resolvedTheme } = useTheme();

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
    if (!birthDateEnabled) setFormData(prev => ({ ...prev, birthDate: '' }));
  }, [birthDateEnabled]);

  useEffect(() => {
    if (!adoptionDateEnabled) setFormData(prev => ({ ...prev, adoptionDate: '' }));
  }, [adoptionDateEnabled]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, mostrarDataNascimento: birthDateEnabled }));
  }, [birthDateEnabled]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, mostrarDataAdocao: adoptionDateEnabled }));
  }, [adoptionDateEnabled]);

  const criarCobrancaAbacatepay = async cliente => {
    const petId = uuidv4();
    const nomePet = formData.name || 'Pet Sem Nome';
    const uniqueSlug = `${nomePet.replace(/\s+/g, '-').toLowerCase()}-${petId.slice(0, 8)}`;
    const email = cliente.email || 'teste@teste.com';

    setLoading(true);

    try {
      const imageUrls = await Promise.all(
        images.map(async (image, index) => {
          const imageRef = ref(storage, `pets/${uniqueSlug}/${uniqueSlug}-${index + 1}.${image.name.split('.').pop()}`);
          await uploadBytes(imageRef, image);
          return await getDownloadURL(imageRef);
        })
      );

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

      if (!response.ok) {
        console.error('Falha ao criar cobrança AbacatePay.');
        return;
      }

      const data = await response.json();

      if (data?.url) {
        try {
          // Primeiro tenta via router.push
          router.push(data.url);
        } catch (e) {
          // Se falhar, tenta forçar via window.location.href
          window.location.href = data.url;
        }
      } else {
        console.error('Resposta sem URL da AbacatePay:', data);
      }
    } catch (error) {
      console.error('Erro na cobrança:', error);
    } finally {
      setLoading(false);
    }
  };

  const enviarFormularioPagamento = async () => {
    const { nome, cpfCnpj, telefone, email } = dadosPagamento;

    if (!nome || !cpfCnpj || !telefone || !email) {
      setAlertaAberto(true);
      return;
    }

    await criarCobrancaAbacatepay(dadosPagamento);
  };

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
    <>
      <Card
        className={`w-full max-w-lg shadow-lg border-0 backdrop-blur-sm ${
          resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-white/80'
        }`}
      >
        <CardHeader className="bg-gradient-to-r from-petPurple to-petBlue text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Heart className="w-5 h-5 animate-bounce-gentle" />
            Preencha o formulário e visualize no preview
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Nome do Pet */}
          <div className="space-y-2">
            <Label htmlFor="nome-pet" className="font-medium text-petPurple">
              Nome do Pet
            </Label>
            <Input
              id="nome-pet"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="Ex: Thor"
            />
          </div>

          {/* Datas */}
          <div className="space-y-3">
            <div
              className={`flex items-center justify-between p-3 rounded-xl ${
                resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            >
              <div>
                <Label className="font-medium text-petPurple">Incluir Data de Nascimento</Label>
                <p className="text-sm text-muted-foreground">Aparecerá na página</p>
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

            <div
              className={`flex items-center justify-between p-3 rounded-xl ${
                resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            >
              <div>
                <Label className="font-medium text-petPurple">Incluir Data de Adoção</Label>
                <p className="text-sm text-muted-foreground">Quando o pet chegou até você</p>
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

          {/* Apelidos */}
          <div className="space-y-2">
            <Label htmlFor="apelidos" className="font-medium text-petPurple">
              Apelidos
            </Label>
            <p className="text-xs text-muted-foreground">Separe os apelidos com vírgulas (,)</p>
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
          <div className="space-y-3 pb-8">
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
                    <p className="font-semibold text-foreground">{texto}</p>
                    <p className="text-sm text-muted-foreground">
                      {tipo === 'basico' ? 'Plano temporário' : 'Para sempre'}
                    </p>
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

          {mostrarSecaoPagamento && (
            <div className="border-t pt-6 space-y-6">
              <div className="space-y-1 text-center">
                <h3 className="text-lg font-semibold text-petPurple">Dados para gerar pagamento</h3>
                <p className="text-sm text-muted-foreground">
                  Preencha suas informações abaixo. Ao clicar em <strong>“Prosseguir para pagamento”</strong>, aguarde o
                  redirecionamento automático.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="font-medium text-petPurple">Nome</Label>
                <Input
                  value={dadosPagamento.nome}
                  onChange={e => setDadosPagamento({ ...dadosPagamento, nome: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-medium text-petPurple">CPF ou CNPJ</Label>
                <Input
                  value={dadosPagamento.cpfCnpj}
                  onChange={e => setDadosPagamento({ ...dadosPagamento, cpfCnpj: formatarCpfCnpj(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-medium text-petPurple">Telefone</Label>
                <Input
                  value={dadosPagamento.telefone}
                  onChange={e => setDadosPagamento({ ...dadosPagamento, telefone: formatarTelefone(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-medium text-petPurple">Email</Label>
                <Input
                  type="email"
                  value={dadosPagamento.email}
                  onChange={e => setDadosPagamento({ ...dadosPagamento, email: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Botão Criar Página */}
          <Button
            className={`w-full bg-gradient-to-r from-petPurple to-petBlue text-white rounded-xl py-3 font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${isButtonEnabled && !loading ? '' : 'opacity-30 cursor-not-allowed'}`}
            onClick={async e => {
              e.preventDefault();
              if (!isButtonEnabled || loading) return;
              if (!mostrarSecaoPagamento) {
                setMostrarSecaoPagamento(true);
              } else {
                await enviarFormularioPagamento();
              }
            }}
            disabled={!isButtonEnabled || loading}
          >
            {loading ? 'Criando sua PetPage...' : mostrarSecaoPagamento ? 'Prosseguir para pagamento' : 'Criar Página'}
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={alertaAberto} onOpenChange={setAlertaAberto}>
        <AlertDialogContent className="bg-white dark:bg-gray-950 border border-petPurple/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-petPurple text-base font-semibold">
              ⚠️ Campos obrigatórios
            </AlertDialogTitle>
            <p className="text-sm text-muted-foreground">Por favor, preencha todos os campos antes de continuar.</p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setAlertaAberto(false)}
              className="bg-petPurple hover:bg-petBlue text-white"
            >
              Fechar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Formulary;
