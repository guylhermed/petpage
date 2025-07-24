'use client';

import React, { useEffect, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useTheme } from 'next-themes';
import Formulary from '@/components/Formulary';
import Preview from '@/components/Preview';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { baseUrl } from '@/app/utils/utils';
import LandingFooter from '@/components/landing/LandingFooter';
import { firebaseConfigSelector } from '@/app/config/firebaseConfigSelector';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import LandingHeader from '@/components/landing/LandingHeader';

const { db, storage } = firebaseConfigSelector();

export default function CriarPagina() {
  const [petData, setPetData] = useState({
    petName: '',
    adoptionDate: '2020-01-01',
    birthDate: '2020-01-01',
    nicknames: '',
    message: '',
    photo: null,
    galleryPhotos: [],
    isPublic: true,
    mostrarDataNascimento: false,
    mostrarDataAdocao: false,
    selectedPlan: '',
    images: [],
  });
  const [dadosPagamento, setDadosPagamento] = useState({ nome: '', cpfCnpj: '', telefone: '', email: '' });
  const [mostrarSecaoPagamento, setMostrarSecaoPagamento] = useState(false);
  const [alertaAberto, setAlertaAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const validarFormularioPet = pet => {
      const isNomePreenchido = pet.petName?.trim() !== '';
      const isDataPreenchida =
        (pet.mostrarDataNascimento && pet.birthDate) || (pet.mostrarDataAdocao && pet.adoptionDate);
      const isMensagemPreenchida = pet.message?.trim() !== '';
      const isFotoPerfil = !!pet.photo;
      const isGaleriaOk = pet.galleryPhotos.length > 0;
      const isPlanoSelecionado = pet.selectedPlan !== '';

      return (
        isNomePreenchido &&
        (isDataPreenchida || isMensagemPreenchida) &&
        isFotoPerfil &&
        isGaleriaOk &&
        isPlanoSelecionado
      );
    };

    setIsButtonEnabled(validarFormularioPet(petData));
  }, [petData]);

  const validarEmail = email => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarDadosPagamento = dados =>
    dados.nome?.trim() && dados.cpfCnpj?.trim() && dados.telefone?.trim() && validarEmail(dados.email);

  const base64ParaFile = (base64, nome) => {
    const [meta, conteudo] = base64.split(',');
    const mime = meta.match(/:(.*?);/)[1];
    const ext = mime.split('/')[1];
    const byteString = atob(conteudo);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new File([arrayBuffer], `${nome}.${ext}`, { type: mime });
  };

  const gerarCobrancaAbacate = async (dadosPet, cliente) => {
    const petId = uuidv4();
    const nomePet = dadosPet.petName || 'pet';
    const uniqueSlug = `${nomePet.replace(/\s+/g, '-').toLowerCase()}-${petId.slice(0, 8)}`;
    const email = cliente.email || 'cliente@exemplo.com';

    try {
      const imagensConvertidas = [];

      if (dadosPet.photo) {
        imagensConvertidas.push(base64ParaFile(dadosPet.photo, 'perfil'));
      }

      dadosPet.galleryPhotos?.forEach((foto, idx) => {
        imagensConvertidas.push(base64ParaFile(foto, `galeria-${idx + 1}`));
      });

      const imageUrls = await Promise.all(
        imagensConvertidas.map(async (image, index) => {
          const extensao = image.name.split('.').pop();
          const imageRef = ref(storage, `pets/${uniqueSlug}/${uniqueSlug}-${index + 1}.${extensao}`);
          await uploadBytes(imageRef, image);
          return await getDownloadURL(imageRef);
        })
      );

      const docData = {
        ...dadosPet,
        petName: dadosPet.petName,
        birthDate: dadosPet.mostrarDataNascimento ? dadosPet.birthDate : null,
        adoptionDate: dadosPet.mostrarDataAdocao ? dadosPet.adoptionDate : null,
        images: imageUrls,
        createdAt: new Date(),
        isPaid: false,
        paymentMethod: '',
        userEmail: email,
        petId,
        uniqueSlug,
        cellphone: cliente.telefone,
        taxId: cliente.cpfCnpj,
        clientName: cliente.nome,
      };

      delete docData.photo;
      delete docData.galleryPhotos;

      await setDoc(doc(db, 'pets', uniqueSlug), docData);

      if (!validarEmail(email)) {
        alert('Erro ao validar o e-mail. Verifique e tente novamente.');
        return null;
      }

      const body = {
        uniqueSlug,
        selectedPlan: dadosPet.selectedPlan,
        emailCliente: email,
        nomeCliente: cliente.nome,
        cellCliente: cliente.telefone,
        cpfCnpjCliente: cliente.cpfCnpj,
      };

      const response = await fetch(`${baseUrl}/api/create-cobranca-abacatepay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        alert('Erro ao gerar o link de pagamento. Tente novamente.');
        return null;
      }

      const data = await response.json();
      return data?.url ?? null;
    } catch (error) {
      alert('Erro inesperado. Tente novamente mais tarde.');
      return null;
    }
  };

  return (
    <div className={`min-h-screen ${resolvedTheme === 'dark' ? 'bg-background' : 'bg-white'}`}>
      <LandingHeader />

      {/* Conteúdo */}
      <main className="container mx-auto px-4 py-8 md:mb-20">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-petPurple to-petBlue bg-clip-text text-transparent mb-4 leading-relaxed">
            Crie a Página do Seu Pet
          </h2>
          <p className="text-petGray text-lg max-w-2xl mx-auto">
            Preencha as informações para gerar uma página linda, única e especial para compartilhar com a família e
            amigos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Formulário */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Fale sobre seu pet</h3>
              <p className="text-petGray dark:text-gray-300">
                As informações abaixo serão usadas para criar a página personalizada.
              </p>
            </div>
            <Formulary
              formData={petData}
              setFormData={setPetData}
              dadosPagamento={dadosPagamento}
              setDadosPagamento={setDadosPagamento}
              mostrarSecaoPagamento={mostrarSecaoPagamento}
              setMostrarSecaoPagamento={setMostrarSecaoPagamento}
            />
          </div>

          {/* Preview */}
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="mb-11">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Visualização em tempo real</h3>
              <p className="text-petGray dark:text-gray-300">
                Veja como sua página ficará antes de finalizar a criação.
              </p>
            </div>
            <div className="sticky top-24">
              <Preview formData={petData} />
            </div>
          </div>
        </div>
        {/* Botão fora do Formulary — redirecionamento 100% compatível */}
        <div className="max-w-6xl mx-auto xl:pr-9 mt-10">
          <Button
            className="w-full bg-gradient-to-r from-petPurple to-petBlue text-white rounded-xl py-9 text-xl font-bold"
            onClick={async () => {
              if (!isButtonEnabled || loading) return;

              if (!mostrarSecaoPagamento) {
                setMostrarSecaoPagamento(true);
                return;
              }

              if (!validarDadosPagamento(dadosPagamento)) {
                setAlertaAberto(true);
                return;
              }

              setLoading(true);

              const url = await gerarCobrancaAbacate(petData, dadosPagamento);

              setLoading(false);

              if (url) {
                window.location.assign(url);
              } else {
                alert('Erro ao gerar o link de pagamento. Tente novamente.');
              }
            }}
            disabled={!isButtonEnabled || loading}
          >
            {loading ? 'Criando sua PetPage...' : mostrarSecaoPagamento ? 'Prosseguir para pagamento' : 'Criar Página'}
          </Button>

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
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
