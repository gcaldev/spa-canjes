import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Spinner,
  Input,
  FormControl,
  FormLabel,
  Badge,
  Grid,
  GridItem,
  Box,
  useToast,
} from '@chakra-ui/react';

interface ItemData {
  id: number;
  title: string;
  description: string;
}


interface UserData {
  apynom: string;
  email: string;
  username: string;
  canjes_cant: number;
  lastaccess: string;
  verificado: boolean;
  localidad: string;
  direccion: string;
  cel: string;
}

const MyModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState<UserData | null>(null); // Datos del usuario
  const [loading, setLoading] = useState(false); // Estado de carga de la API
  const [saving, setSaving] = useState(false); // Estado de guardado de datos
  const toast = useToast(); // Para notificaciones

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/usuarios/c20ad4d76fe97759aa27a0c99bff6710'); // Llamada a la API
      const result = await response.json();

      if (result?.apynom && result?.email && result?.username && result?.lastaccess && result?.verificado) {
        setData({
          apynom: result.apynom,
          email: result.email,
          username: result.username,
          canjes_cant: result.canjes_cant,
          lastaccess: result.lastaccess,
          verificado: result.verificado,
          localidad: result.localidad || '', // Si es nulo, dejarlo como string vacío
          direccion: result.direccion || '', 
          cel: result.cel || '', 
        });
      } else {
        setData(null);
      }
    } catch (error) {
      console.error('Error obteniendo datos', error);
      setData(null);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };

  const saveData = async () => {
    if (!data) return;
    setSaving(true);

    try {
      const response = await fetch('http://localhost:3000/usuarios/c20ad4d76fe97759aa27a0c99bff6710', {
        method: 'PUT', // Puede ser 'PATCH' dependiendo de tu API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        
      });

      if (response.ok) {
        toast({
          title: 'Datos guardados',
          description: 'Tus cambios han sido guardados exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Hubo un problema guardando los datos.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error al guardar los datos', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error guardando los datos.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setSaving(false);
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Mi Perfil
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={450}>
          <ModalHeader>Mi Perfil</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading ? (
              <Spinner />
            ) : (
              <>
                {data ? (
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem colSpan={2}>
                      <FormControl mb={2}>
                        <FormLabel>Nombre</FormLabel>
                        <Input
                          name="apynom"
                          value={data.apynom}
                          onChange={handleChange}
                          placeholder="Ingresa tu nombre"
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl mb={2}>
                        <FormLabel>Usuario</FormLabel>
                        <Input
                          name="username"
                          value={data.username}
                          onChange={handleChange}
                          placeholder="Ingresa tu usuario"
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl mb={2}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          name="email"
                          value={data.email}
                          onChange={handleChange}
                          placeholder="Ingresa tu email"
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl mb={2}>
                        <FormLabel>Celular</FormLabel>
                        <Input
                          name="cel"
                          value={data.cel}
                          onChange={handleChange}
                          placeholder="Ingresa tu celular"
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl mb={2}>
                        <FormLabel>Direccion</FormLabel>
                        <Input
                          name="direccion"
                          value={data.direccion}
                          onChange={handleChange}
                          placeholder="Ingresa tu direccion"
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl mb={2}>
                        <FormLabel>Localidad</FormLabel>
                        <Input
                          name="localidad"
                          value={data.localidad}
                          onChange={handleChange}
                          placeholder="Ingresa tu localidad"
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl mb={2}>
                        <FormLabel>Canjes Realizados</FormLabel>
                        <Text>{data.canjes_cant}</Text>
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl mb={2}>
                        <FormLabel>Último Acceso</FormLabel>
                        <Text>{data.lastaccess}</Text>
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl mb={2}>
                        <FormLabel>Verificado</FormLabel>
                        <Badge colorScheme={data.verificado ? 'green' : 'red'}>
                          {data.verificado ? 'Verificado' : 'No Verificado'}
                        </Badge>
                      </FormControl>
                    </GridItem>
                  </Grid>
                ) : (
                  <Text>No hay datos disponibles</Text>
                )}
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button
              colorScheme="green"
              onClick={saveData}
              isLoading={saving}
            >
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyModal;
