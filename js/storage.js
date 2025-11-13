import { medicos, especialidades, obrasSociales } from './data.js';

// --- Inicialización de localStorage con los datos del archivo data.js ---
export function inicializarLocalStorage() {
  // Verificamos si ya existen los datos en el localStorage
  if (!localStorage.getItem("medicos")) {
    localStorage.setItem("medicos", JSON.stringify(medicos));
  }
  if (!localStorage.getItem("especialidades")) {
    localStorage.setItem("especialidades", JSON.stringify(especialidades));
  }
  if (!localStorage.getItem("obrasSociales")) {
    localStorage.setItem("obrasSociales", JSON.stringify(obrasSociales));
  }
  if (!localStorage.getItem("turnos")) {
    localStorage.setItem("turnos", JSON.stringify([])); // Arranca vacío
  }
}

// --- MÉDICOS ---
export function getMedicos() {
  return JSON.parse(localStorage.getItem("medicos")) || [];
}

export function saveMedicos(lista) {
  localStorage.setItem("medicos", JSON.stringify(lista));
}

export function eliminarMedico(id) {
  const medicos = getMedicos().filter(m => m.id !== id);
  saveMedicos(medicos);
}

// --- OBRAS SOCIALES ---
export function getObrasSociales() {
  return JSON.parse(localStorage.getItem("obrasSociales")) || [];
}

export function saveObrasSociales(lista) {
  localStorage.setItem("obrasSociales", JSON.stringify(lista));
}

// --- ESPECIALIDADES ---
export const getEspecialidades = () => {
  const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
  return especialidades;
};

// Guardar especialidades en localStorage
export function saveEspecialidades(especialidades) {
  localStorage.setItem('especialidades', JSON.stringify(especialidades));
}

// --- TURNOS ---
export function getTurnos() {
  return JSON.parse(localStorage.getItem("turnos")) || [];
}

export function saveTurnos(lista) {
  const turnosConPrecio = lista.map(t => ({
    ...t,
    precio: t.precio ?? 0 // Si no tiene precio, le asigna 0 por defecto
  }));

  localStorage.setItem("turnos", JSON.stringify(turnosConPrecio));
}
