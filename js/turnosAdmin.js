import { getMedicos, getTurnos, saveTurnos } from "./storage.js";

const selectMedico = document.getElementById("medico");
const formTurno = document.getElementById("formTurnoAdmin");
const tablaTurnos = document.querySelector("#tablaTurnos tbody");
let idTurnoAEliminar = null;

document.addEventListener("DOMContentLoaded", () => {
  cargarMedicos();
  renderTurnos();
  cargarHorarios();

  const fechaInput = document.getElementById("fecha");
  if (fechaInput) {
    const hoy = new Date().toISOString().split("T")[0];
    fechaInput.setAttribute("min", hoy);
  }
});

// --- Cargar médicos ---
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

// --- Renderizar turnos ---
function renderTurnos() {
  if (!tablaTurnos) return;

  const turnos = getTurnos() || [];
  const medicos = getMedicos() || [];

  tablaTurnos.innerHTML = "";

  if (!turnos.length) {
    tablaTurnos.innerHTML = `<tr><td colspan="8" class="text-center">No hay turnos cargados</td></tr>`;
    return;
  }

  turnos.forEach(t => {
    const medico = medicos.find(m => m.id === t.medicoId);
    const nombreMedico = medico ? `${medico.nombre} ${medico.apellido}` : "Desconocido";
    const precio = t.precio ?? medico?.valorConsulta ?? 0;
    const obraSocial = t.obraSocial && t.obraSocial.trim() !== "" ? t.obraSocial : "Sin obra social";
    const nombrePaciente = t.paciente ? `${t.paciente.nombre} ${t.paciente.apellido}` : "-";

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${t.id}</td>
      <td>${nombreMedico}</td>
      <td>${t.fecha}</td>
      <td>${t.hora}</td>
      <td>${nombrePaciente}</td>
      <td>${obraSocial}</td>
      <td>$${precio.toFixed(2)}</td>
      <td>
        <span class="badge bg-${t.estado === "disponible" ? "success" :
        t.estado === "reservado" ? "warning text-dark" :
          t.estado === "cancelado" ? "secondary" :
            "info"
      } text-capitalize">
          ${t.estado}
        </span>
      </td>
      <td>
        <button class="btn btn-danger btn-sm" data-id="${t.id}">Eliminar</button>
      </td>
    `;
    tablaTurnos.appendChild(fila);
  });

  // Asignar el evento de eliminación a cada botón "Eliminar"
  document.querySelectorAll('.btn-danger').forEach(btn => {
    btn.removeEventListener('click', handleDeleteClick); // Eliminar listeners previos
    btn.addEventListener('click', handleDeleteClick);
  });
}
// --- Evento de eliminación de turno ---
function handleDeleteClick(e) {
  const idTurno = parseInt(e.target.dataset.id);
  const turno = getTurnos().find(t => t.id === idTurno);
  const medico = getMedicos().find(m => m.id === turno?.medicoId);
  const texto = turno && medico
    ? `¿Eliminar el turno del Dr. <strong>${medico.nombre} ${medico.apellido}</strong> el <strong>${turno.fecha}</strong> a las <strong>${turno.hora}</strong>?`
    : `¿Eliminar este turno?`;

  // Mostrar el modal de confirmación
  document.getElementById("textoEliminarTurno").innerHTML = texto;

  const modalElement = document.getElementById("modalEliminarTurno");
  const modal = new bootstrap.Modal(modalElement);

  // Mostrar el modal (solo si no está ya abierto)
  if (!modalElement.classList.contains('show')) {
    modal.show();
  }

  // **Eliminar cualquier listener anterior** para evitar duplicación
  const btnConfirmar = document.getElementById("btnEliminarTurnoConfirmado");

  // Limpiar cualquier listener previo para evitar duplicación
  btnConfirmar.removeEventListener("click", confirmEliminarTurno);

  // Agregar listener para la confirmación de eliminación
  btnConfirmar.addEventListener("click", confirmEliminarTurno);

  // **Evento que se ejecuta cuando se confirma la eliminación**
  function confirmEliminarTurno() {
    if (idTurno !== null) {
      const turnos = getTurnos().filter(t => t.id !== idTurno); // Filtra el turno
      saveTurnos(turnos); // Guarda los cambios
      renderTurnos(); // Actualiza la tabla
    }

    // **Cerrar el modal correctamente**
    modal.hide();  // Cierra el modal de manera adecuada

    // Limpiar el idTurnoAEliminar
    idTurnoAEliminar = null;

    // **Liberar la instancia del modal para evitar la pantalla negra**
    modal.dispose(); // Asegura que se elimine la instancia del modal

    // Asegurarse de que no queden instancias abiertas del modal
    modalElement.classList.remove('show'); // Elimina la clase 'show'
    modalElement.style.display = 'none'; // Establece display: none en el modal
  }
}


// --- Cargar horarios ---
function cargarHorarios() {
  const horaSelect = document.getElementById("hora");
  if (!horaSelect) return;

  horaSelect.innerHTML = "";
  for (let h = 8; h <= 16; h++) {
    horaSelect.innerHTML += `<option value="${h.toString().padStart(2, '0')}:00">${h}:00</option>`;
    horaSelect.innerHTML += `<option value="${h.toString().padStart(2, '0')}:30">${h}:30</option>`;
  }
  horaSelect.innerHTML += `<option value="17:00">17:00</option>`;
}

// --- Agregar turno ---
if (formTurno) {
  formTurno.addEventListener("submit", (e) => {
    e.preventDefault();

    const medicoId = parseInt(selectMedico.value);
    const fecha = document.getElementById("fecha")?.value;
    const hora = document.getElementById("hora")?.value;

    if (!medicoId || !fecha || !hora) {
      return alert("Por favor, completa todos los campos.");
    }

    const turnos = getTurnos() || [];
    const medico = getMedicos().find(m => m.id === medicoId);

    const turnoExistente = turnos.find(t => t.medicoId === medicoId && t.fecha === fecha && t.hora === hora);

    if (turnoExistente) {
      return alert("Este médico ya tiene reservado este horario.");
    }

    const nuevoTurno = {
      id: Date.now(),
      medicoId,
      fecha,
      hora,
      paciente: "",
      obraSocial: "",
      precio: 0,
      estado: document.getElementById("estado").value
    };

    turnos.push(nuevoTurno);
    saveTurnos(turnos);
    renderTurnos();
    formTurno.reset();
    alert(" Turno agregado correctamente");
  });
}
