export const especialidades = [
  { id: 1, nombre: "Clínica Médica" },
  { id: 2, nombre: "Pediatría" },
  { id: 3, nombre: "Cardiología" },
  { id: 4, nombre: "Dermatología" }
];

export const obrasSociales = [
  { id: 1, nombre: "OSDE", descripcion: "Cobertura médica nacional" },
  { id: 2, nombre: "Swiss Medical", descripcion: "Cobertura privada premium" },
  { id: 3, nombre: "Galeno", descripcion: "Cobertura general en hospitales asociados" },
  { id: 4, nombre: "Particular", descripcion: "Atención sin obra social" }
];

export const medicos = [
  {
    id: 1,
    nombre: "Ana",
    apellido: "González",
    especialidadId: 3,
    obrasSociales: [1, 2],
    valorConsulta: 25000,
    matricula:123123,
    email: "ana.gonzalez@clinica.com",
    descripcion: "Medico especializado",
    foto: "/img/doctor1.jpg"
  },
  {
    id: 2,
    nombre: "Carlos",
    apellido: "Pérez",
    especialidadId: 1,
    obrasSociales: [1, 3, 4],
    valorConsulta: 18000,
    matricula:4545454,
    email: "carlos.perez@hospital.com",
    descripcion: "Medico especializado",
    foto: "img/doctor1.jpg"
  }
];

