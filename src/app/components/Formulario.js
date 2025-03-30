'use client';
import React, { useState, useEffect } from 'react';
import { firebaseConfigSelector } from '../config/firebaseConfigSelector'; // Selecionador do Firebase
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos
import Switch from './Switch.js';
import { useRouter } from 'next/navigation';

// Inicializa o Firebase com a configuração correta
const { db, storage } = firebaseConfigSelector();

const Formulario = ({ formData, setFormData }) => {
  const router = useRouter(); // Inicializa o useRouter
  const [birthDateEnabled, setBirthDateEnabled] = useState(false);
  const [adoptionDateEnabled, setAdoptionDateEnabled] = useState(false);
  const [nicknames, setNicknames] = useState([]);
  const [nickname, setNickname] = useState('');
  const [images, setImages] = useState([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de loading

  // Valida se o botão deve ser habilitado
  useEffect(() => {
    const isNameFilled = formData.name.trim() !== '';
    const isDateFilled = (birthDateEnabled && formData.birthDate) || (adoptionDateEnabled && formData.adoptionDate);
    const isMessageFilled = formData.message && formData.message.trim() !== '';
    const isImageUploaded = images.length > 0;
    const isPlanSelected = formData.selectedPlan !== '';

    setIsButtonEnabled(isNameFilled && (isDateFilled || isMessageFilled) && isImageUploaded && isPlanSelected);
  }, [formData, birthDateEnabled, adoptionDateEnabled, images]);

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

  const createCheckoutSession = async () => {
    const petId = uuidv4();
    const uniqueSlug = `${formData.name.replace(/\s+/g, '-').toLowerCase()}-${petId.slice(0, 8)}`;

    setLoading(true);

    try {
      // Carregar as imagens no Firebase Storage e coletar as URLs
      const imageUrls = await Promise.all(
        images.map(async (image, index) => {
          const imageRef = ref(storage, `pets/${uniqueSlug}/${uniqueSlug}-${index + 1}.${image.name.split('.').pop()}`);
          await uploadBytes(imageRef, image);
          return await getDownloadURL(imageRef);
        })
      );

      // Agora salve os dados no Firestore com as URLs das imagens
      await setDoc(doc(db, 'pets', uniqueSlug), {
        ...formData,
        images: imageUrls,
        createdAt: new Date(),
        isPaid: false, // Por padrão, o campo isPaid é false
        paymentMethod: '', // Por padrão, o campo paymentMethod é vazio
        userEmail: '', // Por padrão, o campo userEmail é vazio
        petId: petId,
        uniqueSlug: uniqueSlug,
      });

      console.log('Dados salvos no Firebase com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar no Firebase:', error);
      setLoading(false);
      return;
    }

    try {
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://www.minhapetpage.com' : 'http://localhost:3000';

      // Faz a chamada para a API de criação de sessão de checkout
      const response = await fetch(`${baseUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomePet: formData.name, // Passa o nome do pet
          uniqueSlug: uniqueSlug, // Passa o uniqueSlug
          selectedPlan: formData.selectedPlan, // Passa o plano selecionado
        }),
      });

      // Após a resposta da api, converte para JSON

      const data = await response.json();
      console.log('Resposta da sessão de checkout:', data);

      // Se a resposta contém a URL, redireciona para a URL do checkout
      if (data.url) {
        router.push(data.url); // Redireciona para a URL do checkout
      } else {
        console.error('Erro ao criar a sessão de checkout:', data);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false); // Finaliza o loading
    }
  };

  return (
    <div>
      <form className="bg-gray-900 p-6 rounded-lg shadow-lg md:w-[45rem] h-full">
        {/* Campos do formulário */}
        <div className="mb-4">
          <label htmlFor="nome-pet" className="block text-sm font-medium leading-6 text-white">
            Nome do Pet
          </label>
          <input
            id="nome-pet"
            type="text"
            placeholder="Ex: Stark"
            className="block w-full rounded-md border-0 bg-white py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Switches para Data de Nascimento e Data de Adoção */}
        <div className="mb-4 flex items-center justify-between gap-6 md:gap-0">
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-white mr-0 md:mr-4">Data de Nascimento</label>
            <Switch enabled={birthDateEnabled} setEnabled={setBirthDateEnabled} />
          </div>
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-white mr-0 md:mr-4">Data de Adoção</label>
            <Switch enabled={adoptionDateEnabled} setEnabled={setAdoptionDateEnabled} />
          </div>
        </div>

        {/* Inputs para Data de Nascimento e Data de Adoção */}
        {birthDateEnabled && (
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-white mb-1">Nascimento</label>
            <input
              type="date"
              className={`block w-full rounded-md border-0 bg-white py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
              value={formData.birthDate}
              onChange={e =>
                setFormData({
                  ...formData,
                  birthDate: e.target.value,
                })
              }
            />
          </div>
        )}

        {adoptionDateEnabled && (
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-white mb-1">Adoção</label>
            <input
              type="date"
              className={`block w-full rounded-md border-0 bg-white py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
              value={formData.adoptionDate}
              onChange={e =>
                setFormData({
                  ...formData,
                  adoptionDate: e.target.value,
                })
              }
            />
          </div>
        )}

        {/* Campo Apelidos */}
        <div className="mb-4">
          <label htmlFor="apelidos" className="block text-sm font-medium leading-6 text-white">
            Apelidos
          </label>
          <input
            id="apelidos"
            type="text"
            placeholder="Ex: Lindinho"
            className="block w-full rounded-md border-0 bg-white py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddNickname}
            className="bg-primaryGreen text-white px-4 py-2 rounded mt-2"
          >
            Adicionar Apelido
          </button>

          {/* Tags de Apelidos com botão de remoção */}
          <div className="mt-4 flex flex-wrap">
            {nicknames.map((nick, index) => (
              <div key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 mb-2 flex items-center">
                <span>{nick}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveNickname(index)}
                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload de Imagens */}
        <div className="mb-4">
          <label className="block text-sm font-medium leading-6 text-white">Adicionar Fotos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          />

          {/* Pré-visualização das Imagens */}
          <div className="mt-4 flex flex-wrap">
            {images.map((image, index) => (
              <div key={index} className="relative mr-2 mb-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Imagem ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 text-red-500 hover:text-red-700 focus:outline-none text-xl"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Campo Mensagem */}
        <div className="mb-4">
          <label htmlFor="mensagem" className="block text-sm font-medium leading-6 text-white">
            Mensagem
          </label>
          <textarea
            id="mensagem"
            rows="4"
            placeholder="Escreva algo especial sobre o seu pet ou sobre a sua relação com ele."
            className="block w-full rounded-md border-0 bg-white py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={formData.message}
            onChange={e =>
              setFormData({
                ...formData,
                message: e.target.value,
              })
            }
          />
        </div>

        {/* Plano Desejado */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-1">Plano Desejado</label>
          <div className="flex flex-col gap-2 md:flex-row justify-between">
            {/* Plano Básico (30 dias) */}
            <label className="md:w-1/2 relative group flex items-center gap-2 bg-gray-800 p-3 rounded-lg cursor-pointer border border-gray-700 hover:border-primaryGreen transition">
              <input
                type="radio"
                name="plano"
                value="basico"
                className="hidden"
                onChange={() => setFormData({ ...formData, selectedPlan: 'basico' })}
                checked={formData.selectedPlan === 'basico'}
              />
              <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center">
                {formData.selectedPlan === 'basico' && <div className="w-3 h-3 bg-primaryGreen rounded-full"></div>}
              </div>
              <span className="text-white text-sm">
                30 Dias - <span className="line-through text-gray-400">de R$14,90</span> por R$9,90
              </span>
              {/* Tooltip ao passar o mouse sobre o label */}
              <div className="absolute hidden group-hover:block bg-blue-800 text-white text-xs rounded-md px-2 py-1 w-48 bottom-full mb-1 shadow-lg left-1/2 transform -translate-x-1/2">
                Sua página ficará no ar por 30 dias, após isso será deletada.
              </div>
            </label>

            {/* Plano Vitalício */}
            <label className="md:w-1/2 relative group flex items-center gap-2 bg-gray-800 p-3 rounded-lg cursor-pointer border border-gray-700 hover:border-primaryGreen transition">
              <input
                type="radio"
                name="plano"
                value="vitalicio"
                className="hidden"
                onChange={() => setFormData({ ...formData, selectedPlan: 'vitalicio' })}
                checked={formData.selectedPlan === 'vitalicio'}
              />
              <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center">
                {formData.selectedPlan === 'vitalicio' && <div className="w-3 h-3 bg-primaryGreen rounded-full"></div>}
              </div>
              <span className="text-white text-sm">
                Vitalício - <span className="line-through text-gray-400">de R$39,90</span> por R$29,90
              </span>

              {/* Tooltip ao passar o mouse sobre o label */}
              <div className="absolute hidden group-hover:block bg-blue-800 text-white text-xs rounded-md px-2 py-1 w-48 bottom-full mb-1 shadow-lg left-1/2 transform -translate-x-1/2">
                Seu site permanecerá online para sempre.
              </div>
            </label>
          </div>
        </div>

        {/* Botão de Submissão */}
        <button
          className={`bg-primaryGreen text-white px-6 py-3 rounded mt-4 w-full text-lg flex items-center justify-center space-x-3 ${
            isButtonEnabled && !loading ? '' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={e => {
            e.preventDefault();
            if (isButtonEnabled && !loading) {
              setLoading(true); // Ativa o loading
              console.log('Botão habilitado, criando sessão de checkout...');
              createCheckoutSession();
            } else {
              console.log('Botão desabilitado.');
            }
          }}
          disabled={!isButtonEnabled || loading} // Desabilita se estiver carregando
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
            'Criar Página'
          )}
        </button>
      </form>
    </div>
  );
};

export default Formulario;
