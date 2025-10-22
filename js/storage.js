import { medicosIniciales } from './data.js';

export function inicializarLocalStorage() {
    if (!localStorage.getItem('medicos')) {
        localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
    }
}

export function getMedicos() {
    return JSON.parse(localStorage.getItem('medicos')) || [];
}

export function saveMedicos(medicos) {
    localStorage.setItem('medicos', JSON.stringify(medicos));
}

export function eliminarMedico(id) {
    const medicos = getMedicos().filter(medico => medico.id !== id);
    saveMedicos(medicos);
}


