"use client";

import axios from "axios";
import React, { useState } from "react";

function Form() {
  return (
    <form>
      <input placeholder="Buscar" />
      <button type="submit">Lupa</button>
    </form>
  );
}

export default function CanjesPage() {
  const [search, setSearch] = useState("");
  const [filterDataResult, setFilterDataResult] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const handleInputChange = (e: any) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSearch("");
    await fetchData(search);
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchData = async (query: string) => {
    setFilterDataResult({
      data: null,
      loading: true,
      error: null,
    });
    try {
      await delay(5000);
      const response = await axios.get(
        "https://my-json-server.typicode.com/squad-7-psa-2023-2c/server-squad-7/tickets",
        {
          params: {
            fecha_de_creacion: query,
          },
        }
      );

      setFilterDataResult({
        data: response.data,
        loading: false,
        error: null,
      });

      return response;
    } catch (error) {
      setFilterDataResult({
        data: null,
        loading: false,
        error: error as any,
      });
    }
  };

  const data = filterDataResult.data as any;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "1rem",
      }}
    >
      <aside>
        <h1>Categorias</h1>
        <ul>
          <li>Tecnologia</li>
          <li>Moda</li>
        </ul>
      </aside>
      <section>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Buscar"
            onChange={handleInputChange}
            value={search}
          />
          <button type="submit">Lupa</button>
        </form>
        <div>
          {filterDataResult.loading && <p>Cargando...</p>}
          {filterDataResult.error && <p>Error...</p>}
          {data && (
            <ul>
              {data.map((item: any) => (
                <li key={item.id_ticket}>
                  <div>
                    <h1>{item.nombre}</h1>
                    <h2>{item.descripcion}</h2>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
