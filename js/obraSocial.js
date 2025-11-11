
const btnAltaObraSocial = document.getElementById('btnAltaObraSocial');
const modalObraSocial = new bootstrap.Modal(document.getElementById('modalAltaObraSocial'));
const guardarObraSocialBtn = document.getElementById('guardarObraSocialBtn');
const tablaObras = document.querySelector('#tablaObrasSociales tbody');

function getObrasSociales() {
  return JSON.parse(localStorage.getItem("obrasSociales")) || [];
}

function saveObrasSociales(lista) {
  localStorage.setItem("obrasSociales", JSON.stringify(lista));
}

// notificar cambios a la UI
export function notificarCambioObrasSociales() {
  // Disparar un evento personalizado para notificar el cambio
  const event = new CustomEvent('obrasSocialesActualizadas');
  document.dispatchEvent(event);
}

// renderizar tabla
function renderObrasSociales() {
  const obras = getObrasSociales();
  tablaObras.innerHTML = '';
  obras.forEach(o => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${o.id}</td>
      <td>${o.nombre}</td>
      <td>${o.descripcion}</td>
      <td>${o.descuento}%</td>
      <td>
        <button class="btn btn-primary btn-sm" data-id="${o.id}">Editar</button>
        <button class="btn btn-danger btn-sm" data-id="${o.id}">Eliminar</button>
      </td>`;
    tablaObras.appendChild(fila);
  });
  
  // notificar del cambio
  notificarCambioObrasSociales();
}

// alta obra social
btnAltaObraSocial.addEventListener('click', () => {
  document.getElementById('altaObraSocialForm').reset();
  guardarObraSocialBtn.textContent = 'Guardar';
  modalObraSocial.show();
});

guardarObraSocialBtn.addEventListener('click', () => {
  const nombre = document.getElementById('nombreObraSocial').value.trim();
  const descripcion = document.getElementById('descripcionObraSocial').value.trim();
  const descuento = parseFloat(document.getElementById('descuentoObraSocial').value) || 0;

  if (!nombre) return alert('Ingrese un nombre.');

  const obras = getObrasSociales();
  const nuevoId = obras.length ? obras[obras.length - 1].id + 1 : 1;
  obras.push({ id: nuevoId, nombre, descripcion, descuento });

  saveObrasSociales(obras);
  renderObrasSociales();
  modalObraSocial.hide();
});

// editar obra social
tablaObras.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-primary')) {
    const id = parseInt(e.target.dataset.id);
    const obras = getObrasSociales();
    const obra = obras.find(o => o.id === id);
    if (!obra) return;

    document.getElementById('nombreObraSocial').value = obra.nombre;
    document.getElementById('descripcionObraSocial').value = obra.descripcion;
    document.getElementById('descuentoObraSocial').value = obra.descuento || 0;

    guardarObraSocialBtn.textContent = 'Guardar Cambios';
    modalObraSocial.show();

    const handler = () => {
      obra.nombre = document.getElementById('nombreObraSocial').value.trim();
      obra.descripcion = document.getElementById('descripcionObraSocial').value.trim();
      obra.descuento = parseFloat(document.getElementById('descuentoObraSocial').value) || 0;

      saveObrasSociales(obras);
      renderObrasSociales();
      modalObraSocial.hide();
      guardarObraSocialBtn.textContent = 'Guardar';
      guardarObraSocialBtn.removeEventListener('click', handler);
    };
    guardarObraSocialBtn.addEventListener('click', handler);
  }

  // eliminar obra social
  if (e.target.classList.contains('btn-danger')) {
    const id = parseInt(e.target.dataset.id);
    if (!confirm('¿Está seguro de que desea eliminar esta obra social?')) return;
    
    const obras = getObrasSociales().filter(o => o.id !== id);
    saveObrasSociales(obras);
    renderObrasSociales();
    notificarCambioObrasSociales(); // notificar cambio
  }
});

// inicializar tabla
renderObrasSociales();