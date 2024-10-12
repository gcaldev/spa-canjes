// components/OptionsList.tsx
import { useEffect, useState } from 'react';

interface Option {
  categoria_id: number;
  categ_desc: string;
}

interface OptionsListProps {
  onCategoryChange: (categoriaId: number) => void;  // Prop para manejar el cambio de categoría
}

const OptionsList: React.FC<OptionsListProps> = ({ onCategoryChange }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Usamos useEffect para llamar al API del backend cuando el componente se monte
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('http://localhost:3000/canjes/categorias'); // Cambia esta URL al API de tu backend
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const categoriaId = parseInt(event.target.value, 10); // Obtener el ID de la categoría
    setSelectedOption(categoriaId);
    onCategoryChange(categoriaId); // Llamar a la función que se pasó como prop
  };

  return (
    <div>
      <h2>Selecciona una opción</h2>
      <form>
        {options.map((option) => (
          <div key={option.categoria_id}>
            <label>
              <input
                type="radio"
                name="option"
                value={option.categoria_id}
                checked={selectedOption === option.categoria_id}
                onChange={handleOptionChange}
              />
              {option.categ_desc}
            </label>
          </div>
        ))}
      </form>
    </div>
  );
};

export default OptionsList;
