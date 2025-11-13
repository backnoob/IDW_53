import { getTurnos, saveTurnos, getMedicos, getObrasSociales, getEspecialidades } from "./storage.js";

const filtroMedico = document.getElementById("filtroMedico");
const tablaTurnos = document.getElementById("tablaTurnosUsuario");
const formReserva = document.getElementById("formReserva");
const obraSocialSelect = document.getElementById("obraSocial");
const descuentoInfo = document.getElementById("descuentoInfo");

// Carga inicial
document.addEventListener("DOMContentLoaded", () => {
  cargarMedicos();
  cargarObrasSociales();
  renderTurnos();
});

// --- Cargar médicos ---
function cargarMedicos() {
  const medicos = getMedicos();
  filtroMedico.innerHTML = `<option value="">Seleccione</option>`; // Opción predeterminada
  medicos.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = `${m.nombre} ${m.apellido}`;
    filtroMedico.appendChild(opt);
  });

  filtroMedico.addEventListener("change", renderTurnos); // Cuando se cambia, actualizamos los turnos
}

// --- Cargar obras sociales ---
function cargarObrasSociales() {
  const obras = getObrasSociales();
  obraSocialSelect.innerHTML = `<option value="">Sin obra social</option>`;
  obras.forEach(o => {
    const opt = document.createElement("option");
    opt.value = o.nombre;
    opt.textContent = o.nombre;
    obraSocialSelect.appendChild(opt);
  });
}

// --- Renderizar turnos ---
export function renderTurnos() {
  const medicoId = Number(filtroMedico.value);
  const tbody = tablaTurnos.querySelector("tbody");
  tbody.innerHTML = "";

  if (!medicoId) {
    // Si no hay médico seleccionado, no mostramos nada
    tbody.innerHTML = "<tr><td colspan='4'>Por favor, seleccione un médico para ver los turnos.</td></tr>";
    return;
  }

  const turnos = getTurnos();
  const turnosFiltrados = turnos.filter(t => t.medicoId === medicoId);

  if (turnosFiltrados.length === 0) {
    tbody.innerHTML = "<tr><td colspan='4'>No hay turnos disponibles para este médico.</td></tr>";
  } else {
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

    tbody.querySelectorAll("button[data-id]").forEach(btn => {
      btn.addEventListener("click", () => abrirModalReserva(btn.dataset.id));
    });
  }
}

function abrirModalReserva(idTurno) {
  const id = Number(idTurno);
  const turno = getTurnos().find(t => t.id === id);
  if (!turno) return;

  document.getElementById("idTurno").value = id;

  const medico = getMedicos().find(m => m.id === turno.medicoId);
  const especialidades = getEspecialidades();
  const especialidadNombre = especialidades.find(e => e.id === medico.especialidadId)?.nombre || "Sin especialidad";

  const inputMedico = document.getElementById("medicoSeleccionado");
  const inputEspecialidad = document.getElementById("especialidadSeleccionada");
  const inputPrecio = document.getElementById("precioConsulta");
  const inputNombre = document.getElementById("nombre");
  const inputApellido = document.getElementById("apellido");
  const inputTelefono = document.getElementById("telefono");
  const inputEmail = document.getElementById("email");

  if (inputMedico) inputMedico.value = `${medico.nombre} ${medico.apellido}`;
  if (inputEspecialidad) inputEspecialidad.value = especialidadNombre;
  if (inputPrecio) inputPrecio.value = `$${medico.valorConsulta.toFixed(2)}`;

  inputNombre.value = "";
  inputApellido.value = "";
  inputTelefono.value = "";
  inputEmail.value = "";
  obraSocialSelect.value = "";
  descuentoInfo.textContent = "";

  obraSocialSelect.onchange = () => {
    const obraNombre = obraSocialSelect.value;
    const obra = getObrasSociales().find(o => o.nombre === obraNombre);
    const precioBase = medico.valorConsulta;

    if (obra) {
      const descuento = precioBase * (obra.descuento / 100); // Descuento específico de la obra social
      const precioFinal = precioBase - descuento;
      descuentoInfo.textContent = `Descuento aplicado por ${obraNombre}: (${obra.descuento}%) → precio final $${precioFinal.toFixed(2)}`;
    } else {
      descuentoInfo.textContent = "";
    }
  };
}

// --- Reservar turno ---
formReserva.addEventListener("submit", (e) => {
  e.preventDefault();

  const idTurno = Number(document.getElementById("idTurno").value);
  const turnos = getTurnos();
  const turno = turnos.find(t => t.id === idTurno);

  if (!turno) {
    alert("Error: el turno seleccionado no se encontró.");
    return;
  }

  const medico = getMedicos().find(m => m.id === turno.medicoId);
  const especialidad = getEspecialidades().find(e => e.id === medico.especialidadId)?.nombre || "Sin especialidad";

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const email = document.getElementById("email").value.trim();
  const obra = document.getElementById("obraSocial").value;

  const precioBase = Number(medico.valorConsulta) || 0;

  // Obtener el descuento de la obra social seleccionada
  const obraSeleccionada = getObrasSociales().find(o => o.nombre === obra);
  const porcentajeDescuento = obraSeleccionada ? obraSeleccionada.descuento : 0;
  const descuento = (precioBase * porcentajeDescuento) / 100;
  const precioFinal = precioBase - descuento;

  turno.estado = "reservado";
  turno.paciente = { nombre, apellido, telefono, email };
  turno.obraSocial = obra || "Sin obra social";
  turno.precio = precioFinal;

  saveTurnos(turnos);
  renderTurnos();

  const modal = bootstrap.Modal.getInstance(document.getElementById("modalReservar"));
  if (modal) modal.hide();
  formReserva.reset();
  descuentoInfo.textContent = "";

  //Detalle completo del turno reservado
  const detalle = `
TURNO RESERVADO CON ÉXITO
Médico: ${medico.nombre} ${medico.apellido}
Especialidad: ${especialidad}
Fecha y Hora: ${turno.fecha} - ${turno.hora}Hs.
Obra social: ${obra || "Sin obra social"}
Precio base: $${precioBase.toFixed(2)}
Descuento: ${porcentajeDescuento}% (-$${descuento.toFixed(2)})
Precio final: $${precioFinal.toFixed(2)}
  `;

  alert(detalle);
});
