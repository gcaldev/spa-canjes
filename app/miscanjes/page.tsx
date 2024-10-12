"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Grid,
  GridItem,
  Spinner,
  Box,
  Text,
  useToast,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { FiMoreVertical } from 'react-icons/fi';
import { ArrowForwardIcon } from '@chakra-ui/icons';

interface ItemData {
  canje_id: number;
  canje_desc: string;
  fecha_creado: string;
  titulo: string;
  lo_que_quiere_image: string;
  activo?: boolean; 
  estado_id: number;// Añadido para representar el estado de activación
}

const ItemGrid = () => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ItemData | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = useRef(null);
  const toast = useToast();
  const router = useRouter();


// Se ejecuta cuando el componente se monta para cargar los items
useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/canjes/usuario/1');
      const result = await response.json();

      if (response.ok && Array.isArray(result)) {
        setItems(result);
      } else {
        throw new Error('Error fetching items');
      }
    } catch (err: any) {
      console.error('Error al obtener los ítems:', err);
      setError(err.message || 'Error fetching items');
      toast({
        title: 'Error',
        description: err.message || 'Error al obtener los ítems',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: ItemData) => {
    // Verifica si hay un ítem seleccionado y lo abre en el modal de detalle
    if (!isDeleteOpen) {
        
      setSelectedItem(item);
      onOpen();
    }
  };

  const handleEdit = (item: ItemData) => {
    router.push(`/canjes/detalle/${item.canje_id}`);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/canjes/eliminar/${itemToDelete.canje_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems((prevItems) => prevItems.filter((i) => i.canje_id !== itemToDelete.canje_id));
        toast({
          title: 'Ítem eliminado',
          description: `El ítem con ID ${itemToDelete.canje_id} ha sido eliminado`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Error al eliminar el ítem');
      }
    } catch (err: any) {
      console.error('Error al eliminar el ítem:', err);
      toast({
        title: 'Error',
        description: err.message || 'Error al eliminar el ítem',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteClose(); // Cerrar el popup de confirmación
    }
  };

  const handlePause = async (item: ItemData) => {
    try {
      const response = await fetch(`http://localhost:3000/canjes/pausar/${item.canje_id}`, {
        method: 'PUT',
      });
  
      if (response.ok) {
        toast({
          title: 'Ítem pausado',
          description: `El ítem con ID ${item.canje_id} ha sido pausado`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
  
        // Actualiza la lista de ítems para reflejar el cambio de estado
        setItems((prevItems) =>
          prevItems.map((i) =>
            i.canje_id === item.canje_id ? { ...i, estado_id: 4 } : i // Asumiendo que estado_id 2 representa "Pausado"
          )
        );
      } else {
        throw new Error('Error al pausar el ítem');
      }
    } catch (err: any) {
      console.error('Error al pausar el ítem:', err);
      toast({
        title: 'Error',
        description: err.message || 'Error al pausar el ítem',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  const handleActivate = async (item: ItemData) => {
    try {
      const response = await fetch(`http://localhost:3000/canjes/activar/${item.canje_id}`, {
        method: 'PUT',
      });
  
      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Ítem activado',
          description: `El ítem con ID ${item.canje_id} ha sido activado`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
  
        // Actualiza la lista de ítems para reflejar el cambio
        setItems((prevItems) =>
          prevItems.map((i) =>
            i.canje_id === item.canje_id ? { ...i, estado_id: 1  } : i
          )
        );
      } else {
        throw new Error('Error al activar el ítem');
      }
    } catch (err: any) {
      console.error('Error al activar el ítem:', err);
      toast({
        title: 'Error',
        description: err.message || 'Error al activar el ítem',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleDeactivate = async (item: ItemData) => {
    try {
      const response = await fetch(`http://localhost:3000/canjes/desactivar/${item.canje_id}`, {
        method: 'PUT',
      });

      if (response.ok) {
        toast({
          title: 'Ítem desactivado',
          description: `El ítem con ID ${item.canje_id} ha sido desactivado`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Actualiza la lista de ítems para reflejar el cambio de estado
        setItems((prevItems) =>
          prevItems.map((i) =>
            i.canje_id === item.canje_id ? { ...i, estado_id: 0 } : i
          )
        );
      } else {
        throw new Error('Error al desactivar el ítem');
      }
    } catch (err: any) {
      console.error('Error al desactivar el ítem:', err);
      toast({
        title: 'Error',
        description: err.message || 'Error al desactivar el ítem',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openDeleteConfirmation = (item: ItemData, event: React.MouseEvent) => {
    event.stopPropagation(); // Evitar que el clic sobre el botón de eliminar dispare la apertura del modal de detalle
    setItemToDelete(item);
    onDeleteOpen();
  };

  return (
    <Box>

    <Button colorScheme="green" onClick={() => router.push('/canjes/nuevo')} mb={4}>
        Nuevo Canje
      </Button>

      <Button colorScheme="blue" onClick={fetchItems} mb={4}>
        Mis Canjes
      </Button>

      {loading && <Spinner />}

      {error && <Text color="red.500">{error}</Text>}

      {!loading && items.length > 0 && (
        <Grid
          templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap={4}
          overflowX="auto"
        >
          {items.map((item) => (
          <GridItem
          key={item.canje_id}
          border="1px"
          borderRadius="md"
          p={2}
          position="relative"
          cursor={item.estado_id === 1 ? "pointer" : "not-allowed"} // Cambiar cursor si está desactivado
          opacity={item.estado_id === 1 ? 1 : 0.5} // Reducir la opacidad si está desactivado
          onClick={() => item.estado_id === 1 && handleItemClick(item)} // Solo abrir si está activo
        >
          <Box position="absolute" top={2} right={2}>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<FiMoreVertical />}
                variant="outline"
                onClick={(e) => e.stopPropagation()} // Evita abrir el modal de detalles
              />
              <MenuList zIndex={1000}>
                {item.estado_id === 1 ? (
                  <>
                    <MenuItem onClick={() => handleEdit(item)}>Editar</MenuItem>
                    <MenuItem onClick={(e) => openDeleteConfirmation(item, e)}>Eliminar</MenuItem>
                    <MenuItem onClick={() => handleDeactivate(item)}>Desactivar</MenuItem>
                    <MenuItem onClick={() => handlePause(item)}>Pausar</MenuItem> 
                  </>
                ) : item.estado_id === 0 ? (
                    <>
                    <MenuItem onClick={() => handleActivate(item)}>Activar</MenuItem>      
                    </>
                 ) : item.estado_id === 4 ? (  
                    <>
                      <MenuItem onClick={() => handleActivate(item)}>Reanudar</MenuItem> {/* Puedes reactivar desde pausado */}
                    </>
                  ) : null}
              </MenuList>
            </Menu>
          </Box>
        
          {/* Contenido del item */}
          <Box display="flex" alignItems="center">
            <Box textAlign="center" mr={2}>
              <Text fontWeight="bold" color={item.estado_id === 1 ? "black" : "gray"}>
                Ofrezco
              </Text>
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
                style={{ filter: item.estado_id === 1 ? "none" : "grayscale(100%)" }} // Imagen en gris si está desactivado
              />
            </Box>
        
            <ArrowForwardIcon boxSize={8} mx={2} />
        
            <Box textAlign="center" ml={2}>
              <Text fontWeight="bold" color={item.estado_id === 1 ? "black" : "gray"}>
                Quiero!
              </Text>
              <Image
                src={`http://localhost:3000/canjes/${item.canje_id}/lo_que_quiere_image`}
                alt="Lo que quiero"
                boxSize="100px"
                objectFit="cover"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = '/images/estandar.jpg';
                }}
                style={{ filter: item.estado_id === 1 ? "none" : "grayscale(100%)" }} // Imagen en gris si está desactivado
              />
            </Box>
          </Box>
        
          <Text fontWeight="bold" fontSize="sm" color={item.estado_id === 1 ? "black" : "gray"}>
            {item.titulo}
          </Text>
          <Text fontSize="xs" color={item.estado_id === 1 ? "black" : "gray"}>
            {item.canje_desc}
          </Text>
        
          <Text fontSize="xs" color={item.estado_id === 1 ? "black" : "gray"}>
            {new Date(item.fecha_creado).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </Text>
        </GridItem>
        
         
          ))}
        </Grid>
      )}

      {!loading && items.length === 0 && <Text>No hay ítems disponibles</Text>}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedItem?.titulo}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedItem && (
              <>
                <Image
                  src={`http://localhost:3000/canjes/${selectedItem.canje_id}/images`}
                  alt={selectedItem.titulo}
                  boxSize="200px"
                  objectFit="cover"
                  mx="auto"
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = '/images/estandar.jpg';
                  }}
                />
                <Text>{selectedItem.canje_desc}</Text>

                {/* Aplicar formato de fecha en el modal */}
                <Text>Fecha de creación: {new Date(selectedItem.fecha_creado).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}</Text>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Popup de confirmación de eliminación */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Eliminación
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro que deseas eliminar el ítem "{itemToDelete?.titulo}"?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ItemGrid;
