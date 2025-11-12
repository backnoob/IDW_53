import { medicos, especialidades, obrasSociales } from './data.js';

// --- Inicialización de localStorage con los datos del archivo data.js ---
export function inicializarLocalStorage() {
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
    localStorage.setItem("turnos", JSON.stringify([])); // arranca vacío
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

// --- ESPECIALIDADES ---
export function getEspecialidades() {
  return JSON.parse(localStorage.getItem("especialidades")) || [];
}

export function saveEspecialidades(lista) {
  localStorage.setItem("especialidades", JSON.stringify(lista));
}

// --- OBRAS SOCIALES ---
export function getObrasSociales() {
  return JSON.parse(localStorage.getItem("obrasSociales")) || [];
}

export function saveObrasSociales(lista) {
  localStorage.setItem("obrasSociales", JSON.stringify(lista));
}

// --- TURNOS ---
export function getTurnos() {
  return JSON.parse(localStorage.getItem("turnos")) || [];
}

export function saveTurnos(lista) {
  localStorage.setItem("turnos", JSON.stringify(lista));
}
