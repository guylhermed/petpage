'use client';

import React, { useState } from 'react';
import Formulario from '../app/components/Formulario';
import Preview from '../app/components/Preview';
import '../app/styles/globals.css';

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    adoptionDate: '',
    message: '',
    nicknames: [],
    images: [],
  });

  return (
    <div className="flex items-center justify-center h-screen mt-8 mx-7">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full items-center">
        <div className="mx-auto col-span-1 flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4 text-primaryGreen">Pet Page</h1>
          <p className="text-lg mb-4 text-primaryGreen">
            Crie uma página personalizada para o seu pet e eternize momentos especiais!
          </p>
          <Formulario formData={formData} setFormData={setFormData} />
        </div>
        <div className="col-span-1 flex justify-center">
          <Preview formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
