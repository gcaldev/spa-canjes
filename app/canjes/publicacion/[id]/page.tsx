"use client"; // Asegúrate de que esto esté presente

import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Spinner,
  Image,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons"; // Importación de íconos

const CanjeDetail = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [canjeData, setCanjeData] = useState<any>(null);
  const [articulos, setArticulos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagenesArticulos, setImagenesArticulos] = useState<{ [key: number]: any[] }>({});
  const [imageIndices, setImageIndices] = useState<{ [key: number]: number }>({});
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [propuestaCanje, setPropuestaCanje] = useState(''); // Estado para la propuesta de canje
  const [canjes, setCanjes] = useState<any[]>([]); // Estado para los canjes disponibles
  const [selectedCanjeId, setSelectedCanjeId] = useState<number | null>(null); // Estado para el canje seleccionado
  const [inputText, setInputText] = useState('');
  const [propuestaExistente, setPropuestaExistente] = useState<boolean>(false);
  const [tituloPropuesta, setTituloPropuesta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [actualizar, setActualizar] = useState(false);
  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [mostrarTodasPreguntas, setMostrarTodasPreguntas] = useState(false);

  const userId = 2;  //valor hardcodeado para pasar luego usuario logueado

  useEffect(() => {
    const fetchCanjeData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/canjes/detalle/${id}`);
        const canjeData = await response.json();
        setCanjeData(canjeData[0]);

        const articulosResponse = await fetch(`http://localhost:3000/canjes/articulos/${id}`);
        const articulosData = await articulosResponse.json();
        const articulosActivos = articulosData.filter((articulo: any) => articulo.articulo_activo);
        setArticulos(articulosActivos);

        const imagenesPromises = articulosActivos.map(async (articulo: any) => {
          const imagenesResponse = await fetch(`http://localhost:3000/canjes/images/articulos/${articulo.articulo_id}`);
          return { articulo_id: articulo.articulo_id, imagenes: await imagenesResponse.json() };
        });

        const imagenes = await Promise.all(imagenesPromises);
        const imagenesMap = imagenes.reduce((acc, curr) => {
          acc[curr.articulo_id] = curr.imagenes;
          return acc;
        }, {} as { [key: number]: any[] });

        setImagenesArticulos(imagenesMap);
        setSelectedArticleId(articulosActivos[0]?.articulo_id);

        setImageIndices((prev) => {
          const newIndices: { [key: number]: number } = {};
          articulosActivos.forEach((articulo: any) => {
            newIndices[articulo.articulo_id] = 0;
          });
          return newIndices;
        });

        //verifica si el usuario logueado ya ha enviado propuesta
        const propuestaResponse = await fetch(`http://localhost:3000/canjes/propuesta/verifica?canje_id=${id}&user_id=${userId}`);
        const propuestaData = await propuestaResponse.json();
        setPropuestaExistente(propuestaData.propuestaEnviada);
        //console.log(propuestaData.titulo);

        if (propuestaData.propuestaEnviada) {
          // Asignamos el título de la primera propuesta
          setTituloPropuesta(propuestaData.propuestas[0]?.titulo || 'Sin título disponible');
        } else {
          setMensaje('No se ha enviado ninguna propuesta.');
        }

        
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    


    const fetchCanjes = async () => {
      try {
        //console.log(`http://localhost:3000/canjes/ofertar/${userId}`);
        const response = await fetch(`http://localhost:3000/canjes/ofertar/${userId}`); // Reemplaza userId con el valor adecuado
        const canjesData = await response.json();
        //console.log('Datos de canjes porongaaa:', canjesData); 
        setCanjes(canjesData);
      } catch (err) {
        setError((err as Error).message);
      }
    };


    const fetchPreguntas = async () => {
      try {
        const response = await fetch(`http://localhost:3000/canjes/preguntas/${id}`);
        const preguntasData = await response.json();
        setPreguntas(preguntasData);
        console.log(preguntasData.pregunta);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    
    fetchCanjeData();
    fetchCanjes(); // Obtener los canjes disponibles
    fetchPreguntas();
  }, [id, actualizar]);

  if (loading) return <Spinner />;
  if (error) return <Text color="red">Error: {error}</Text>;
  if (!canjeData) return <Text>No se encontraron datos.</Text>;

  const nextImage = () => {
    if (selectedArticleId) {
      setImageIndices((prev) => ({
        ...prev,
        [selectedArticleId]: (prev[selectedArticleId] + 1) % (imagenesArticulos[selectedArticleId]?.length || 1),
      }));
    }
  };

  
  const retirarPropuesta = async () => {
    try {
      const response = await fetch(`http://localhost:3000/canjes/propuesta/retirar?canje_id=${id}&user_id=${userId}`, {
        method: 'POST', // Asumiendo que es una petición POST
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Lógica para actualizar el estado y reflejar que la oferta fue retirada
        setPropuestaExistente(false);  // Volver a habilitar el botón de "Enviar Propuesta"
      } else {
        console.error('Error al retirar la oferta:', data.message);
      }
    } catch (error) {
      console.error('Error en la solicitud para retirar la oferta:', error);
    }
  };

  const prevImage = () => {
    if (selectedArticleId) {
      setImageIndices((prev) => ({
        ...prev,
        [selectedArticleId]: (prev[selectedArticleId] - 1 + (imagenesArticulos[selectedArticleId]?.length || 1)) % (imagenesArticulos[selectedArticleId]?.length || 1),
      }));
    }
  };

  const handleTabChange = (index: number) => {
    const articuloSeleccionado = articulos[index];
    setSelectedArticleId(articuloSeleccionado.articulo_id);
    setImageIndices((prev) => ({ ...prev, [articuloSeleccionado.articulo_id]: 0 }));
  };

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setPropuestaCanje(''); // Limpiar el estado de propuesta
    setSelectedCanjeId(null); // Limpiar el estado del canje seleccionado
    
  };

  // Función para enviar la propuesta de canje
  const handleSubmitPropuesta = async () => {
    if (!selectedCanjeId) {
      alert("Por favor, selecciona un canje antes de enviar la propuesta.");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/canjes/propuesta/agrega', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          canje_id: id, // ID del canje actual
          canje_id_prop: selectedCanjeId, // Canje propuesto seleccionado
          estado_propuesta: 1, // Estado de propuesta
          inputText: inputText,
          user_id: userId
        }),
      });
  
      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (response.ok) {
          setActualizar(prev => !prev);
          setPropuestaExistente(true); 
          setTituloPropuesta(inputText); // Actualiza el título con la propuesta enviada
          console.log('Propuesta enviada:', data);
          closeModal(); // Cerrar modal al finalizar
          
        } else {
          console.error('Error al enviar propuesta:', data);
        }
      } else {
        // Si no es JSON, imprimir el texto de la respuesta
        const text = await response.text();
        console.error('Respuesta no JSON:', text);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <Grid templateColumns="1fr 500px" gap={4} padding="1rem">
      {/* Cabecera del canje a la izquierda */}
      <Box>
        <Text fontWeight="bold" fontSize="2xl">{canjeData.titulo}</Text>
        <Text fontWeight="bold" fontSize="1x1">{canjeData.canje_desc}</Text>
        <Text>Categoria: {canjeData.categ_desc}</Text>

        <Box display="flex" alignItems="center">
          <Text>Publicado por: {canjeData.username}</Text>
          {/* Mostrar el ícono basado en el campo 'verificado' */}
          {canjeData.verificado ? (
            <CheckCircleIcon color="green.500" marginLeft="10px" />
          ) : (
            <WarningIcon color="red.500" marginLeft="10px" />
          )}
        </Box>

        <Text>Publicado el: {new Date(canjeData.fecha_pub).toLocaleDateString()}</Text>
        <Text>Tipo de Oferta: {canjeData.tipo_desc}</Text>
        <Text>Busco: {canjeData.art_canje}</Text>
        
        <Text fontWeight="bold" fontSize="xl" mb={4}>
  </Text>

  <Text fontWeight="bold" fontSize="xl" mb={4}>
    Preguntas realizadas ({preguntas.length})
  </Text>
      {preguntas.length > 0 ? (
        <Grid templateColumns="repeat(1, 1fr)" gap={4}>
          {preguntas.map((pregunta) => (
            <Box
              key={pregunta.mensaje_id}
              borderWidth="1px"
              borderRadius="lg"
              padding="4"
              background="gray.50"
            >
              <Text fontWeight="bold">{pregunta.pregunta}</Text>
              <Text>{pregunta.respuesta}</Text>
              <Text fontSize="sm" color="gray.500">
                {pregunta.fecha_preg}
              </Text>
            </Box>
          ))}
        </Grid>
      ) : (
        <Text>No se han realizado preguntas aún.</Text>
      )}


      </Box>

      {/* Tabs a la derecha con imágenes centradas */}
      <Box boxSize={500}>
        <Tabs
          variant="enclosed"
          onChange={(index) => handleTabChange(index)}
          size="1g"
          border="2px solid"
          borderColor="gray.300"
          borderRadius="md"
          p="3"
        >
          <TabList>
            {articulos.map((articulo) => (
              <Tab key={articulo.articulo_id}>{articulo.articulo_desc}</Tab>
            ))}
          </TabList>

          <TabPanels>
  {articulos.map((articulo) => (
          <TabPanel key={articulo.articulo_id}>
            <Box position="relative" display="flex" justifyContent="center" alignItems="center">
              {imagenesArticulos[articulo.articulo_id]?.length > 0 ? (
                <>
                  <Image
                    src={`http://localhost:3000/canjes/${id}/images/${imagenesArticulos[articulo.articulo_id][imageIndices[articulo.articulo_id]]?.imagen_nombre}`}
                    alt={imagenesArticulos[articulo.articulo_id][imageIndices[articulo.articulo_id]]?.imagen_nombre}
                    boxSize="400px"
                    objectFit="contain"
                  />
                  <Button
                    position="absolute"
                    top="50%"
                    left="0"
                    transform="translateY(-50%)"
                    onClick={prevImage}
                  >
                    &lt;
                  </Button>
                  <Button
                    position="absolute"
                    top="50%"
                    right="0"
                    transform="translateY(-50%)"
                    onClick={nextImage}
                  >
                    &gt;
                  </Button>
                </>
              ) : (
                <Text>No hay imágenes para este artículo</Text>
              )}
            </Box>
            
              {propuestaExistente ? (
                 <>
                 <Button onClick={retirarPropuesta} mt={4} colorScheme="red">
                   Retirar Propuesta
                 </Button>
       
                 <div style={{ marginTop: '10px', width: '100%' }}>
                  <label>Tu Propuesta:</label>
                  <Input 
                    value={tituloPropuesta} 
                    isReadOnly 
                    size="md" 
                    width="100%" 
                    mt={2}
                  />
                </div>
               </>

              ) : (
                <Button 
                  onClick={openModal} 
                  mt={4} 
                  colorScheme="teal"
                >
                  Enviar Propuesta
                </Button>
              )}
          </TabPanel>
        ))}
      </TabPanels>

        </Tabs>
      </Box>

      
      {/* Modal para la propuesta de canje */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Enviar Propuesta de Canje</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <FormControl>
        <FormLabel htmlFor="canjeSelect">Selecciona un canje:</FormLabel>
        <Select
          id="canjeSelect"
          placeholder="Selecciona un canje"
          onChange={(e) => setSelectedCanjeId(Number(e.target.value))}
        >
          {canjes.map((canje) => (
            <option key={canje.canje_id} value={canje.canje_id}>
              {canje.titulo}
            </option>
          ))}
        </Select>
      </FormControl>

      {/* Aquí se debe insertar el nuevo Input text */}
      <FormControl mt={4}>
        <FormLabel htmlFor="inputText">Propuesta:</FormLabel>
        <Input
          id="inputText"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ingresa tu propuesta aquí"
        />
      </FormControl>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3} onClick={handleSubmitPropuesta}>
        Enviar Propuesta
      </Button>
      <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </Grid>
  );
};

export default CanjeDetail;
