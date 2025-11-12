document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.querySelector("#tablaUsuarios tbody");

  try {
    // Hacemos la solicitud a la API para obtener los usuarios
    const response = await fetch("https://dummyjson.com/users");
    const data = await response.json();

    tbody.innerHTML = ""; // Limpiamos la tabla antes de agregar los usuarios

    // Iteramos sobre cada usuario de la respuesta de la API
    data.users.forEach(usuario => {
      const fila = document.createElement("tr");

      // Utilizamos el valor real del rol traído por la API (admin o usuario)
      const rol = usuario.role; // La API ya trae el rol real del usuario

      // Insertamos los datos del usuario en la tabla
      fila.innerHTML = `
        <td>${usuario.id}</td>
        <td>${usuario.firstName}</td>
        <td>${usuario.lastName}</td>
        <td>${usuario.email}</td>
        <td>${usuario.phone || '-'}</td>
        <td>${rol}</td> <!-- Aquí mostramos el rol real -->
      `;

      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-danger py-4">
          <i class="bi bi-exclamation-triangle"></i> Error al cargar usuarios
        </td>
      </tr>
    `;
  }
});
