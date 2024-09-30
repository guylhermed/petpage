"use client"; // Adicione esta linha no topo

import React, { useState } from 'react';
import Formulario from '../components/formulario.js';
import Preview from '../components/preview.js';
import "../styles/globals.css";

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: ''
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h1 className="text-4xl font-bold mb-4">EternizaPet</h1>
            <p className="text-lg mb-8">
              Crie uma página personalizada para o seu pet e eternize momentos especiais!
            </p>
            <Formulario formData={formData} setFormData={setFormData} />
          </div>
          <div className="col-span-1">
            <Preview formData={formData} />
          </div>
        </div>
        <footer className="mt-8 text-center">
          <p className="text-gray-600">© 2024 EternizaPet. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
