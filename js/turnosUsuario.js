import { getMedicos, getEspecialidades, getObrasSociales, getTurnos, saveTurnos } from './storage.js';

document.addEventListener("DOMContentLoaded", () => {
  const selectMedico = document.getElementById("filtroMedico");
  const tbody = document.querySelector("#tablaTurnosUsuario tbody");
  const modalReservaEl = document.getElementById("modalReservar");
  const modalReserva = new bootstrap.Modal(modalReservaEl);
  const formReserva = document.getElementById("formReserva");
  const obraSelect = document.getElementById("obraSocial");
  const descuentoInfo = document.getElementById("descuentoInfo");

  const medicos = getMedicos();
  const obras = getObrasSociales();
  let turnos = getTurnos();
  const especialidad = getEspecialidades();

  // --- Cargar médicos en el select ---
  medicos.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = `${m.nombre} ${m.apellido}`;
    selectMedico.appendChild(opt);
  });

  // --- Cargar obras sociales en el modal ---
  obras.forEach(o => {
    const opt = document.createElement("option");
    opt.value = o.id;
    opt.textContent = o.nombre;
    obraSelect.appendChild(opt);
  });

  // --- Renderizar tabla de turnos ---
  function renderTurnos(medicoId) {
    tbody.innerHTML = "";
    const filtrados = turnos.filter(t => t.medicoId == medicoId && t.estado === "disponible");

    if (filtrados.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center">No hay turnos disponibles</td></tr>`;
      return;
    }

    filtrados.forEach(t => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${t.fecha}</td>
        <td>${t.hora}</td>
        <td>${t.estado}</td>
        <td><button class="btn btn-sm btn-primary reservar-btn" data-id="${t.id}">Reservar</button></td>
      `;
      tbody.appendChild(fila);
    });
  }

  // --- Actualizar descuento y valor final ---
  function actualizarDescuento() {
    const turnoId = Number(document.getElementById("idTurno").value);
    const turno = turnos.find(t => t.id === turnoId);
    const obraId = Number(obraSelect.value);
    if (!turno || !obraId) {
      descuentoInfo.textContent = "";
      return;
    }
    const medico = medicos.find(m => m.id === turno.medicoId);
    const obra = obras.find(o => o.id === obraId);
    if (!medico || !obra) return;

    const descuento = obra.descuento * 100; // 0.1 → 10%
    const total = medico.valorConsulta * (1 - obra.descuento);
    descuentoInfo.textContent = `Descuento: ${descuento}% - Valor final: $${total.toFixed(2)}`;
  }

  obraSelect.addEventListener("change", actualizarDescuento);

  // --- Filtrar turnos al cambiar médico ---
  selectMedico.addEventListener("change", e => {
    renderTurnos(e.target.value);
  });

  // --- Abrir modal al reservar ---
  tbody.addEventListener("click", e => {
    if (e.target.classList.contains("reservar-btn")) {
      const id = Number(e.target.dataset.id);
      document.getElementById("idTurno").value = id;

      // Resetear campos
      formReserva.reset();
      actualizarDescuento();
      modalReserva.show();
    }
  });

  // --- Confirmar reserva ---
  formReserva.addEventListener("submit", e => {
    e.preventDefault();
    const id = Number(document.getElementById("idTurno").value);
    const turno = turnos.find(t => t.id === id);
    if (!turno) return alert("Turno no encontrado");

    const paciente = {
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      telefono: document.getElementById("telefono").value,
      email: document.getElementById("email").value
    };
    const obraSocialId = Number(obraSelect.value);
    const obra = obras.find(o => o.id === obraSocialId);
    const medico = medicos.find(m => m.id === turno.medicoId);

    const descuento = obra ? obra.descuento : 0;
    const total = medico.valorConsulta * (1 - descuento);

    turno.paciente = paciente;
    turno.obraSocialId = obraSocialId;
    turno.estado = "reservado";
    turno.total = total;

    saveTurnos(turnos);
    modalReserva.hide();
    renderTurnos(selectMedico.value);

    alert(`✅ Turno reservado con éxito\nMédico: ${medico.nombre} ${medico.apellido}\nEspecialidad: ${especialidad[medico.especialidadId]}\nFecha: ${turno.fecha} - ${turno.hora}\nValor final: $${total.toFixed(2)} (${descuento > 0 ? "con descuento" : "sin descuento"})`);
  });

});
