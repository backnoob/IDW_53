    const form = document.getElementById('altaMedicoForm');


    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nuevoMedico = {
            nombre: document.getElementById('nombre').value.trim(),
            especialidad: document.getElementById('especialidad').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            obraSocial: document.getElementById('obraSocial').value.trim(),
            email: document.getElementById('email').value.trim(),
            foto: 'img/default-doctor.jpg'
        };

        const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
        nuevoMedico.id = medicos.length + 1;
        medicos.push(nuevoMedico);
        localStorage.setItem('medicos', JSON.stringify(medicos));

        renderMedicos();
        form.reset();
    });


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


    const tablaBody = document.querySelector("#tablaMedicos tbody");

function renderTablaMedicos() {
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    tablaBody.innerHTML = "";

    medicos.forEach(medico => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${medico.id}</td>
            <td>${medico.nombre}</td>
            <td>${medico.especialidad}</td>
            <td>${medico.telefono}</td>
            <td>${medico.obraSocial}</td>
            <td>${medico.email}</td>
        `;
        tablaBody.appendChild(fila);
    });
}

renderMedicos();
renderTablaMedicos();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nuevoMedico = {
        nombre: document.getElementById('nombre').value.trim(),
        especialidad: document.getElementById('especialidad').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        obraSocial: document.getElementById('obraSocial').value.trim(),
        email: document.getElementById('email').value.trim(),
        foto: 'img/default-doctor.jpg'
    };

    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    nuevoMedico.id = medicos.length + 1;
    medicos.push(nuevoMedico);
    localStorage.setItem('medicos', JSON.stringify(medicos));

    renderMedicos();
    renderTablaMedicos();
    form.reset();
});
