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

window.editarEspecialidad = (id) => {
  const lista = getEspecialidades();
  const e = lista.find(x => x.id === id);
  editandoId = id;
  nombreInput.value = e.nombre;
  document.getElementById("modalAltaEspecialidadLabel").textContent = "Editar Especialidad";
  modal.show();
};

window.eliminarEspecialidad = (id) => {
  if (!confirm("¿Eliminar esta especialidad?")) return;
  const lista = getEspecialidades().filter(e => e.id !== id);
  saveEspecialidades(lista);
  renderEspecialidades();
};

// Inicializar tabla
renderEspecialidades();
