"use client";

import { useState } from 'react';
import { FaRegUser, FaLock, FaCalendarAlt } from 'react-icons/fa';

export default function Home() {
  const [formData, setFormData] = useState({
    email: '',
    matricula: '',
    senha: '',
    meals: {
      monday: { ru: '1', breakfast: false, lunch: false, dinner: false },
      tuesday: { ru: '1', breakfast: false, lunch: false, dinner: false },
      wednesday: { ru: '1', breakfast: false, lunch: false, dinner: false },
      thursday: { ru: '1', breakfast: false, lunch: false, dinner: false },
      friday: { ru: '1', breakfast: false, lunch: false, dinner: false },
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (day: string, meal: string) => {
    setFormData((prevData) => ({
      ...prevData,
      meals: {
        ...prevData.meals,
        [day]: {
          ...prevData.meals[day],
          [meal]: !prevData.meals[day][meal],
        },
      },
    }));
  };

  const handleRUChange = (day: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      meals: {
        ...prevData.meals,
        [day]: {
          ...prevData.meals[day],
          ru: value,
        },
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  const dayLabels = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-800">Agendamento de Refeições</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <input type="email" id="email" name="email" placeholder="Email de contato" value={formData.email} onChange={handleInputChange} required className="col-span-3 p-2 border border-gray-300 rounded-md"/>
            <input type="text" id="matricula" name="matricula" placeholder="Matrícula do portal" value={formData.matricula} onChange={handleInputChange} required className="col-span-3 p-2 border border-gray-300 rounded-md"/>
            <input type="password" id="senha" name="senha" placeholder="Senha do portal" value={formData.senha} onChange={handleInputChange} required className="col-span-3 p-2 border border-gray-300 rounded-md"/>
            {Object.keys(formData.meals).map((day) => (
              <div key={day} className="col-span-1 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">{dayLabels[day]}</h3>
                <div className="flex items-center mb-3">
                  <label className="flex items-center mr-4">
                    <input type="radio" name={`${day}_ru`} value="1" checked={formData.meals[day].ru === '1'} onChange={(e) => handleRUChange(day, e.target.value)} className="mr-2 form-radio text-blue-600"/>
                    RU 1
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name={`${day}_ru`} value="2" checked={formData.meals[day].ru === '2'} onChange={(e) => handleRUChange(day, e.target.value)} className="mr-2 form-radio text-blue-600"/>
                    RU 2
                  </label>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="flex items-center">
                    <input type="checkbox" checked={formData.meals[day].breakfast} onChange={() => handleCheckboxChange(day, 'breakfast')} disabled={formData.meals[day].ru === '2'} className="mr-2 form-checkbox text-blue-600"/>
                    Café da Manhã
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={formData.meals[day].lunch} onChange={() => handleCheckboxChange(day, 'lunch')} className="mr-2 form-checkbox text-blue-600"/>
                    Almoço
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={formData.meals[day].dinner} onChange={() => handleCheckboxChange(day, 'dinner')} disabled={formData.meals[day].ru === '2'} className="mr-2 form-checkbox text-blue-600"/>
                    Jantar
                  </label>
                </div>
              </div>
            ))}
          </div>
          <button type="submit" className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
