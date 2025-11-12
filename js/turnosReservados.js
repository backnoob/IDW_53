import { getTurnos, getMedicos } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  renderTurnosReservados();
});

function renderTurnosReservados() {
  const tabla = document.querySelector("#tablaTurnos tbody");
  if (!tabla) return;

  const turnos = getTurnos() || [];
  const medicos = getMedicos() || [];

  // Filtrar solo los turnos con estado "reservado"
  const turnosReservados = turnos.filter(t => t.estado === "reservado");

  tabla.innerHTML = "";

  if (turnosReservados.length === 0) {
    tabla.innerHTML = `<tr><td colspan="9" class="text-center">No hay turnos reservados</td></tr>`;
    return;
  }

  turnosReservados.forEach(turno => {
    const medico = medicos.find(m => m.id === turno.medicoId);
    const nombreMedico = medico ? `${medico.nombre} ${medico.apellido}` : "Desconocido";
    const precio = turno.precio ?? medico?.valorConsulta ?? 0;
    const paciente = turno.paciente ? `${turno.paciente.nombre} ${turno.paciente.apellido}` : "-";
    const obraSocial = turno.obraSocial || "Sin obra social";

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${turno.id}</td>
      <td>${nombreMedico}</td>
      <td>${turno.fecha}</td>
      <td>${turno.hora}</td>
      <td>${paciente}</td>
      <td>${obraSocial}</td>
      <td>$${precio}</td>
      <td><span class="badge bg-warning text-dark text-capitalize">${turno.estado}</span></td>
      <td>
        <button class="btn btn-primary btn-sm" data-id="${turno.id}">Editar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}
