"use client";
import React, { useState, useEffect } from 'react';
import Switch from './Switch.js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Formulario = ({ formData, setFormData }) => {
    const [birthDateEnabled, setBirthDateEnabled] = useState(false);
    const [adoptionDateEnabled, setAdoptionDateEnabled] = useState(false);
    const [nicknames, setNicknames] = useState([]);
    const [nickname, setNickname] = useState("");
    const [images, setImages] = useState([]);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    // Valida se o botão deve ser habilitado
    useEffect(() => {
        const isNameFilled = formData.name.trim() !== "";
        const isDateFilled = (birthDateEnabled && formData.birthDate) || (adoptionDateEnabled && formData.adoptionDate);
        const isMessageFilled = formData.message && formData.message.trim() !== "";
        const isImageUploaded = images.length > 0;

        setIsButtonEnabled(isNameFilled && (isDateFilled || isMessageFilled) && isImageUploaded);
    }, [formData, birthDateEnabled, adoptionDateEnabled, images]);

    const handleAddNickname = () => {
        if (nickname.trim() !== "") {
            const newNicknames = [...nicknames, nickname];
            setNicknames(newNicknames);
            setFormData({ ...formData, nicknames: newNicknames });
            setNickname("");
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length <= 5) {
            const newImages = [...images, ...files];
            setImages(newImages);
            setFormData({ ...formData, images: newImages });
        } else {
            alert("Você pode selecionar até 5 imagens.");
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        setFormData({ ...formData, images: newImages });
    };

    const createCheckoutSession = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nomePet: formData.name }),
            });
            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('Erro ao criar a sessão de checkout:', data);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    return (
        <div>
            <form className="bg-gray-900 p-6 rounded shadow-md w-full">
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
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* Switches para Data de Nascimento e Data de Adoção */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <label className="block text-sm font-medium leading-6 text-white mr-4">
                            Data de Nascimento
                        </label>
                        <Switch enabled={birthDateEnabled} setEnabled={setBirthDateEnabled} />
                    </div>
                    <div className="flex items-center">
                        <label className="block text-sm font-medium leading-6 text-white mr-4">
                            Data de Adoção
                        </label>
                        <Switch enabled={adoptionDateEnabled} setEnabled={setAdoptionDateEnabled} />
                    </div>
                </div>

                {/* Inputs para Data de Nascimento e Data de Adoção */}
                {birthDateEnabled && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium leading-6 text-white mb-1">
                            Nascimento
                        </label>
                        <input
                            type="date"
                            className={`block w-full rounded-md border-0 bg-white py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        />
                    </div>
                )}

                {adoptionDateEnabled && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium leading-6 text-white mb-1">
                            Adoção
                        </label>
                        <input
                            type="date"
                            className={`block w-full rounded-md border-0 bg-white py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                            value={formData.adoptionDate}
                            onChange={(e) => setFormData({ ...formData, adoptionDate: e.target.value })}
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
                        onChange={(e) => setNickname(e.target.value)}
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
                            <div
                                key={index}
                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 mb-2 flex items-center"
                            >
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
                    <label className="block text-sm font-medium leading-6 text-white">
                        Adicionar Fotos
                    </label>
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
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                </div>

                {/* Botão de Submissão */}
                <button
                    className={`bg-primaryGreen text-white px-6 py-3 rounded mt-4 w-full text-lg ${isButtonEnabled ? '' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={(e) => {
                        e.preventDefault(); // Previne o recarregamento da página
                        if (isButtonEnabled) {
                            createCheckoutSession(); // Chama a função para criar a sessão de checkout
                        }
                    }}
                    disabled={!isButtonEnabled}
                >
                    Criar Página
                </button>
            </form>
        </div>
    );
};

export default Formulario;
