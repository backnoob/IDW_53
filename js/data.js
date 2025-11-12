export const especialidades = [
  { id: 1, nombre: "Clínica Médica" },
  { id: 2, nombre: "Pediatría" },
  { id: 3, nombre: "Cardiología" },
  { id: 4, nombre: "Dermatología" }
];

export const obrasSociales = [
  { id: 1, nombre: "OSDE", descripcion: "Cobertura médica nacional", descuento: 0.1 }, 
  { id: 2, nombre: "Swiss Medical", descripcion: "Cobertura privada premium", descuento: 0 }, 
  { id: 3, nombre: "Galeno", descripcion: "Cobertura general en hospitales asociados", descuento: 0.05 }, 
  { id: 4, nombre: "Particular", descripcion: "Atención sin obra social", descuento: 0 } 
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

// Cargar turnos iniciales SOLO si no existen
if (!localStorage.getItem("turnos")) {
  localStorage.setItem("turnos", JSON.stringify([
    { id: 1, medicoId: 1, fecha: "2025-11-14", hora: "10:00", estado: "disponible" },
    { id: 2, medicoId: 1, fecha: "2025-11-15", hora: "09:00", estado: "disponible" },
    { id: 3, medicoId: 2, fecha: "2025-11-14", hora: "11:00", estado: "reservado" }
  ]));
}


