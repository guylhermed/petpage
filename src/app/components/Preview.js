"use client"; 

import React from 'react';

const Preview = ({ formData }) => {
  return (
    <div className="bg-gray-100 p-6 rounded shadow-md w-full">
      <h2 className="text-2xl font-bold mb-4">Preview</h2>
      <p className="text-lg mb-2">Nome do Pet: {formData.name || 'Nome não informado'}</p>
      <p className="text-lg mb-2">Data de Nascimento: {formData.date || 'Data não informada'}</p>
    </div>
  );
};

export default Preview;
