import { getMedicos, eliminarMedico } from './storage.js';

// Renderiza las cards de médicos
export function renderMedicos(containerSelector = ".catalogo .row") {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = "";

    const medicos = getMedicos();
    medicos.forEach(medico => {
        const card = document.createElement("div");
        card.classList.add("col-12", "col-md-6", "col-lg-4");
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${medico.foto || 'img/default-doctor.jpg'}"
                     class="card-img-top"
                     alt="Dr. ${medico.nombre}"
                     style="height: 250px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">Dr. ${medico.nombre}</h5>
                    <p class="card-text"><strong>Especialidad:</strong> ${medico.especialidad}</p>
                    <p class="card-text"><strong>Obra social:</strong> ${medico.obraSocial}</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Renderiza la tabla de administración
export function renderTablaMedicos() {
    const tablaBody = document.querySelector("#tablaMedicos tbody");
    if (!tablaBody) return;

    tablaBody.innerHTML = "";

    const medicos = getMedicos();
    medicos.forEach(medico => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${medico.id}</td>
            <td>${medico.nombre}</td>
            <td>${medico.especialidad}</td>
            <td>${medico.telefono}</td>
            <td>${medico.obraSocial}</td>
            <td>${medico.email}</td>
            <td>
                <button class="btn btn-danger btn-sm eliminar-btn" data-id="${medico.id}"data-nombre="${medico.nombre}">Eliminar</button>
                <button class="btn btn-primary btn-sm editar-btn" data-id="${medico.id}">Editar</button>
                <button class="btn btn-success btn-sm alta-btn" data-id="${medico.id}">Alta</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });

    // Evento eliminar

    document.querySelectorAll(".eliminar-btn").forEach(boton => {
    boton.addEventListener("click", e => {
    const id = parseInt(e.target.dataset.id);
    const nombre = e.target.dataset.nombre;
    const confirmar = confirm(`¿Desea eliminar al médico ${nombre}?`);
        if (confirmar) {
            eliminarMedico(id);
            renderTablaMedicos();
            renderMedicos();
        }
        });
    });

}
