"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import '../app.css';
import { Grid, GridItem, Box, Input, Button, Text, Spinner, Image } from "@chakra-ui/react";
import OptionsList from './OptionsList';
import Logout from './Logout';
import MyModal from '../componentes/MyModal';
import { useRouter } from 'next/navigation';

function CanjesPage() {
  const router = useRouter(); // Inicializar router
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filterDataResult, setFilterDataResult] = useState({
    data: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
  });

  useEffect(() => {
    fetchData("", null, 1);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchData(search, selectedCategory, 1);
  };

  const handleCategoryChange = (categoriaId: number) => {
    setSelectedCategory(categoriaId);
    fetchData(search, categoriaId, 1);
  };

  const fetchData = async (query: string, categoriaId: number | null, page: number) => {
    setFilterDataResult((prevState) => ({
      ...prevState,
      data: [],
      loading: true,
      error: null,
    }));

    try {
      const url = `http://localhost:3000/canjes/buscar?criterio=${query}&categoriaId=${categoriaId || ""}&page=${page}`;
      const response = await axios.get(url);
      
      setFilterDataResult({
        data: response.data.canjes || [],
        loading: false,
        error: null,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1,
      });
    } catch (error) {
      setFilterDataResult((prevState) => ({
        ...prevState,
        loading: false,
        error: error as any,
      }));
    }
  };

  const handleNextPage = () => {
    if (filterDataResult.currentPage < filterDataResult.totalPages) {
      fetchData(search, selectedCategory, filterDataResult.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (filterDataResult.currentPage > 1) {
      fetchData(search, selectedCategory, filterDataResult.currentPage - 1);
    }
  };

  const data = filterDataResult.data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Box padding="1rem" bg="gray.100" minHeight="100vh">  {/* Fondo gris claro */}
      <Box display="flex" justifyContent="space-between" marginBottom="1rem">
        <MyModal />
        <Logout />
      </Box>
  
      <Grid templateColumns="1fr 3fr" gap={4}>
        {/* Categorías a la izquierda */}
        <Box>
          <OptionsList onCategoryChange={handleCategoryChange} />
        </Box>
  
        {/* Sección de búsqueda y resultados */}
        <Box>
          <form onSubmit={handleSubmit}>
            <Box display="flex" alignItems="center" marginBottom="1rem"> {/* Elementos en línea */}
              <Input
                placeholder="Ingrese su busqueda..."
                onChange={handleInputChange}
                value={search}
                width="50%"            /* Input más corto, al 50% */
                marginRight="1rem"      /* Espacio entre el input y el botón */
              />
              <Button type="submit">Buscar</Button>
            </Box>
          </form>
  
          <Box marginTop="2rem">
            {/* Mensajes de carga o error */}
            {filterDataResult.loading && <Spinner />}
            {filterDataResult.error && <Text color="red">Error al buscar canjes...</Text>}
  
            {/* Grilla de canjes */}
            {data.length > 0 ? (
              <>
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                  {data.map((item: any) => (
                    <GridItem
                      key={item.canje_id}
                      bg="white"                   
                      borderWidth="1px"
                      borderRadius="lg"
                      padding="1rem"
                      boxShadow="md"
                      onClick={() => router.push(`/canjes/publicacion/${item.canje_id}`)}              
                    >
                      <Image
                          src={`http://localhost:3000/canjes/${item.canje_id}/images`}
                          alt={item.titulo}
                          cursor={"pointer"}
                          boxSize="100px"
                          objectFit="cover"
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = '/images/estandar.jpg';
                      }}
                    />
                      
                      <Text fontWeight="bold">{item.canje_desc}</Text>
                      <Text>{formatDate(item.fecha_creado)}</Text>
                      <Text>{item.tipo_desc}</Text>
                    </GridItem>
                  ))}
                </Grid>
  
                {/* Paginación */}
                {filterDataResult.totalPages > 1 && (
                  <Box display="flex" justifyContent="space-between" marginTop="2rem">
                    <Button
                      onClick={handlePrevPage}
                      isDisabled={filterDataResult.currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Text>
                      Página {filterDataResult.currentPage} de {filterDataResult.totalPages}
                    </Text>
                    <Button
                      onClick={handleNextPage}
                      isDisabled={filterDataResult.currentPage === filterDataResult.totalPages}
                    >
                      Siguiente
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Text>No hay canjes disponibles.</Text> // Mensaje si no hay canjes
            )}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}

export default CanjesPage;
