import { inicializarLocalStorage, getMedicos, saveMedicos } from './storage.js';
import { renderMedicos, renderTablaMedicos } from './render.js';

inicializarLocalStorage();
renderMedicos();
renderTablaMedicos();


const btnAltaMedico = document.getElementById('btnAltaMedico');
const modalAlta = new bootstrap.Modal(document.getElementById('modalAltaMedico'));
const formAlta = document.getElementById('altaMedicoForm');
const btnGuardarAlta = document.getElementById('guardarAltaBtn');

btnAltaMedico.addEventListener('click', () => {
    formAlta.reset();
    modalAlta.show();
});

btnGuardarAlta.addEventListener('click', () => {
    const medicos = getMedicos();

    const nuevoMedico = {
        id: medicos.length ? medicos[medicos.length - 1].id + 1 : 1,
        nombre: document.getElementById('altaNombre').value,
        especialidad: document.getElementById('altaEspecialidad').value,
        telefono: document.getElementById('altaTelefono').value,
        obraSocial: document.getElementById('altaObraSocial').value,
        email: document.getElementById('altaEmail').value,
        foto: "img/default-doctor.jpg"
    };

    const archivoFoto = document.getElementById('altaFoto').files[0];

    if (archivoFoto) {
        const reader = new FileReader();
        reader.onload = e => {
            nuevoMedico.foto = e.target.result;
            medicos.push(nuevoMedico);
            saveMedicos(medicos);
            renderMedicos();
            renderTablaMedicos();
            formAlta.reset();
            modalAlta.hide();
        };
        reader.readAsDataURL(archivoFoto);
    } else {
        medicos.push(nuevoMedico);
        saveMedicos(medicos);
        renderMedicos();
        renderTablaMedicos();
        formAlta.reset();
        modalAlta.hide();
    }
});


const modalEdicion = new bootstrap.Modal(document.getElementById('modalEditarMedico'));
const formEdicion = document.getElementById('edicionMedicoForm');

formEdicion.addEventListener('submit', e => {
    e.preventDefault();

    const id = parseInt(document.getElementById('edicionMedicoId').value);
    const medicos = getMedicos();
    const index = medicos.findIndex(m => m.id === id);
    if (index === -1) return;

    const archivoFoto = document.getElementById('edicionFoto').files[0];

    const guardarCambios = (foto) => {
        medicos[index] = {
            ...medicos[index],
            nombre: document.getElementById('edicionNombre').value.trim(),
            especialidad: document.getElementById('edicionEspecialidad').value.trim(),
            telefono: document.getElementById('edicionTelefono').value.trim(),
            obraSocial: document.getElementById('edicionObraSocial').value.trim(),
            email: document.getElementById('edicionEmail').value.trim(),
            foto
        };

        saveMedicos(medicos);
        renderMedicos();
        renderTablaMedicos();
        modalEdicion.hide();
        formEdicion.reset();
    };

    if (archivoFoto) {
        const reader = new FileReader();
        reader.onload = e => guardarCambios(e.target.result);
        reader.readAsDataURL(archivoFoto);
    } else {
        guardarCambios(medicos[index].foto);
    }
});

export function abrirModalEdicion(medicoId) {
    const medicos = getMedicos();
    const medico = medicos.find(m => m.id === medicoId);
    if (!medico) return;

    document.getElementById('edicionMedicoId').value = medico.id;
    document.getElementById('edicionNombre').value = medico.nombre;
    document.getElementById('edicionEspecialidad').value = medico.especialidad;
    document.getElementById('edicionTelefono').value = medico.telefono;
    document.getElementById('edicionObraSocial').value = medico.obraSocial || "";
    document.getElementById('edicionEmail').value = medico.email;

    const inputFoto = document.getElementById('edicionFoto');
    if (inputFoto) inputFoto.value = "";

    modalEdicion.show();
}
