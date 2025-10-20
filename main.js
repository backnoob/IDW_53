import { medicosIniciales } from './data.js';

    if (!localStorage.getItem('medicos')) {
        localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
    }

    const container = document.querySelector(".catalogo .row");
    function renderMedicos() {
        container.innerHTML = "";
        const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
        medicos.forEach(medico => {
            const card = document.createElement("div");
            card.classList.add("col-12", "col-md-6", "col-lg-4");
            card.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${medico.foto || 'img/default-doctor.jpg'}" class="card-img-top" alt="Dr. ${medico.nombre}" style="height: 250px; object-fit: cover;">
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

    renderMedicos();



