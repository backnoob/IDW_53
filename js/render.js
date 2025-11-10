import { getMedicos, eliminarMedico } from "./storage.js";
import { abrirModalEdicion } from "./medico.js";
import { especialidades, obrasSociales } from "./data.js";

function getNombreEspecialidad(id) {
  const esp = especialidades.find(e => e.id === id);
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
        <p><strong>Valor:</strong> $${valor.toFixed(2)}</p>
        <button class="btn btn-primary btn-sm" data-id="${medico.id}">Editar</button>
        <button class="btn btn-danger btn-sm" data-id="${medico.id}">Eliminar</button>
      </div>
    `;

    contenedor.appendChild(card);

    card.querySelector(".btn-primary").onclick = () => window.abrirModalEdicion(medico.id);
    card.querySelector(".btn-danger").onclick = () => {
      eliminarMedico(medico.id);
      renderMedicos();
      renderTablaMedicos();
    };
  });
}

// Función para obtener n
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
    fila.querySelector(".btn-danger").onclick = () => {
      eliminarMedico(medico.id);
      renderTablaMedicos();
    };
  });
}
