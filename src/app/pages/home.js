"use client";

import React, { useState } from 'react';
import Formulario from '../components/Formulario';
import Preview from '../components/Preview';
import "../styles/globals.css";

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    adoptionDate: '',
    message: '',
    nicknames: [],
    images: []
  });

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
          <div className="col-span-1 flex flex-col justify-center">
            <h1 className="text-5xl font-bold mb-4 text-primaryGreen">Pet Page</h1>
            <p className="text-lg mb-2 text-primaryGreen">
              Crie uma página personalizada para o seu pet e eternize momentos especiais!
            </p>
            <Formulario formData={formData} setFormData={setFormData} />
          </div>
          <div className="col-span-1 flex justify-center">
            <Preview formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
