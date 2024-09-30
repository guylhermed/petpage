"use client"; 
import React from 'react';

const Formulario = ({ formData, setFormData }) => {
  return (
    <form className="bg-white p-6 rounded shadow-md w-full">
      <input
        type="text"
        placeholder="Nome do Pet"
        className="border p-2 mb-4 w-full"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="date"
        className="border p-2 mb-4 w-full"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Criar Página
      </button>
    </form>
  );
};

export default Formulario;
