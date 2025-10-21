import { getMedicos, eliminarMedico } from './storage.js';

export function renderMedicos(containerSelector = "#medicos-row") {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = "";

    const medicos = getMedicos();
    medicos.forEach(medico => {
        const card = document.createElement("div");
        card.classList.add("col-12", "col-md-6", "col-lg-3");
        card.innerHTML = `
        <div class="card h-100 border-0 shadow-sm rounded-4">

            <img src="${medico.foto || 'img/default-doctor.jpg'}"
                class="card-img-top rounded-top-4"
                alt="Dr. ${medico.nombre}"
                style="height: 250px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-bold">${medico.nombre}</h5>
                <p class="card-text mb-1"><strong>Especialidad:</strong> ${medico.especialidad}</p>
                <p class="card-text mb-2"><strong>Obra social:</strong> ${medico.obraSocial}</p>
                <a href="#" class="btn btn-primary mt-auto rounded-pill">Agendar turno</a>
            </div>
        </div>
        `;
        container.appendChild(card);
    });
}


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
                <button class="btn btn-primary btn-sm editar-btn" data-id="${medico.id}">
                    Editar
                </button>
                <button class="btn btn-success btn-sm eliminar-btn" data-id="${medico.id}">
                    Alta
                </button>
            </td>
        `;
        tablaBody.appendChild(fila);

        const btnEditar = fila.querySelector(".editar-btn");
        btnEditar.addEventListener("click", () => {
            editarMedico(medico.id);
        })
    });

    function editarMedico(id) {

        const medico = medicos.find(m => m.id === id);
        if (!medico) return;

        document.getElementById('edicionMedicoId').value = medico.id;
        document.getElementById('edicionNombre').value = medico.nombre;
        document.getElementById('edicionEspecialidad').value = medico.especialidad;
        document.getElementById('edicionTelefono').value = medico.telefono;
        document.getElementById('edicionObraSocial').value = medico.obraSocial;
        document.getElementById('edicionEmail').value = medico.email;

        document.getElementById('edicionMedicoForm').scrollIntoView({
            behavior: "smooth"
        });
    }

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

