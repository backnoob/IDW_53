import { getTurnos, saveTurnos, getMedicos, getObrasSociales, getEspecialidades } from "./storage.js";

const filtroMedico = document.getElementById("filtroMedico");
const tablaTurnos = document.getElementById("tablaTurnosUsuario");
const formReserva = document.getElementById("formReserva");
const obraSocialSelect = document.getElementById("obraSocial");
const descuentoInfo = document.getElementById("descuentoInfo");

// Carga inicial de médicos y turnos
document.addEventListener("DOMContentLoaded", () => {
  cargarMedicos();         // Cargar médicos en el select
  cargarObrasSociales();   // Cargar obras sociales
  renderTurnos();          // Renderizar turnos disponibles
});

// --- Cargar médicos ---
function cargarMedicos() {
  const medicos = getMedicos();
  filtroMedico.innerHTML = `<option value="">Seleccione</option>`; // Establecer "Seleccione" como opción por defecto

  medicos.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = `${m.nombre} ${m.apellido}`;
    filtroMedico.appendChild(opt);
  });

  // Mantener la opción "Seleccione" seleccionada por defecto
  filtroMedico.value = ""; // Asegurarse de que "Seleccione" esté seleccionado inicialmente

  filtroMedico.addEventListener("change", renderTurnos);
}

// --- Cargar obras sociales ---
function cargarObrasSociales() {
  const obras = getObrasSociales();
  obraSocialSelect.innerHTML = `<option value="">Sin obra social</option>`; // Opción por defecto

  // Agregar obras sociales al select
  obras.forEach(o => {
    const opt = document.createElement("option");
    opt.value = o.nombre;
    opt.textContent = o.nombre;
    obraSocialSelect.appendChild(opt);
  });
}

// --- Renderizar turnos disponibles ---
export function renderTurnos() {
  const medicoId = Number(filtroMedico.value); // Obtener el id del médico seleccionado
  const tbody = tablaTurnos.querySelector("tbody");
  tbody.innerHTML = ""; // Limpiar la tabla antes de renderizar

  const turnos = getTurnos();

  // Si no se ha seleccionado un médico (valor vacío en el select), no mostrar turnos
  if (!medicoId) {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td colspan="4" class="text-center">Por favor, seleccione un médico.</td>`;
    tbody.appendChild(fila);
    return; // Salir de la función si no hay médico seleccionado
  }

  // Filtrar los turnos por el médico seleccionado
  const turnosFiltrados = turnos.filter(t => t.medicoId === medicoId);

  // Si no hay turnos disponibles para el médico seleccionado, mostrar mensaje
  if (turnosFiltrados.length === 0) {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td colspan="4" class="text-center">No hay turnos disponibles para este médico.</td>`;
    tbody.appendChild(fila);
    return;
  }

  // Renderizar los turnos filtrados
  turnosFiltrados.forEach(turno => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${turno.fecha}</td>
      <td>${turno.hora}</td>
      <td>${turno.estado || "disponible"}</td>
      <td>
        ${turno.estado === "reservado"
          ? `<span class="text-danger">No disponible</span>`
          : `<button class="btn btn-success btn-sm" data-id="${turno.id}" data-bs-toggle="modal" data-bs-target="#modalReservar">Reservar</button>`
        }
      </td>
    `;
    tbody.appendChild(fila);
  });

  // Agregar evento de "Reservar" a cada botón de reserva
  tbody.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", () => abrirModalReserva(btn.dataset.id)); // Abrir modal de reserva
  });
}


// --- Abrir modal de reserva ---
function abrirModalReserva(idTurno) {
  const turno = getTurnos().find(t => t.id === Number(idTurno));
  if (!turno) return;

  document.getElementById("idTurno").value = turno.id; // Establecer el id del turno

  // Obtener datos del médico y especialidad
  const medico = getMedicos().find(m => m.id === turno.medicoId);
  const especialidad = getEspecialidades().find(e => e.id === medico.especialidadId);
  
  // Mostrar datos del médico y especialidad en el formulario
  document.getElementById("medicoSeleccionado").value = `${medico.nombre} ${medico.apellido}`;
  document.getElementById("especialidadSeleccionada").value = especialidad ? especialidad.nombre : "Sin especialidad";
  document.getElementById("precioConsulta").value = `$${medico.valorConsulta.toFixed(2)}`;

  // Limpiar los campos del paciente
  document.getElementById("nombre").value = "";
  document.getElementById("apellido").value = "";
  document.getElementById("telefono").value = "";
  document.getElementById("email").value = "";
  obraSocialSelect.value = "";  // Resetear la obra social
  descuentoInfo.textContent = "";  // Resetear el descuento

  // Calcular descuento cuando se elige una obra social
  obraSocialSelect.onchange = () => {
    const obra = obraSocialSelect.value;
    const precioBase = medico.valorConsulta;

    if (obra) {
      const descuento = precioBase * 0.1; // Descuento del 10%
      const precioFinal = precioBase - descuento;
      descuentoInfo.textContent = `Descuento aplicado por ${obra}: 10% → precio final $${precioFinal.toFixed(2)}`;
    } else {
      descuentoInfo.textContent = "";
    }
  };
}

// --- Reservar turno ---
formReserva.addEventListener("submit", (e) => {
  e.preventDefault();

  const idTurno = Number(document.getElementById("idTurno").value);
  const turno = getTurnos().find(t => t.id === idTurno);

  if (!turno) {
    alert("Error: el turno seleccionado no se encontró.");
    return;
  }

  // Obtener datos del médico y especialidad
  const medico = getMedicos().find(m => m.id === turno.medicoId);
  const especialidad = getEspecialidades().find(e => e.id === medico.especialidadId)?.nombre || "Sin especialidad";

  // Obtener datos del paciente
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const email = document.getElementById("email").value.trim();
  const obra = document.getElementById("obraSocial").value;

  // Calcular precio final con descuento si es que tiene obra social
  const precioBase = Number(medico.valorConsulta) || 0;
  const descuento = obra ? (precioBase * 0.1) : 0;
  const precioFinal = precioBase - descuento;

  // Actualizar estado del turno y datos del paciente
  turno.estado = "reservado";
  turno.paciente = { nombre, apellido, telefono, email };
  turno.obraSocial = obra || "Sin obra social";
  turno.precio = precioFinal;

  // Guardar los cambios en los turnos
  saveTurnos(getTurnos());

  // Renderizar los turnos nuevamente
  renderTurnos();

  // Cerrar el modal y resetear el formulario
  const modal = bootstrap.Modal.getInstance(document.getElementById("modalReservar"));
  if (modal) modal.hide();
  formReserva.reset();
  descuentoInfo.textContent = "";

  // Mostrar los detalles del turno reservado
  const detalle = `
    TURNO RESERVADO CON ÉXITO
    Médico: ${medico.nombre} ${medico.apellido}
    Especialidad: ${especialidad}
    Fecha y Hora: ${turno.fecha} - ${turno.hora}Hs.
    Obra social: ${obra || "Sin obra social"}
    Precio base: $${precioBase.toFixed(2)}
    Descuento: 10% (-$${descuento.toFixed(2)})
    Precio final: $${precioFinal.toFixed(2)}
  `;

  alert(detalle);
});
