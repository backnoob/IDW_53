import { medicosIniciales } from './data.js';

// Inicializa localStorage si está vacío
export function inicializarLocalStorage() {
    if (!localStorage.getItem('medicos')) {
        localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
    }
}

// Obtiene todos los médicos
export function getMedicos() {
    return JSON.parse(localStorage.getItem('medicos')) || [];
}

// Guarda lista completa de médicos
export function saveMedicos(medicos) {
    localStorage.setItem('medicos', JSON.stringify(medicos));
}

// Elimina un médico por ID
export function eliminarMedico(id) {
    const medicos = getMedicos().filter(medico => medico.id !== id);
    saveMedicos(medicos);
}
