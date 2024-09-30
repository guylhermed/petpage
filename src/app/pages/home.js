"use client"; // Adicione esta linha no topo

import React, { useState } from 'react';
import Formulario from '../components/Formulario.js';
import Preview from '../components/Preview.js';
import "../styles/globals.css";

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: ''
  });

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
          <div className="col-span-1 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">EternizaPet</h1>
            <p className="text-lg mb-2">
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
