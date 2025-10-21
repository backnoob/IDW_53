import { inicializarLocalStorage, getMedicos, saveMedicos } from './storage.js';
import { renderMedicos, renderTablaMedicos } from './render.js';

inicializarLocalStorage();
renderMedicos();
renderTablaMedicos();

const formAlta = document.getElementById('altaMedicoForm');
const formEdicion = document.getElementById('edicionMedicoForm')
if (formAlta) {
    formAlta.addEventListener('submit', e => {
        e.preventDefault();

        const medicos = getMedicos();

        const nuevoMedico = {
            nombre: document.getElementById('nombre').value.trim(),
            especialidad: document.getElementById('especialidad').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            obraSocial: document.getElementById('obraSocial').value.trim(),
            email: document.getElementById('email').value.trim(),
            foto: 'img/default-doctor.jpg',
            id: medicos.length > 0 ? medicos[medicos.length - 1].id + 1 : 1
        };

        medicos.push(nuevoMedico);
        saveMedicos(medicos);
        renderMedicos();
        renderTablaMedicos();
        formAlta.reset();

    });
}



if (formEdicion) {
    formEdicion.addEventListener('submit', e => {
        e.preventDefault();

        const id = document.getElementById('edicionMedicoId').value;
        const medicos = getMedicos();

        const index = medicos.findIndex(m => m.id == id);
        if (index !== -1) {
            medicos[index] = {
                ...medicos[index],
                nombre: document.getElementById('edicionNombre').value.trim(),
                especialidad: document.getElementById('edicionEspecialidad').value.trim(),
                telefono: document.getElementById('edicionTelefono').value.trim(),
                obraSocial: document.getElementById('edicionObraSocial').value.trim(),
                email: document.getElementById('edicionEmail').value.trim(),
                foto: medicos[index].foto
            };
        }

        saveMedicos(medicos);
        renderMedicos();
        renderTablaMedicos();
        formEdicion.reset();
    });
}