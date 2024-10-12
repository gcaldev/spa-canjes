"use client";

//import GrillaDeArticulos from './GrillaDeArticulos';
import { AddIcon } from '@chakra-ui/icons';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Spinner,
  useToast,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  SimpleGrid,
  GridItem,
  Image,
  IconButton,
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';

interface ItemData {
  canje_id: number;
  canje_desc: string;
  titulo: string;
  fecha_creado: string;
  fecha_pub: string | null;
  categoria_id: number;
  tipo_canje_id: number;
  estado: string;
  estado_id: number;
  art_canje: string | null;
}

interface Categoria {
  categoria_id: number;
  categ_desc: string;
}

interface Estado {
  estado_id: number;
  estado: string;
}

interface TipoCanje {
  tipo_canje_id: number;
  tipo_desc: string;
}

interface Articulo {
  articulo_id: number;
  canje_id: number;
  articulo_desc: string;
  articulo_activo: boolean;
  articulo_fecha: string;
  art_canje: string;
}


const EditItemPage = ({ params }: { params: { id: string } }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Estado solo para el modal de agregar nuevo artículo
  const [currentArticuloId, setCurrentArticuloId] = useState<number | null>(null);
  const [itemData, setItemData] = useState<ItemData | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tiposCanje, setTiposCanje] = useState<TipoCanje[]>([]);
  const [estado, setEstado] = useState<Estado[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [imagenesArticulos, setImagenesArticulos] = useState<{ [key: number]: Array<{ imagen_id: number; url: string }> }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { id } = params;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [descripcion, setDescripcion] = useState('');

  // Función para abrir el modal
  const openModal = () => setIsModalOpen(true);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    console.log('Cerrando modal...???');
    setIsCreateModalOpen(false);
    setDescripcion('');
  };

  // Función para cerrar el modal
  const closeModal = () => {
    console.log('Cerrando modal...');
    setIsModalOpen(false);
    setDescripcion('');
  }




  
  const fetchItemData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/canjes/detalle/${id}`);
      if (!response.ok) {
        throw new Error('Error fetching item data');
      }
      const result = await response.json();
      setItemData(result[0]);
    } catch (err: any) {
      setError(err.message || 'Error fetching item data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://localhost:3000/canjes/categorias');
      if (!response.ok) {
        throw new Error('Error fetching categorias');
      }
      const result = await response.json();
      setCategorias(result);
    } catch (err: any) {
      setError(err.message || 'Error fetching categorias');
    }
  };


  const fetchEstados = async () => {
    try {
      const response = await fetch('http://localhost:3000/canjes/estados');
      if (!response.ok) {
        throw new Error('Error fetching estados');
      }
      const result = await response.json();
      setEstado(result);
    } catch (err: any) {
      setError(err.message || 'Error fetching estados');
    }
  };


  const fetchTiposCanje = async () => {
    try {
      const response = await fetch('http://localhost:3000/canjes/tipo_canje');
      if (!response.ok) {
        throw new Error('Error fetching tipos de canje');
      }
      const result = await response.json();
      setTiposCanje(result);
    } catch (err: any) {
      setError(err.message || 'Error fetching tipos de canje');
    }
  };

  const fetchArticulos = async () => {
    try {
      const response = await fetch(`http://localhost:3000/canjes/articulos/${id}`);
      if (!response.ok) {
        throw new Error('Error fetching articulos');
      }
      const result = await response.json();
  
      // Verifica que result sea un arreglo y contenga los artículos
      if (!Array.isArray(result)) {
        throw new Error('No se encontraron artículos en la respuesta');
      }
  
      // Llama a la función para obtener imágenes de cada artículo
      await Promise.all(result.map(async (articulo) => {
        await fetchImagenesArticulo(articulo.articulo_id);
      }));
  
      // Guarda los artículos en el estado
      setArticulos(result);
    } catch (err: any) {
      setError(err.message || 'Error fetching articulos');
    }
  };
  

  const fetchImagenesArticulo = async (articuloId: number) => {
    try {
      //console.log(articuloId);
      const response = await fetch(`http://localhost:3000/canjes/images/articulos/${articuloId}`);
      //console.log(`Response status: ${response.status}`);
      if (response.status === 404) {
        // Si no hay imágenes, asignar un array vacío sin lanzar error
        setImagenesArticulos((prevState) => ({
          ...prevState,
          [articuloId]: [], // Asigna un array vacío si no hay imágenes
        }));
        return;
      }


      if (!response.ok) {
        throw new Error('Error fetching images for articulo');
      }
        const data = await response.json();
      // Aquí asumimos que `data` es un array de imágenes
      if (!Array.isArray(data) || data.length === 0) {
        
        setImagenesArticulos((prevState) => ({
          ...prevState,
          [articuloId]: [], // Asigna un array vacío si no hay imágenes
        
        }));
        return; // Termina la ejecución aquí
      }
  
      // Guarda tanto el `imagen_id` como la URL completa en el estado
      
      const imagenes = data.map((imagen: { imagen_id: number; imagen_nombre: string }) => ({
        imagen_id: imagen.imagen_id,
        url: `http://localhost:3000/canjes/${id}/images/${imagen.imagen_nombre}`,
      }));
  
      setImagenesArticulos((prevState) => ({
        ...prevState,
        [articuloId]: imagenes,
      }));

    } catch (err: any) {
      setError(err.message || 'Error fetching images for articulo');
    }
  };
  
  
  useEffect(() => {
    fetchItemData();
    fetchCategorias();
    fetchTiposCanje();
    fetchEstados();
    fetchArticulos();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setItemData((prevData) => (prevData ? { ...prevData, [name]: value } : null));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItemData((prevData) => (prevData ? { ...prevData, [name]: parseInt(value) } : null));
  };

  const handleDeleteArticulo = async (articuloId: number) => {
    try {
      console.log("eliminando articulo" + articuloId);
      const response = await fetch(`http://localhost:3000/canjes/articulo/delete/${articuloId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Filtra las imágenes para eliminar la seleccionada
        await fetchArticulos();
       
      } else {
        throw new Error('Error al eliminar la imagen');
      }
    } catch (error) {
      console.error('Error al hacer la solicitud al backend:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la imagen.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const handleDeleteImage = async (imagenId: number) => {
    try {
      console.log("eliminando imagen" + imagenId);
      const response = await fetch(`http://localhost:3000/canjes/images/delete/${imagenId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Filtra las imágenes para eliminar la seleccionada
        setSelectedImages((prevImages) => prevImages.filter((image) => image.imagen_id !== imagenId));
        toast({
          title: 'Imagen eliminada',
          description: 'La imagen se eliminó correctamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Error al eliminar la imagen');
      }
    } catch (error) {
      console.error('Error al hacer la solicitud al backend:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la imagen.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  


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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    console.log("Item Data:", itemData); // Agregar esta línea
    try {
      const response = await fetch(`http://localhost:3000/canjes/actualizar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        toast({
          title: 'Canje actualizado',
          description: 'El Canje ha sido actualizado correctamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        router.push('/miscanjes');
      } else {
        throw new Error('Error al actualizar el canje');
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el canje');
    } finally {
      setUpdating(false);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  //const [selectedImages, setSelectedImages] = useState<string[]>([]);
  //const [selectedImages, setSelectedImages] = useState<{ imagen_id: number; url: string }[]>([]);
  //const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<{ imagen_id: number; url: string }[]>([]);


 // const [articuloId, setArticuloId] = useState(null);

 const openImageModal = async (articuloId: number) => {
  try {
    // Cargar las imágenes del artículo
    await fetchImagenesArticulo(articuloId);

    // Obtén las imágenes del estado, incluyendo imagen_id
    const images = imagenesArticulos[articuloId] || [];

    // Actualiza el estado con las imágenes seleccionadas
    setSelectedImages(images);

    // Establecer el articuloId actual
    setCurrentArticuloId(articuloId);

    // Abre el modal
    onOpen();
  } catch (err: any) {
    setError(err.message || 'Error loading images');
  }
};

  // Estado para almacenar las imágenes seleccionadas
const [newImages, setNewImages] = useState<FileList | null>(null);
const [imageUrls, setImageUrls] = useState<string[]>([]);

// Efecto para revocar las URLs
useEffect(() => {
  return () => {
    imageUrls.forEach(url => URL.revokeObjectURL(url));
  };
}, [imageUrls]);

// Maneja la selección de nuevas imágenes
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, articuloId: number | null) => {
  if (currentArticuloId === null) return;

  const files = e.target.files; // Almacena los archivos seleccionados

  // Verifica si hay archivos seleccionados
  if (files && files.length > 0) {
    const urls = Array.from(files).map(file => URL.createObjectURL(file));
    setImageUrls(urls); // Almacena las URLs en el estado
    setNewImages(files); // Almacena el FileList si lo necesitas
  } else {
    // Maneja el caso en que no se seleccionan archivos
    console.warn("No files selected.");
    setImageUrls([]); // Limpia URLs si no hay archivos
  }
};


// Función para subir las imágenes seleccionadas
const submitImages = async () => {
  if (!newImages || currentArticuloId === null) return;
  console.log("Subiendo imágenes para el artículo ID:", currentArticuloId);
  const formData = new FormData();
  formData.append('articulo_id', currentArticuloId.toString());
  for (let i = 0; i < newImages.length; i++) {
    formData.append('images', newImages[i]); // Agrega cada imagen al FormData
  }

  try {
    // Enviar las imágenes al backend
    const response = await fetch(`http://localhost:3000/canjes/${id}/images/upload`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      toast({
        title: 'Imágenes subidas',
        description: 'Las imágenes han sido subidas correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Vuelve a cargar las imágenes del artículo
      await fetchImagenesArticulo(currentArticuloId);
      // Actualiza selectedImages con las nuevas imágenes
      const newImagesUrls = Array.from(newImages).map((file, index) => ({
        imagen_id: Date.now() + index, // O cualquier lógica para generar un ID único
        url: URL.createObjectURL(file),
      }));
      setSelectedImages((prev) => [...prev, ...newImagesUrls]);

      // Limpiar newImages
    setNewImages(null);
    setImageUrls([]); 

    } else {
      throw new Error('Error al subir las imágenes');
    }
  } catch (err: any) {
    setError(err.message || 'Error uploading images');
  }
};

// Función para manejar la creación de un nuevo artículo
const agregarArticulo = async () => {
  if (descripcion.trim() === '') return;

  // Aquí harías el llamado a la API para agregar el artículo
  const response = await fetch(`http://localhost:3000/canjes/articulo/nuevo/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ descripcion }),
  });

  if (response.ok) {
    // Si el artículo se agrega exitosamente, refresca la página o actualiza la grilla
    //window.location.reload();  // Puedes usar otra lógica si prefieres no recargar la página entera
    
    closeCreateModal();
    //closeModal();
    await fetchArticulos();
  }
};




  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Box color="red.500">Error: {error}</Box>;
  }

  return (
    <Box maxW="800px" mx="auto" mt={8}>
      <form onSubmit={handleSubmit}>
        <SimpleGrid columns={2} spacing={5}>
          <GridItem>
            <FormControl>
              <FormLabel>Título</FormLabel>
              <Input
                type="text"
                name="titulo"
                value={itemData?.titulo || ''}
                onChange={handleInputChange}
                isRequired
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                name="canje_desc"
                value={itemData?.canje_desc || ''}
                onChange={handleInputChange}
                isRequired
              />
            </FormControl>
          </GridItem>

          

          <GridItem>
            <FormControl>
              <FormLabel>Categoria</FormLabel>
              <Select
                name="categoria_id"
                value={itemData?.categoria_id || ''}
                onChange={handleSelectChange}
                isRequired
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map(c => (
                  <option key={c.categoria_id} value={c.categoria_id}>
                    {c.categ_desc}
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Tipo de canje</FormLabel>
              <Select
                name="tipo_canje_id"
                value={itemData?.tipo_canje_id || ''}
                onChange={handleSelectChange}
                isRequired
              >
                <option value="">Seleccione un tipo de canje</option>
                {tiposCanje.map(tc => (
                  <option key={tc.tipo_canje_id} value={tc.tipo_canje_id}>
                    {tc.tipo_desc}
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>Artículo de Canje</FormLabel>
              <Textarea
                name="art_canje"
                value={itemData?.art_canje || ''} // Asegúrate de que el valor esté ligado al estado
                onChange={handleInputChange}
                isRequired
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Estado de la Publicación</FormLabel>
              <Select 
                disabled
                name="estado"
                value={itemData?.estado_id ?? ''}
                onChange={handleSelectChange}
                isRequired
              >
                <option value="">Seleccione un estado</option>
                {estado.map(es => (
                  <option key={es.estado_id} value={es.estado_id}>
                    {es.estado}
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>
        </SimpleGrid>
         {/* Contenedor para el botón de actualización */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Button colorScheme="teal" type="submit" isLoading={updating}>
            Actualizar
          </Button>
        </div>
      </form>

      <Box mt={8}>
      <Table mt={8} variant="simple">
  <Thead>
    <Tr>
      
      <Th cursor={'pointer'}
          title='Agregar articulo'> <Button onClick={openCreateModal} title="Agregar artículo">
          +
        </Button></Th>
      <Th>Descripción</Th>
      <Th>Fecha</Th>
      <Th>Imágenes</Th>
      <Th>Eliminar</Th>
    </Tr>
  </Thead>
  <Tbody>
    {articulos.map((articulo) => (
      <Tr key={articulo.articulo_id}>
        <Td></Td>
        <Td>{articulo.articulo_desc}</Td> {/* Mostrar descripción del artículo */}
        <Td>{formatDate(articulo.articulo_fecha)}</Td>
        <Td>
          <Button onClick={() => openImageModal(articulo.articulo_id)}>Ver imágenes</Button>
        </Td>
        <Td>
        {/* Mostrar el botón de eliminación solo si hay más de un artículo */}
        {articulos.length > 1 && (
          <Button
            onClick={() => handleDeleteArticulo(articulo.articulo_id)}
            colorScheme="grey"
            size="sm"
            cursor={'pointer'}
          >
            🗑️
          </Button>
          
        )}
        
      </Td>
       
      </Tr>
    ))}
  </Tbody>
</Table>
      </Box>
      
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <ModalContent>
          <ModalHeader>Agregar nuevo artículo</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={agregarArticulo}>Agregar</Button>&nbsp;
            <Button onClick={closeCreateModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  
  <Modal isOpen={isOpen} onClose={onClose} size="xl">
  <ModalOverlay />
  <ModalContent>
  <ModalCloseButton zIndex={1} top="0.5rem" right="0.5rem" title="Cerrar Ventana"/>
        <ModalBody p={10}>
        {selectedImages.length > 0 ? (
        <SimpleGrid columns={3} spacing={4}>
          {selectedImages.map((image) => (
            <Box position="relative" key={image.imagen_id} role="group">
              <Image src={image.url} alt={`Imagen ${image.imagen_id}`} />
              <Box
                className="trash-icon"
                onClick={() => handleDeleteImage(image.imagen_id)} // Usa `imagen_id` para eliminar
                position="absolute"
                top={1}
                right={1}
                backgroundColor="rgba(255, 255, 255, 0.7)"
                borderRadius="50%"
                p={1}
                title='Eliminar imagen'
                cursor="pointer"
                display="none" // Oculto por defecto
                _groupHover={{ display: "block" }} 
                _hover={{ backgroundColor: "rgba(255, 0, 0, 0.8)" }}
              >
                🗑️
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Box>No hay imágenes para este artículo.</Box>
      )}

      {/* Input para agregar nuevas imágenes */}
      <Box mt={7}>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleImageUpload(e, currentArticuloId)}
        />
        <Button colorScheme="teal" mt={2} onClick={submitImages}>
        Subir Imágenes
        </Button>

      </Box>
    </ModalBody>
  </ModalContent>
</Modal>

    </Box>
  );
};


export default EditItemPage;
