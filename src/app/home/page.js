'use client';

import React, { useRef, useState } from 'react';
import Formulario from '../components/Formulario';
import Preview from '../components/Preview';
import { Link } from 'react-scroll';

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    adoptionDate: '',
    message: '',
    nicknames: [],
    images: [],
    selectedPlan: '',
  });

  // Criando a referência para a última seção
  const lastSectionRef = useRef(null);

  // Função para rolar até a última seção
  const scrollToLastSection = () => {
    if (lastSectionRef.current) {
      lastSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-2">
      {/* Primeira seção */}
      <section className="flex flex-col items-center min-h-[50vh] text-center w-full md:pt-48 pt-28 md:mb-32 mb-14">
        <p className="text-lg text-gray-600 md:mb-8 mb-4">SOMOS A PETPAGE</p>
        <h1 className="md:text-8xl text-3xl font-medium text-primaryGreen mb-4 md:mb-9 mx-1 md:mx-80">
          Eternizando momentos
          <br />e revivendo memórias!
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12 md:mb-14 mx-3">
          Crie uma página personalizada para o seu pet e eternize momentos especiais!
        </p>
        <div className="flex gap-4">
          <Link to="last-section" smooth={true} duration={1000}>
            <button className="md:min-w-52 border border-primaryGreen text-primaryGreen px-12 py-3 rounded-full text-lg hover:bg-primaryGreen hover:text-gray-600 transition">
              Eternizar
            </button>
          </Link>
          <button className="md:min-w-52 border border-primaryGreen text-primaryGreen px-12 py-3 rounded-full text-lg hover:bg-primaryGreen hover:text-gray-600 transition">
            Reviver
          </button>
        </div>
      </section>

      {/* Segunda seção */}
      <section className="flex flex-col md:flex-row justify-center w-full mb-10 px-4 items-end">
        <div className="w-full md:w-[47rem] flex flex-col mb-9 md:mb-0">
          <p className="md:text-5xl text-3xl font-medium text-primaryGreen mb-5 text-center md:text-left">
            Minha PetPage
          </p>
          <p className="text-sm text-gray-600 mb-5 font-light text-center md:text-left md:mr-5 mr-0">
            Após o pagamento você será redirecionado para a página criada e receberá no seu email um qr code e o link
            para compartilhar com quem você quiser as memórias criadas.
          </p>
          <Formulario formData={formData} setFormData={setFormData} />
        </div>
        <div className="w-full md:w-96 flex">
          <Preview formData={formData} />
        </div>
      </section>

      <section
        id="last-section"
        className="flex flex-col items-center min-h-[50vh] text-center w-full md:pt-20 pt-4 px-4 mb-24"
      >
        <p className="md:text-5xl text-3xl font-medium text-primaryGreen mb-5">Quero Eternizar! Como faço?</p>
        <p className="text-base text-gray-600 mb-1 ">
          1 - Preencha os dados adicionando datas, mensagens e fotos marcantes.
        </p>
        <p className="text-base text-gray-600 mb-1 ">2 - Observe no preview como ficará a página do seu pet.</p>
        <p className="text-base text-gray-600 mb-1 ">3 - Selecione o plano desejado.</p>
        <p className="text-base text-gray-600 mb-14 ">4 - Crie a página para eternizar as memórias com seu pet.</p>
        <p className="text-lg md:text-xl text-gray-600 mx-3">
          Você receberá no seu email um qr code e o link para acessar e compartilhar com quem você quiser a sua página.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
