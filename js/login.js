async function loginUser(username, password) {
  try {
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    console.log('Respuesta de la API:', data);

    const messageDiv = document.getElementById('message');

    if (response.ok) {
      // Mostrar mensaje de bienvenida
      messageDiv.innerHTML = `<p class="success">Bienvenido, ${data.firstName} ${data.lastName}</p>`;

      // Guardar el accessToken en sessionStorage (según requerimiento)
      sessionStorage.setItem('accessToken', data.accessToken);
      console.log('AccessToken guardado en sessionStorage:', data.accessToken);

      // Redirigir al panel de administración
      window.location.href = 'seccionAdmin.html';
    } else {
      // Mostrar mensaje de error si las credenciales son incorrectas
      messageDiv.innerHTML = `<p class="error">${data.message || 'Credenciales incorrectas'}</p>`;
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('message').innerHTML = '<p class="error">Error de conexión</p>';
  }
}

// Escuchar el envío del formulario
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Ejecutar función de login
  loginUser(username, password);
});
