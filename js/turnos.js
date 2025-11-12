import { getMedicos, getObrasSociales } from './storage.js';

// --- Funciones de almacenamiento de turnos ---
function getTurnos() {
  return JSON.parse(localStorage.getItem('turnos')) || [];
}

// Funcion de horariopos
function actualizarHorariosDisponibles() {
  const fecha = document.getElementById('fecha').value;
  const medicoId = parseInt(document.getElementById('medico').value);
  const horaSelect = document.getElementById('hora');

  const turnos = getTurnos();
  const horarios = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  // Filtrar turnos ya reservados para ese médico y fecha
  const ocupados = turnos
    .filter(t => t.fecha === fecha && t.medicoId === medicoId)
    .map(t => t.hora);

  // Limpiar y volver a cargar opciones disponibles
  horaSelect.innerHTML = '<option value="">Seleccionar hora</option>';
  horarios.forEach(hora => {
    if (!ocupados.includes(hora)) {
      const option = document.createElement('option');
      option.value = hora;
      option.textContent = hora;
      horaSelect.appendChild(option);
    }
  });
}


function saveTurnos(turnos) {
  localStorage.setItem('turnos', JSON.stringify(turnos));
}
document.addEventListener('DOMContentLoaded', () => {
  renderTurnos(); 
});

// --- Renderizado de tabla ---
function renderTurnos() {
  const tbody = document.querySelector('#tablaTurnos tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  const turnos = getTurnos();
  const medicos = getMedicos();
  const obras = getObrasSociales();

  turnos.forEach((t, i) => {
    const medico = medicos.find(m => m.id === t.medicoId);
    const obra = obras.find(o => o.id === t.obraSocialId);

    const valorFinal = t.valorFinal !== undefined
      ? t.valorFinal
      : (medico?.valorConsulta || 0) - ((medico?.valorConsulta || 0) * (obra?.descuento || 0) / 100);

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${t.nombre}</td>
      <td>${t.apellido}</td>
      <td>${t.telefono}</td>
      <td>${t.email}</td>
      <td>${medico ? `${medico.nombre} ${medico.apellido}` : '-'}</td>
      <td>${obra ? obra.nombre : '-'}</td>
      <td>${t.fecha}</td>
      <td>${t.hora}</td>
      <td>$${valorFinal}</td>
      <td>
        <button class="btn btn-sm btn-primary" data-index="${i}">Editar</button>
        <button class="btn btn-sm btn-danger" data-index="${i}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);

    // Eliminar turno
    fila.querySelector('.btn-danger').onclick = () => {
      turnos.splice(i, 1);
      saveTurnos(turnos);
      renderTurnos();
    };

    // Editar turno
    fila.querySelector('.btn-primary').onclick = () => {
      abrirModalEditarTurno(i);
    };
  });
}

// --- Modal de edición ---
function abrirModalEditarTurno(index) {
  const turnos = getTurnos();
  const t = turnos[index];

  document.getElementById('editIndex').value = index;
  document.getElementById('editNombre').value = t.nombre;
  document.getElementById('editApellido').value = t.apellido;
  document.getElementById('editTelefono').value = t.telefono;
  document.getElementById('editEmail').value = t.email;
  document.getElementById('editFecha').value = t.fecha;
  document.getElementById('editHora').value = t.hora;

  const modalEditar = new bootstrap.Modal(document.getElementById('modalEditarTurno'));
  modalEditar.show();
}

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
  const medicoSelect = document.getElementById('medico');
  const obraSelect = document.getElementById('obraSocial');
  const formTurno = document.getElementById('formTurno');
  if (!medicoSelect || !obraSelect || !formTurno) return;

  document.getElementById('fecha').addEventListener('change', actualizarHorariosDisponibles);
  document.getElementById('medico').addEventListener('change', actualizarHorariosDisponibles);

              const fechaInput = document.getElementById('fecha');
              // Establecer mínimo: mañana
              const hoy = new Date();
              hoy.setDate(hoy.getDate() + 1);
              const yyyy = hoy.getFullYear();
              const mm = String(hoy.getMonth() + 1).padStart(2, '0');
              const dd = String(hoy.getDate()).padStart(2, '0');
              fechaInput.min = `${yyyy}-${mm}-${dd}`;

              // Bloquear sábados y domingos
              fechaInput.addEventListener('input', () => {
                const [year, month, day] = fechaInput.value.split('-').map(Number);
                const fecha = new Date(year, month - 1, day);
                const dia = fecha.getDay(); // 0 = domingo, 6 = sábado

                if (dia === 0 || dia === 6) {
                  alert('La atención no está disponible los sábados y domingos');
                  fechaInput.value = '';
                }
              });  

  const medicos = getMedicos();
  const obras = getObrasSociales();

  // Cargar select de médicos
  medicos.forEach(m => {
    const option = document.createElement('option');
    option.value = m.id;
    option.textContent = `${m.nombre} ${m.apellido}`;
    medicoSelect.appendChild(option);
  });

  // Cargar select de obras sociales
  obras.forEach(o => {
    const option = document.createElement('option');
    option.value = o.id;
    option.textContent = `${o.nombre} (${o.descuento || 0}% descuento)`;
    obraSelect.appendChild(option);
  });

  // Envío del formulario de turno
  formTurno.addEventListener('submit', e => {
    e.preventDefault();

    const medicoId = parseInt(medicoSelect.value);
    const obraSocialId = parseInt(obraSelect.value);

    const medico = medicos.find(m => m.id === medicoId);
    const obra = obras.find(o => o.id === obraSocialId);
    if (!medico || !obra) return alert('Seleccione médico y obra social.');

    const valorConsulta = medico.valorConsulta || 0;
    const valorFinal = valorConsulta - (valorConsulta * (obra.descuento || 0) / 100);

    const turno = {
      nombre: document.getElementById('nombre').value.trim(),
      apellido: document.getElementById('apellido').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      email: document.getElementById('email').value.trim(),
      medicoId,
      obraSocialId,
      fecha: document.getElementById('fecha').value,
      hora: document.getElementById('hora').value,
      valorFinal
    };

    const turnos = getTurnos();
    turnos.push(turno);
    saveTurnos(turnos);

    document.getElementById('mensajeTurno').innerHTML = `<p class="text-success">Turno solicitado correctamente. Valor final: $${valorFinal}</p>`;
    
    formTurno.reset();
    actualizarHorariosDisponibles();
    renderTurnos();
  });

  // --- Formulario de edición ---
  const formEditar = document.getElementById('formEditarTurno');
  if (formEditar) {
    formEditar.addEventListener('submit', e => {
      e.preventDefault();
      const index = parseInt(document.getElementById('editIndex').value);
      const turnos = getTurnos();

      turnos[index] = {
        ...turnos[index],
        nombre: document.getElementById('editNombre').value.trim(),
        apellido: document.getElementById('editApellido').value.trim(),
        telefono: document.getElementById('editTelefono').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        fecha: document.getElementById('editFecha').value,
        hora: document.getElementById('editHora').value
      };

      saveTurnos(turnos);
      renderTurnos();
      bootstrap.Modal.getInstance(document.getElementById('modalEditarTurno')).hide();
    });
  }

  renderTurnos();
});
