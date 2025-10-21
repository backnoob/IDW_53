import { inicializarLocalStorage, getMedicos, saveMedicos } from './storage.js';
import { renderMedicos, renderTablaMedicos } from './render.js';

// Inicializa los datos
inicializarLocalStorage();
renderMedicos();
renderTablaMedicos();

// Manejo del formulario de alta
const form = document.getElementById('altaMedicoForm');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();

        const nuevoMedico = {
            nombre: document.getElementById('nombre').value.trim(),
            especialidad: document.getElementById('especialidad').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            obraSocial: document.getElementById('obraSocial').value.trim(),
            email: document.getElementById('email').value.trim(),
            foto: 'img/default-doctor.jpg'
        };

        const medicos = getMedicos();
        nuevoMedico.id = medicos.length > 0 ? medicos[medicos.length - 1].id + 1 : 1;
        medicos.push(nuevoMedico);
        saveMedicos(medicos);

        renderMedicos();
        renderTablaMedicos();
        form.reset();
    });
}
