import { medicos, especialidades, obrasSociales} from './data.js';

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

}

export function saveObrasSociales(lista) {
  localStorage.setItem("obrasSociales", JSON.stringify(lista));
}

export function getObrasSociales() {
  return JSON.parse(localStorage.getItem("obrasSociales")) || [];
}

export function saveEspecialidades(lista) {
  localStorage.setItem("especialidades", JSON.stringify(lista));
}

export function getEspecialidades() {
  return JSON.parse(localStorage.getItem("especialidades")) || [];
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

console.log(JSON.parse(localStorage.getItem("obrasSociales")));