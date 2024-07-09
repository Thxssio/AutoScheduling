import { useState } from 'react';

const Home = () => {
  const [formData, setFormData] = useState({
    matricula: '',
    senha: '',
    meals: {
      monday: { breakfast: false, lunch: false, dinner: false },
      tuesday: { breakfast: false, lunch: false, dinner: false },
      wednesday: { breakfast: false, lunch: false, dinner: false },
      thursday: { breakfast: false, lunch: false, dinner: false },
      friday: { breakfast: false, lunch: false, dinner: false },
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meal Scheduler</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="matricula" className="block text-sm font-medium text-gray-700">
            Matricula:
          </label>
          <input
            type="text"
            id="matricula"
            name="matricula"
            value={formData.matricula}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            Senha:
          </label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Meals Preferences</h3>
          {Object.keys(formData.meals).map((day) => (
            <div key={day} className="mt-4">
              <h4 className="text-md font-semibold">{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={formData.meals[day].breakfast}
                  onChange={() => handleCheckboxChange(day, 'breakfast')}
                  className="form-checkbox"
                />
                <span className="ml-2">Breakfast</span>
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={formData.meals[day].lunch}
                  onChange={() => handleCheckboxChange(day, 'lunch')}
                  className="form-checkbox"
                />
                <span className="ml-2">Lunch</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.meals[day].dinner}
                  onChange={() => handleCheckboxChange(day, 'dinner')}
                  className="form-checkbox"
                />
                <span className="ml-2">Dinner</span>
              </label>
            </div>
          ))}
        </div>
        <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Home;
