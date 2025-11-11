import { getObrasSociales } from './storage.js';

export function renderObrasSociales() {
    console.log('Ejecutando renderObrasSociales');
    
    const listaObrasSociales = document.getElementById('listaObrasSociales');
    
    if (!listaObrasSociales) {
        console.error('No se encontró el elemento con id "listaObrasSociales"');
        return;
    }

    const obrasSociales = getObrasSociales();
    console.log('Obras sociales encontradas:', obrasSociales);
    

    listaObrasSociales.innerHTML = '';

    // si no hay obras sociales, mostrar 
    if (obrasSociales.length === 0) {
        console.log('ℹNo hay obras sociales en localStorage');
        listaObrasSociales.innerHTML = '<li style="color: #666;">No hay obras sociales disponibles</li>';
        return;
    }

    // Crear elementos para cada obra social
    obrasSociales.forEach(obra => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" class="obra-social-link" 
               data-obra-id="${obra.id}" 
               data-obra-nombre="${obra.nombre}" 
               data-obra-descripcion="${obra.descripcion}" 
               data-obra-descuento="${obra.descuento || 0}">
                ${obra.nombre}
            </a>
        `;
        listaObrasSociales.appendChild(li);
    });

    console.log('Obras sociales renderizadas correctamente');
    
    agregarEventListenersObrasSociales();
}

function agregarEventListenersObrasSociales() {
    const linksObras = document.querySelectorAll('#listaObrasSociales .obra-social-link');
    console.log(`Encontrados ${linksObras.length} enlaces de obras sociales`);
    
    linksObras.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const obraNombre = this.getAttribute('data-obra-nombre');
            const obraDescripcion = this.getAttribute('data-obra-descripcion');
            const obraDescuento = this.getAttribute('data-obra-descuento');
            
            console.log('Click en obra social:', obraNombre);
            mostrarModalObraSocial(obraNombre, obraDescripcion, obraDescuento);
        });
    });
}

function mostrarModalObraSocial(nombre, descripcion, descuento) {
    const modalContent = document.getElementById('modalObraSocialContent');
    const modalTitle = document.getElementById('obraModalLabel');
    
    if (!modalContent || !modalTitle) {
        console.error('No se encontraron elementos del modal');
        return;
    }
    
    modalTitle.textContent = nombre;
    
    let contenido = `
        <p><strong>Descripción:</strong> ${descripcion}</p>
        <p><strong>Descuento:</strong> ${descuento}%</p>
    `;
    
    if (parseInt(descuento) === 0) {
        contenido += `<p class="text-muted"><small>Esta obra social no aplica descuentos especiales.</small></p>`;
    } else {
        contenido += `<p class="text-success"><small>¡Aprovecha nuestro ${descuento}% de descuento!</small></p>`;
    }
    
    modalContent.innerHTML = contenido;
}

// ver cambios en obras sociales
document.addEventListener('obrasSocialesActualizadas', () => {
    console.log('Evento obrasSocialesActualizadas recibido');
    renderObrasSociales();
});

// ver cambios storage
window.addEventListener('storage', (e) => {
    if (e.key === 'obrasSociales') {
        console.log('Cambio en localStorage detectado');
        renderObrasSociales();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, iniciando renderObrasSociales');
    renderObrasSociales();
});