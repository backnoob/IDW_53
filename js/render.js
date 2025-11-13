import { getMedicos, eliminarMedico } from "./storage.js";
import { abrirModalEdicion } from "./medico.js";
import { obrasSociales } from "./data.js";
import { getEspecialidades } from './storage.js';  

function getNombreEspecialidad(id) {
  const especialidades = getEspecialidades();
  console.log("Especialidades disponibles:", especialidades);  

  const esp = especialidades.find(e => e.id === id);
  console.log(`Buscando especialidad con ID: ${id}`);
  console.log(`Especialidad encontrada: ${esp ? esp.nombre : '-'}`);
  return esp ? esp.nombre : '-';
}

function getNombresObrasSociales(ids = []) {
  return ids.map(id => {
    const os = obrasSociales.find(o => o.id === id);
    return os ? os.nombre : '-';
  }).join(', ');
}
export function renderMedicos() {
  const contenedor = document.getElementById("cardsMedicos");
  if (!contenedor) return;

  const medicos = getMedicos();
  contenedor.innerHTML = "";

  medicos.forEach(medico => {
    const card = document.createElement("div");
    card.className = "card text-center p-3 m-2";
    card.style.width = "18rem";

    const valor = Number(medico.valorConsulta) || 0;
    const descripcion = medico.descripcion || "";
    const foto = medico.foto || "img/default-doctor.jpg";

    card.innerHTML = `
      <img src="${foto}" class="card-img-top" alt="${medico.nombre}">
      <div class="card-body">
        <h5 class="card-title">${medico.nombre} ${medico.apellido}</h5>
        <p class="card-text">${descripcion}</p>
        <p><strong>Valor de consulta:</strong> $${valor.toFixed(2)}</p>
     
      </div>
    `;

    contenedor.appendChild(card);

  });
}

// esta renderiza la tabla medicos de la vista admin
export function renderTablaMedicos() {
  const tabla = document.getElementById("tablaMedicos");
  if (!tabla) return;

  const tbody = tabla.querySelector("tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const medicos = getMedicos();

  medicos.forEach(medico => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${medico.id}</td>
      <td>${medico.nombre}</td>
      <td>${medico.apellido}</td>
<td>${getNombreEspecialidad(medico.especialidadId)}</td>
      <td>${medico.matricula || '-'}</td>
      <td>$${(Number(medico.valorConsulta) || 0).toFixed(2)}</td>
      <td>${getNombresObrasSociales(medico.obrasSociales)}</td>
      <td>${medico.email || '-'}</td>
      <td>${medico.descripcion || '-'}</td>
      <td>
        <button class="btn btn-primary btn-sm" data-id="${medico.id}">Editar</button>
        <button class="btn btn-danger btn-sm" data-id="${medico.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);

    fila.querySelector(".btn-primary").onclick = () => abrirModalEdicion(medico.id);
    
    fila.querySelector(".btn-danger").onclick = () => mostrarModalEliminar(medico.id);

  });
}

// render.js

import { getObrasSociales } from './storage.js';  // Importa la función solo una vez

document.addEventListener("DOMContentLoaded", () => {
  renderizarObrasSociales();
});

// Función para renderizar las obras sociales en el <ul> de la sección "ObraSocial"
function renderizarObrasSociales() {
  const listaObrasSociales = document.getElementById("listaObrasSociales");

  const obrasSociales = getObrasSociales();

  // Limpiar la lista antes de llenarla
  listaObrasSociales.innerHTML = '';

  // Verificamos si hay obras sociales para mostrar
  if (obrasSociales.length > 0) {
    obrasSociales.forEach(obra => {
      // Crear un nuevo <li> para cada obra social
      const li = document.createElement("li");
      li.classList.add("obra-social-item");
      li.innerHTML = `
        <h3>${obra.nombre}</h3>
        <p>${obra.descripcion}</p>
        <p><strong>Descuento:</strong> ${obra.descuento}%</p>
      `;
      // Añadir el <li> a la lista
      listaObrasSociales.appendChild(li);
    });
  }
}
