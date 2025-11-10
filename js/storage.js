import { medicos, especialidades, obrasSociales, turnos, reservas } from './data.js';

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
    localStorage.setItem("turnos", JSON.stringify(turnos));
  }
  if (!localStorage.getItem("reservas")) {
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }
}

export function getMedicos() {
  return JSON.parse(localStorage.getItem("medicos")) || [];
}

export function saveMedicos(medicos) {
  localStorage.setItem("medicos", JSON.stringify(medicos));
}

export function eliminarMedico(id) {
  const medicos = getMedicos().filter(m => m.id !== id);
  saveMedicos(medicos);
}

