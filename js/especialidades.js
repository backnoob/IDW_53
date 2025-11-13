import { getEspecialidades, saveEspecialidades } from './storage.js';

let editandoId = null;
let idEspecialidadAEliminar = null;


const tabla = document.getElementById("tablaEspecialidades");
const modal = new bootstrap.Modal(document.getElementById("modalAltaEspecialidad"));
const nombreInput = document.getElementById("nombreEspecialidad");
const guardarBtn = document.getElementById("guardarEspecialidadBtn");
document.addEventListener('DOMContentLoaded', () => {
  renderEspecialidades();  
});

function renderEspecialidades() {
  const lista = getEspecialidades(); 
  const tbody = document.getElementById("tbodyEspecialidades"); 

  tbody.innerHTML = "";  

  lista.forEach(e => {
    tbody.innerHTML += `
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

// Guardar especialidad
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

  saveEspecialidades(lista);  // Guardar las especialidades en localStorage
  renderEspecialidades();  
  modal.hide();  
});

// Editar especialidad
window.editarEspecialidad = (id) => {
  const lista = getEspecialidades();  
  const e = lista.find(x => x.id === id);  
  editandoId = id;  
  nombreInput.value = e.nombre;  
  document.getElementById("modalAltaEspecialidadLabel").textContent = "Editar Especialidad";
  modal.show(); 
};

// Eliminar especialidad
window.eliminarEspecialidad = (id) => {
  const lista = getEspecialidades();
  const esp = lista.find(e => e.id === id);
  idEspecialidadAEliminar = id;
  const texto = esp
    ? `¿Eliminar la especialidad <strong>${esp.nombre}</strong>?`
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




// Inicializar la tabla
renderEspecialidades();
