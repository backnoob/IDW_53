import { getMedicos, eliminarMedico } from './storage.js';
import { abrirModalEdicion } from './medico.js';

export function renderMedicos(containerSelector = "#medicos-row") {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = "";
    var medicos = getMedicos();

    for (var i = 0; i < medicos.length; i++) {
        var medico = medicos[i];
        var card = document.createElement("div");
        card.className = "col-12 col-md-6 col-lg-3";
        card.innerHTML = 
            '<div class="card h-100 border-0 shadow-sm rounded-4">' +
            '<img src="' + (medico.foto || 'img/default-doctor.jpg') + 
            '" class="card-img-top rounded-top-4" style="height:250px; object-fit:cover;" alt="Dr. ' + medico.nombre + '">' +
            '<div class="card-body d-flex flex-column">' +
            '<h5 class="card-title fw-bold">' + medico.nombre + '</h5>' +
            '<p class="card-text mb-1"><strong>Especialidad:</strong> ' + medico.especialidad + '</p>' +
            '<p class="card-text mb-2"><strong>Obra social:</strong> ' + medico.obraSocial + '</p>' +
            '<a href="#" class="btn btn-primary mt-auto rounded-pill">Agendar turno</a>' +
            '</div></div>';

        container.appendChild(card);

        var btn = card.querySelector("a");
        btn.onclick = function(e) {
            e.preventDefault();
            alert("Próximamente podrán sacar turno");
        };
    }
}

export function renderTablaMedicos() {
    var tablaBody = document.querySelector("#tablaMedicos tbody");
    if (!tablaBody) return;

    tablaBody.innerHTML = "";
    var medicos = getMedicos();

    for (var i = 0; i < medicos.length; i++) {
        var medico = medicos[i];
        var fila = document.createElement("tr");
        fila.innerHTML = 
            '<td>' + medico.id + '</td>' +
            '<td>' + medico.nombre + '</td>' +
            '<td>' + medico.especialidad + '</td>' +
            '<td>' + medico.telefono + '</td>' +
            '<td>' + medico.obraSocial + '</td>' +
            '<td>' + medico.email + '</td>' +
            '<td>' +
            '<button class="btn btn-danger btn-sm" data-id="' + medico.id + '" data-nombre="' + medico.nombre + '">Eliminar</button> ' +
            '<button class="btn btn-primary btn-sm" data-id="' + medico.id + '">Editar</button>' +
            '</td>';

        tablaBody.appendChild(fila);

        fila.querySelector("button.btn-danger").onclick = function() {
            var id = parseInt(this.dataset.id);
            var nombre = this.dataset.nombre;
            if (confirm("¿Desea eliminar al médico " + nombre + "?")) {
                eliminarMedico(id);
                renderMedicos();
                renderTablaMedicos();
            }
        };

        fila.querySelector("button.btn-primary").onclick = function() {
            var id = parseInt(this.dataset.id);
            abrirModalEdicion(id);
        };
    }
}
