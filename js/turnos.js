import { obrasSociales } from './data.js';

function getMedicos() {
  return JSON.parse(localStorage.getItem('medicos')) || [];
}


document.addEventListener('DOMContentLoaded', () => {
  const medicoSelect = document.getElementById('medico');
  const obraSelect = document.getElementById('obraSocial');


  // cargar medicos
 const medicos = getMedicos();
 medicos.forEach(medico => {
  const option = document.createElement('option');
  option.value = medico.id;
  option.textContent = `${medico.nombre} ${medico.apellido}`;
  medicoSelect.appendChild(option);
 });


  // cargfar obras socialee
  obrasSociales.forEach(obra => {
    const option = document.createElement('option');
    option.value = obra.id;
    option.textContent = obra.nombre;
    obraSelect.appendChild(option);
  });

  // manejar el envio formulario
  document.getElementById('formTurno').addEventListener('submit', e => {
    e.preventDefault();

    const turno = {
      nombre: document.getElementById('nombre').value.trim(),
      apellido: document.getElementById('apellido').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      email: document.getElementById('email').value.trim(),
      medicoId: parseInt(document.getElementById('medico').value),
      obraSocialId: parseInt(document.getElementById('obraSocial').value),
      fecha: document.getElementById('fecha').value,
      hora: document.getElementById('hora').value
    };

    // guardar  en el localstorafge
    const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    turnos.push(turno);
    localStorage.setItem('turnos', JSON.stringify(turnos));

    document.getElementById('mensajeTurno').innerHTML = `<p class="text-success">Turno solicitado correctamente.</p>`;
    document.getElementById('formTurno').reset();
  });
});


// admin de Turnos
function getTurnos() {
  return JSON.parse(localStorage.getItem('turnos')) || [];
}

function saveTurnos(turnos) {
  localStorage.setItem('turnos', JSON.stringify(turnos));
}

function getNombreMedico(id) {
  const medicos = getMedicos();
  const m = medicos.find(m => m.id === id);
  return m ? `${m.nombre} ${m.apellido}` : '-';
}


function getNombreObra(id) {
  const o = obrasSociales.find(o => o.id === id);
  return o ? o.nombre : '-';
}

function renderTurnos() {
  const tbody = document.querySelector('#tablaTurnos tbody');
  tbody.innerHTML = '';
  const turnos = getTurnos();

  turnos.forEach((t, i) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${t.nombre}</td>
      <td>${t.apellido}</td>
      <td>${t.telefono}</td>
      <td>${t.email}</td>
      <td>${getNombreMedico(t.medicoId)}</td>
      <td>${getNombreObra(t.obraSocialId)}</td>
      <td>${t.fecha}</td>
      <td>${t.hora}</td>
      <td>
        <button class="btn btn-sm btn-primary" data-index="${i}">Editar</button>
        <button class="btn btn-sm btn-danger" data-index="${i}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);

    fila.querySelector('.btn-danger').onclick = () => {
      turnos.splice(i, 1);
      saveTurnos(turnos);
      renderTurnos();
    };

    fila.querySelector('.btn-primary').onclick = () => {
      document.getElementById('editIndex').value = i;
      document.getElementById('editNombre').value = t.nombre;
      document.getElementById('editApellido').value = t.apellido;
      document.getElementById('editTelefono').value = t.telefono;
      document.getElementById('editEmail').value = t.email;
      document.getElementById('editFecha').value = t.fecha;
      document.getElementById('editHora').value = t.hora;
      new bootstrap.Modal(document.getElementById('modalEditarTurno')).show();
    };
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTurnos();

  document.getElementById('formEditarTurno').addEventListener('submit', e => {
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
});


