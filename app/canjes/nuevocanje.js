import React, { useState } from 'react';

const NuevoCanje = () => {
  const [responseMessage, setResponseMessage] = useState('');

  const callApi = async () => {
    try {
      const res = await fetch('/canjes/nuevo'); // Llamada a la API en el backend
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await res.json();
      setResponseMessage(data.message);
    } catch (error) {
      console.error('Error fetching API:', error);
      setResponseMessage('Error fetching API');
    }
  };

  return (
    <div>
      <button onClick={callApi}>Click me to call API</button>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default NuevoCanje;
