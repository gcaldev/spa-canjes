"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Image,
  Step,
  StepDescription,
  StepIndicator,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Select,
  Text,
  useSteps,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
//import { error } from "console";

const steps = [
  { title: "Detalles", description: "Datos varios" },
  { title: "Ofrezco", description: "Artículos ofrecidos" },
  { title: "Me interesa", description: "Descripción" },
  { title: "Previsualización", description: "Cómo queda tu canje" },
  { title: "Confirmación", description: "Ya casi estás!" },
];

const NuevoCanje = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [oferta, setOferta] = useState("");
  const [interes, setInteres] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tiposCanje, setTiposCanje] = useState<TipoCanje[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedTipoCanje, setSelectedTipoCanje] = useState("");
  const { activeStep, setActiveStep } = useSteps({ index: 0 });
  const toast = useToast();
  const router = useRouter();

  

  // Fetch categories and types of canje
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:3000/canjes/categorias");
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTiposCanje = async () => {
      try {
        const response = await fetch("http://localhost:3000/canjes/tipo_canje");
        const data = await response.json();
        setTiposCanje(data);
      } catch (error) {
        console.error("Error fetching types of canje:", error);
      }
    };

    fetchCategorias();
    fetchTiposCanje();
  }, []);

  interface Categoria {
    categoria_id: number;
    categ_desc: string;
    categ_activo: boolean;
    categ_order: number;
  }
  interface TipoCanje {
    tipo_canje_id: number;
    tipo_desc: string;
    tipo_order: number;
    tipo_activo: boolean;
  }  


  const handleNext = () => {
    if (activeStep === 0 && (!titulo || !descripcion || !selectedCategoria || !selectedTipoCanje)) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (activeStep === 1 && (!oferta || !imageFile)) {
      toast({
        title: "Error",
        description: "Por favor suba una imagen y describa lo que ofrece.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (activeStep === 2 && !interes) {
      toast({
        title: "Error",
        description: "Por favor indique qué le interesa.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setActiveStep(activeStep + 1);
  };

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      //formData.append("oferta", oferta);
      formData.append("categoria", selectedCategoria);
      formData.append("tipo_canje", selectedTipoCanje);
      formData.append("interes", interes);
      if (imageFile) {
        formData.append("imagen", imageFile);
      }
      //console.log("ejecuto fetch");
      const response = await fetch("http://localhost:3000/canjes/nuevo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Canje creado",
          description: "El nuevo canje " + titulo + " ha sido registrado exitosamente. Deberás esperar a que sea aprobado.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/miscanjes");
      } else {
        throw new Error("Error al crear el canje");
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: "Hubo un problema al registrar el canje.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  // Buscar la descripción de la categoría y tipo de canje seleccionados
  const categoriaSeleccionada = categorias.find(c => c.categoria_id === parseInt(selectedCategoria));
  const tipoCanjeSeleccionado = tiposCanje.find(t => t.tipo_canje_id === parseInt(selectedTipoCanje));

  return (
    <Box p={6} maxW="600px" mx="auto">
      <Stepper index={activeStep} orientation="horizontal" gap="4" mb={6} colorScheme="teal">
  {steps.map((step, index) => (
    <Step key={index}>
      <StepIndicator>
        <StepStatus
          complete={<StepTitle>{index + 1}</StepTitle>}
          incomplete={<StepTitle>{index + 1}</StepTitle>}
          active={
            <StepTitle>
              <Text color="teal.500" fontWeight="bold">{index + 1}</Text> {/* Color más fuerte para el paso activo */}
            </StepTitle>
          }
        />
      </StepIndicator>

      <Box flexShrink="0" textAlign="center">
        <Text fontSize="lg" fontWeight={activeStep === index ? "bold" : "normal"} color={activeStep === index ? "teal.500" : "gray.500"}>
          {step.title}
        </Text>
        <StepDescription>{step.description}</StepDescription>
      </Box>

      {index < steps.length - 1 && <StepSeparator />}
    </Step>
  ))}
</Stepper>


      <Box>
        {activeStep === 0 && (
          <Box>
            <FormControl mb={3}>
              <FormLabel>Título de la Publicación</FormLabel>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ingrese el título del canje"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ingrese la descripción del canje"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Categoría</FormLabel>
              <Select
                placeholder="Seleccione una categoría"
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
              >
                {categorias.map((categoria) => (
                  <option key={categoria.categoria_id} value={categoria.categoria_id}>
                    {categoria.categ_desc}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Tipo de Publicación</FormLabel>
              <Select
                placeholder="Seleccione un tipo de canje"
                value={selectedTipoCanje}
                onChange={(e) => setSelectedTipoCanje(e.target.value)}
              >
                {tiposCanje.map((tipo) => (
                  <option key={tipo.tipo_canje_id} value={tipo.tipo_canje_id}>
                    {tipo.tipo_desc}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <FormControl mb={4}>
              <FormLabel>¿Qué ofrece?</FormLabel>
              <Textarea
                value={oferta}
                onChange={(e) => setOferta(e.target.value)}
                placeholder="Describa lo que ofrece en este canje"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Subir imagen del canje</FormLabel>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {imageFile && (
                <Image
                  src={URL.createObjectURL(imageFile)}
                  alt="Vista previa"
                  boxSize="300px"
                  mt={4}
                />
              )}
            </FormControl>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <FormControl mb={4}>
              <FormLabel>¿Qué le interesa a cambio?</FormLabel>
              <Textarea
                value={interes}
                onChange={(e) => setInteres(e.target.value)}
                placeholder="Describa qué le gustaría recibir a cambio"
              />
            </FormControl>
          </Box>
        )}

        {activeStep === 3 && (
          <Box>
            <Text><strong>Título:</strong> {titulo}</Text>
            <Text><strong>Descripción:</strong> {descripcion}</Text>
            <Text><strong>Oferta:</strong> {oferta}</Text>
            <Text><strong>Interés:</strong> {interes}</Text>
            <Text>
              <strong>Categoría:</strong> {categoriaSeleccionada?.categ_desc || "No seleccionada"}
            </Text>
            <Text>
              <strong>Tipo de Canje:</strong> {tipoCanjeSeleccionado?.tipo_desc || "No seleccionado"}
            </Text>
            {imageFile && (
              <Image
                src={URL.createObjectURL(imageFile)}
                alt="Vista previa"
                boxSize="300px"
                mt={4}
              />
            )}
          </Box>
        )}
      </Box>

      <Box display="flex" justifyContent="space-between" mt={6}>

      
        <Button
          onClick={handlePrevious}
          isDisabled={activeStep === 0}
          colorScheme="gray"
        >
          Anterior
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button colorScheme="teal" onClick={handleSubmit}>
            Confirmar
          </Button>
        ) : (
          <Button colorScheme="teal" onClick={handleNext}>
            Siguiente
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default NuevoCanje;
