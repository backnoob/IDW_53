// admin de Turnos
import { medicos, obrasSociales } from './data.js';

function getTurnos() {
  return JSON.parse(localStorage.getItem('turnos')) || [];
}

function saveTurnos(turnos) {
  localStorage.setItem('turnos', JSON.stringify(turnos));
}

function getNombreMedico(id) {
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