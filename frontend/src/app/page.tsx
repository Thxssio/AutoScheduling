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
    e.target.setCustomValidity('');
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

  const handleInvalid = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.setCustomValidity('Por favor, preencha este campo.');
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
    <div className="flex items-center justify-center min-h-screen bg-blue-200 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl flex">
        <div className="w-1/4 bg-blue-800 text-white rounded-l-lg p-4 flex flex-col items-center justify-center space-y-8">
          <div className="flex flex-col items-center space-y-2">
            <FaRegUser size={30} />
            <span className="text-lg font-bold">1</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <FaLock size={30} />
            <span className="text-lg font-bold">2</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <FaCalendarAlt size={30} />
            <span className="text-lg font-bold">3</span>
          </div>
        </div>
        <div className="w-3/4 p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Agendamento de Refeições</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email de contato:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onInvalid={handleInvalid}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="matricula" className="block text-sm font-medium text-gray-700">
                Matrícula do portal:
              </label>
              <input
                type="text"
                id="matricula"
                name="matricula"
                value={formData.matricula}
                onChange={handleInputChange}
                onInvalid={handleInvalid}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha do portal:
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                onInvalid={handleInvalid}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Preferências de Refeições</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.keys(formData.meals).map((day) => (
                  <div key={day} className="mt-4">
                    <h4 className="text-md font-semibold">{dayLabels[day]}</h4>
                    <div className="mt-2 flex justify-between">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`${day}_ru`}
                          value="1"
                          checked={formData.meals[day].ru === '1'}
                          onChange={(e) => handleRUChange(day, e.target.value)}
                          className="form-radio"
                        />
                        <span className="ml-2">RU 1</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`${day}_ru`}
                          value="2"
                          checked={formData.meals[day].ru === '2'}
                          onChange={(e) => handleRUChange(day, e.target.value)}
                          className="form-radio"
                        />
                        <span className="ml-2">RU 2</span>
                      </label>
                    </div>
                    <div className="flex flex-col space-y-2 mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.meals[day].breakfast}
                          onChange={() => handleCheckboxChange(day, 'breakfast')}
                          disabled={formData.meals[day].ru === '2'}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Café da Manhã</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.meals[day].lunch}
                          onChange={() => handleCheckboxChange(day, 'lunch')}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Almoço</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.meals[day].dinner}
                          onChange={() => handleCheckboxChange(day, 'dinner')}
                          disabled={formData.meals[day].ru === '2'}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Jantar</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Enviar
            </button>
          </form> 
        </div>
      </div>
    </div>
  );
}
