import { getEspecialidades, saveEspecialidades } from './storage.js';

let editandoId = null;

const tabla = document.getElementById("tablaEspecialidades");
const modal = new bootstrap.Modal(document.getElementById("modalAltaEspecialidad"));
const nombreInput = document.getElementById("nombreEspecialidad");
const guardarBtn = document.getElementById("guardarEspecialidadBtn");

function renderEspecialidades() {
  const lista = getEspecialidades();
  tabla.querySelector("tbody").innerHTML = "";

  lista.forEach(e => {
    tabla.querySelector("tbody").innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.nombre}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="editarEspecialidad(${e.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarEspecialidad(${e.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

document.getElementById("btnAltaEspecialidad").addEventListener("click", () => {
  editandoId = null;
  nombreInput.value = "";
  document.getElementById("modalAltaEspecialidadLabel").textContent = "Nueva Especialidad";
  modal.show();
});

guardarBtn.addEventListener("click", () => {
  const nombre = nombreInput.value.trim();
  if (!nombre) return alert("Ingresa un nombre");

  const lista = getEspecialidades();
  if (editandoId) {
    const index = lista.findIndex(e => e.id === editandoId);
    lista[index].nombre = nombre;
  } else {
    const nuevoId = lista.length ? lista[lista.length - 1].id + 1 : 1;
    lista.push({ id: nuevoId, nombre });
  }

  saveEspecialidades(lista);
  renderEspecialidades();
  modal.hide();
});


let idEspecialidadAEliminar = null;
window.eliminarEspecialidad = (id) => {
  idEspecialidadAEliminar = id;
  const lista = getEspecialidades();
  const especialidad = lista.find(e => e.id === id);
  const texto = especialidad
    ? `¿Eliminar la especialidad <strong>${especialidad.nombre}</strong>?`
    : `¿Eliminar esta especialidad?`;

  document.getElementById("textoEliminarEspecialidad").innerHTML = texto;

  const modalEliminar = new bootstrap.Modal(document.getElementById("modalEliminarEspecialidad"));
  modalEliminar.show();
};

document.getElementById("btnEliminarEspecialidadConfirmado").addEventListener("click", () => {
  if (idEspecialidadAEliminar !== null) {
    const lista = getEspecialidades().filter(e => e.id !== idEspecialidadAEliminar);
    saveEspecialidades(lista);
    renderEspecialidades();
    idEspecialidadAEliminar = null;
  }

  bootstrap.Modal.getInstance(document.getElementById("modalEliminarEspecialidad")).hide();
});

// Inicializar tabla
renderEspecialidades();
