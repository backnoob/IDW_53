import { getObrasSociales } from './storage.js';

// función para renderizar obras sociales
function renderObrasSociales() {
    console.log('Buscando lista de obras sociales');
    
    const listaObrasSociales = document.getElementById('listaObrasSociales');
    
    if (!listaObrasSociales) {
        console.error('ERROR: No se encontró el elemento con id "listaObrasSociales"');
        console.log('Asegurarse de que en tu HTML exista: <ul id="listaObrasSociales"></ul>');
        return;
    }

    const obrasSociales = getObrasSociales();
    console.log('Obras sociales en localStorage:', obrasSociales);
    
    // limpiar lista existente
    listaObrasSociales.innerHTML = '';

    // si no hay obras sociales, mostrar mensaje
    if (obrasSociales.length === 0) {
        console.log('No hay obras sociales en localStorage');
        listaObrasSociales.innerHTML = `
            <li style="background: #f8f9fa; color: #6c757d; border: 1px dashed #dee2e6;">
                No hay obras sociales disponibles
            </li>
        `;
        return;
    }

    // crear elementos para cada obra social
    obrasSociales.forEach(obra => {
        const li = document.createElement('li');
        li.style.cssText = `
            background: #3b6e69; 
            border: 1px solid #404040; 
            border-radius: 5px; 
            padding: 8px 15px; 
            color: #fff; 
            font-weight: 500;
            margin: 5px;
            display: inline-block;
        `;
        
        li.innerHTML = `
            <a href="#" style="color: inherit; text-decoration: none;" 
               onclick="mostrarModalObraSocial('${obra.nombre}', '${obra.descripcion}', ${obra.descuento || 0})">
                ${obra.nombre}
            </a>
        `;
        listaObrasSociales.appendChild(li);
    });

    console.log('Obras sociales renderizadas correctamente');
}

// función global para mostrar modal
window.mostrarModalObraSocial = function(nombre, descripcion, descuento) {
    const modalContent = document.getElementById('modalObraSocialContent');
    const modalTitle = document.getElementById('obraModalLabel');
    
    if (!modalContent || !modalTitle) {
        console.error('No se encontraron elementos del modal');
        return;
    }
    
    modalTitle.textContent = nombre;
    
    let contenido = `
        <p><strong>Descripción:</strong> ${descripcion}</p>
        <p><strong>Descuento en consultas:</strong> ${descuento}%</p>
    `;
    
    if (parseInt(descuento) === 0) {
        contenido += `<p class="text-muted"><small>Esta obra social no aplica descuentos especiales.</small></p>`;
    } else {
        contenido += `<p class="text-success"><small>¡Aprovecha nuestro ${descuento}% de descuento en consultas!</small></p>`;
    }
    
    modalContent.innerHTML = contenido;
    
    // mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('obraModal'));
    modal.show();
}

// renderizar médicos
function renderMedicos() {
    const contenedor = document.querySelector(".catalogo .row");
    if (!contenedor) {
        console.log('No se encontró contenedor de médicos');
        return;
    }
    
    console.log('Renderizando médicos');
}

document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM cargado - Iniciando aplicación...');
    
    renderObrasSociales();
    
    renderMedicos();
    
    // escuchar eventos de cambio en obras sociales
    document.addEventListener('obrasSocialesActualizadas', () => {
        console.log('Actualizando lista de obras sociales...');
        renderObrasSociales();
    });
});

// exportar funciones para uso externo
export { renderObrasSociales };