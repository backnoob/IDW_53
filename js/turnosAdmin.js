import { getMedicos, getTurnos, saveTurnos } from "./storage.js";

// --- ELEMENTOS DEL DOM ---
const selectMedico = document.getElementById("medico");
const formTurno = document.getElementById("formTurnoAdmin");
const tablaTurnos = document.querySelector("#tablaTurnos tbody");

// --- FUNCIONES ---
function cargarMedicos() {
  if (!selectMedico) return;
  
  const medicos = getMedicos() || [];

  if (!medicos.length) {
    selectMedico.innerHTML = `<option value="">No hay médicos disponibles</option>`;
    return;
  }

  selectMedico.innerHTML = medicos
    .map(m => `<option value="${m.id}">${m.nombre} ${m.apellido}</option>`)
    .join("");
}

function renderTurnos() {
  if (!tablaTurnos) return;

  const turnos = getTurnos() || [];
  const medicos = getMedicos() || [];

  tablaTurnos.innerHTML = "";

  if (!turnos.length) {
    tablaTurnos.innerHTML = `<tr><td colspan="6" class="text-center">No hay turnos cargados</td></tr>`;
    return;
  }

  turnos.forEach(t => {
    const medico = medicos.find(m => m.id === t.medicoId);
    const nombreMedico = medico ? `${medico.nombre} ${medico.apellido}` : "Desconocido";

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${t.id}</td>
      <td>${nombreMedico}</td>
      <td>${t.fecha}</td>
      <td>${t.hora}</td>
      <td>${t.estado}</td>
      <td>
        <button class="btn btn-danger btn-sm" data-id="${t.id}">Eliminar</button>
      </td>
    `;
    tablaTurnos.appendChild(fila);
  });
}

// --- INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
  cargarMedicos();
  renderTurnos();
});

// --- AGREGAR NUEVO TURNO ---
if (formTurno) {
  formTurno.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!selectMedico) return;

    const medicoId = parseInt(selectMedico.value);
    const fecha = document.getElementById("fecha")?.value;
    const hora = document.getElementById("hora")?.value;

    if (!medicoId || !fecha || !hora) {
      return alert("Por favor, completa todos los campos.");
    }

    const turnos = getTurnos() || [];

    const nuevoTurno = {
      id: turnos.length ? Math.max(...turnos.map(t => t.id)) + 1 : 1,
      medicoId,
      fecha,
      hora,
      paciente: null,
      estado: "disponible"
    };

    turnos.push(nuevoTurno);
    saveTurnos(turnos);
    renderTurnos();

    formTurno.reset();
    alert("✅ Turno agregado correctamente");
  });
}

// --- ELIMINAR TURNO ---
if (tablaTurnos) {
  tablaTurnos.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-danger")) {
      const id = parseInt(e.target.dataset.id);
      const turnos = (getTurnos() || []).filter(t => t.id !== id);
      saveTurnos(turnos);
      renderTurnos();
    }
  });
}
