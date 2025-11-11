import { inicializarLocalStorage, getMedicos, saveMedicos, getObrasSociales } from './storage.js';
import { renderMedicos, renderTablaMedicos } from './render.js';

let editandoId = null;
let modalAlta;

document.addEventListener('DOMContentLoaded', () => {
  inicializarLocalStorage();
  renderMedicos();
  renderTablaMedicos();

  const btnAltaMedico = document.getElementById('btnAltaMedico');
  const modalElement = document.getElementById('modalAltaMedico');
  modalAlta = new bootstrap.Modal(modalElement);
  const formAlta = document.getElementById('altaMedicoForm');
  const btnGuardarAlta = document.getElementById('guardarAltaBtn');

  // Botón Alta
  btnAltaMedico.addEventListener('click', () => {
    formAlta.reset();
    editandoId = null;
    btnGuardarAlta.textContent = 'Guardar';
    document.getElementById('modalAltaMedicoLabel').textContent = 'Alta de Médico';
    cargarObrasSociales(); // cargar obras sociales al abrir el modal
    modalAlta.show();
  });

  // Botón Guardar
  btnGuardarAlta.addEventListener('click', () => {
    const medicos = getMedicos();

    const obrasSocialesSeleccionadas = Array.from(
      document.getElementById('altaObrasSociales').selectedOptions
    ).map(opt => parseInt(opt.value));

    const datosMedico = {
      matricula: parseInt(document.getElementById('altaMatricula').value) || 0,
      apellido: document.getElementById('altaApellido').value.trim(),
      nombre: document.getElementById('altaNombre').value.trim(),
      especialidadId: parseInt(document.getElementById('altaEspecialidad').value) || 0,
      descripcion: document.getElementById('altaDescripcion').value.trim(),
      obrasSociales: obrasSocialesSeleccionadas,
      valorConsulta: parseFloat(document.getElementById('altaValorConsulta').value) || 0,
      email: document.getElementById('altaEmail').value.trim(),
      foto: "img/default-doctor.jpg"
    };

    const archivoFoto = document.getElementById('altaFoto').files[0];
    if (archivoFoto) {
      const reader = new FileReader();
      reader.onload = e => {
        datosMedico.foto = e.target.result;
        guardarMedico(medicos, datosMedico, formAlta);
      };
      reader.readAsDataURL(archivoFoto);
    } else {
      guardarMedico(medicos, datosMedico, formAlta);
    }
  });
});

// Función para guardar médico (alta o edición)
function guardarMedico(medicos, datosMedico, formAlta) {
  if (editandoId) {
    const index = medicos.findIndex(m => m.id === editandoId);
    if (index !== -1) {
      medicos[index] = { ...medicos[index], ...datosMedico };
    }
  } else {
    const nuevoId = medicos.length ? medicos[medicos.length - 1].id + 1 : 1;
    medicos.push({ id: nuevoId, ...datosMedico });
  }

  saveMedicos(medicos);
  renderMedicos();
  renderTablaMedicos();
  formAlta.reset();
  modalAlta.hide();
  editandoId = null;
}

// Abrir modal para editar
export function abrirModalEdicion(id) {
  const medicos = getMedicos();
  const medico = medicos.find(m => m.id === id);
  if (!medico) return;

  editandoId = id;

  cargarObrasSociales(); // cargar opciones actualizadas
  document.getElementById('altaMatricula').value = medico.matricula || "";
  document.getElementById('altaApellido').value = medico.apellido || "";
  document.getElementById('altaNombre').value = medico.nombre || "";
  document.getElementById('altaEspecialidad').value = medico.especialidadId || "";
  document.getElementById('altaDescripcion').value = medico.descripcion || "";
  document.getElementById('altaValorConsulta').value = medico.valorConsulta || "";
  document.getElementById('altaEmail').value = medico.email || "";

  const selectObras = document.getElementById('altaObrasSociales');
  Array.from(selectObras.options).forEach(opt => {
    opt.selected = medico.obrasSociales?.includes(parseInt(opt.value));
  });

  const btnGuardarAlta = document.getElementById('guardarAltaBtn');
  btnGuardarAlta.textContent = 'Guardar Cambios';
  document.getElementById('modalAltaMedicoLabel').textContent = 'Editar Médico';

  modalAlta.show();
}

window.abrirModalEdicion = abrirModalEdicion;

// Función para cargar obras sociales en el select
function cargarObrasSociales() {
  const select = document.getElementById('altaObrasSociales');
  if (!select) return;
  select.innerHTML = '';
  getObrasSociales().forEach(o => {
    const opt = document.createElement('option');
    opt.value = o.id;
    opt.textContent = o.nombre;
    select.appendChild(opt);
  });
}
