import {
  inicializarLocalStorage,
  getMedicos,
  saveMedicos,
  getObrasSociales,
  getEspecialidades
} from './storage.js';
import { renderMedicos, renderTablaMedicos } from './render.js';

let editandoId = null;
let modalAlta;

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización y renderizado de datos al cargar la página
  inicializarLocalStorage();
  renderMedicos();
  renderTablaMedicos();

  let idMedicoAEliminar = null;

  // === BOTÓN ELIMINAR ===
  document.addEventListener('click', e => {
    if (e.target.matches('.btn-danger[data-id]')) {
      idMedicoAEliminar = parseInt(e.target.dataset.id);
      const medico = getMedicos().find(m => m.id === idMedicoAEliminar);
      const texto = medico
        ? `¿Desea eliminar a <strong>${medico.nombre} ${medico.apellido}</strong>?`
        : `¿Eliminar este médico?`;
      document.getElementById('textoEliminarMedico').innerHTML = texto;

      const modal = new bootstrap.Modal(document.getElementById('modalEliminarMedico'));
      modal.show();
    }
  });

  // Confirmar eliminación
  document.getElementById('btnEliminarConfirmado').addEventListener('click', () => {
    if (idMedicoAEliminar !== null) {
      const lista = getMedicos().filter(m => m.id !== idMedicoAEliminar);
      saveMedicos(lista);
      renderMedicos();
      renderTablaMedicos();
      idMedicoAEliminar = null;
    }
    bootstrap.Modal.getInstance(document.getElementById('modalEliminarMedico')).hide();
  });

  // === MODAL DE ALTA / EDICIÓN ===
  const btnAltaMedico = document.getElementById('btnAltaMedico');
  const modalElement = document.getElementById('modalAltaMedico');
  modalAlta = new bootstrap.Modal(modalElement);
  const formAlta = document.getElementById('altaMedicoForm');
  const btnGuardarAlta = document.getElementById('guardarAltaBtn');
  const previewFoto = document.getElementById('previewFoto');
  const inputFoto = document.getElementById('altaFoto');

  // Vista previa de imagen (esto se tuvo que hacer para que cargue la imagen que tiene ya cargada
  // en caso de que se edite el médico)
  inputFoto.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file && previewFoto) {
      const reader = new FileReader();
      reader.onload = ev => {
        previewFoto.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Botón Alta
  btnAltaMedico.addEventListener('click', () => {
    formAlta.reset();
    previewFoto.src = "img/default-doctor.jpg";
    editandoId = null;
    btnGuardarAlta.textContent = 'Guardar';
    document.getElementById('modalAltaMedicoLabel').textContent = 'Alta de Médico';

    cargarObrasSociales();
    cargarEspecialidadesEnSelect();

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
      foto: editandoId
        ? getMedicos().find(m => m.id === editandoId)?.foto || "img/default-doctor.jpg"
        : "img/default-doctor.jpg"
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

// === GUARDAR MÉDICO ===
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

// === ABRIR MODAL DE EDICIÓN ===
export function abrirModalEdicion(id) {
  const medicos = getMedicos();
  const medico = medicos.find(m => m.id === id);
  if (!medico) return;

  editandoId = id;
  cargarObrasSociales();
  cargarEspecialidadesEnSelect();

  document.getElementById('altaMatricula').value = medico.matricula || "";
  document.getElementById('altaApellido').value = medico.apellido || "";
  document.getElementById('altaNombre').value = medico.nombre || "";
  document.getElementById('altaEspecialidad').value = medico.especialidadId || "";
  document.getElementById('altaDescripcion').value = medico.descripcion || "";
  document.getElementById('altaValorConsulta').value = medico.valorConsulta || "";
  document.getElementById('altaEmail').value = medico.email || "";

  const preview = document.getElementById('previewFoto');
  if (preview) preview.src = medico.foto || "img/default-doctor.jpg";

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

// === FUNCIONES AUXILIARES ===

// Cargar obras sociales en el select del modal
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

// Cargar especialidades en el select del modal
function cargarEspecialidadesEnSelect() {
  const select = document.getElementById("altaEspecialidad");
  if (!select) return;
  select.innerHTML = '<option value="">Seleccione una especialidad</option>';

  const especialidades = getEspecialidades();
  especialidades.forEach(e => {
    const option = document.createElement("option");
    option.value = e.id;
    option.textContent = e.nombre;
    select.appendChild(option);
  });
}
