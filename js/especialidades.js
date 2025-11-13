import { getEspecialidades, saveEspecialidades } from './storage.js';

let editandoId = null;

const tabla = document.getElementById("tablaEspecialidades");
const modal = new bootstrap.Modal(document.getElementById("modalAltaEspecialidad"));
const nombreInput = document.getElementById("nombreEspecialidad");
const guardarBtn = document.getElementById("guardarEspecialidadBtn");
document.addEventListener('DOMContentLoaded', () => {
  renderEspecialidades();  // Llamada a renderizar especialidades al cargar el DOM
});

function renderEspecialidades() {
  const lista = getEspecialidades();  // Obtener las especialidades desde localStorage
  const tbody = document.getElementById("tbodyEspecialidades");  // Obtener el cuerpo de la tabla

  tbody.innerHTML = "";  // Limpiar el contenido de la tabla antes de agregar nuevas filas

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



// Mostrar el modal para agregar una nueva especialidad
document.getElementById("btnAltaEspecialidad").addEventListener("click", () => {
  editandoId = null;
  nombreInput.value = "";  // Limpiar el campo de entrada
  document.getElementById("modalAltaEspecialidadLabel").textContent = "Nueva Especialidad";
  modal.show();  // Mostrar el modal
});

// Guardar especialidad
guardarBtn.addEventListener("click", () => {
  const nombre = nombreInput.value.trim();
  if (!nombre) return alert("Ingresa un nombre");  // Verificar si el nombre no está vacío

  const lista = getEspecialidades();  // Obtener la lista de especialidades
  if (editandoId) {
    // Editar la especialidad existente
    const index = lista.findIndex(e => e.id === editandoId);
    lista[index].nombre = nombre;
  } else {
    // Crear una nueva especialidad
    const nuevoId = lista.length ? lista[lista.length - 1].id + 1 : 1;
    lista.push({ id: nuevoId, nombre });
  }

  saveEspecialidades(lista);  // Guardar las especialidades en localStorage
  renderEspecialidades();  // Volver a renderizar la tabla
  modal.hide();  // Cerrar el modal
});

// Editar especialidad
window.editarEspecialidad = (id) => {
  const lista = getEspecialidades();  // Obtener las especialidades
  const e = lista.find(x => x.id === id);  // Buscar la especialidad por ID
  editandoId = id;  // Establecer la especialidad en edición
  nombreInput.value = e.nombre;  // Cargar el nombre de la especialidad en el input
  document.getElementById("modalAltaEspecialidadLabel").textContent = "Editar Especialidad";  // Cambiar el título del modal
  modal.show();  // Mostrar el modal
};

// Eliminar especialidad
window.eliminarEspecialidad = (id) => {
  if (!confirm("¿Eliminar esta especialidad?")) return;  // Confirmar antes de eliminar
  const lista = getEspecialidades().filter(e => e.id !== id);  // Filtrar la especialidad a eliminar
  saveEspecialidades(lista);  // Guardar los cambios en localStorage
  renderEspecialidades();  // Volver a renderizar la tabla
};

// Inicializar la tabla
renderEspecialidades();
