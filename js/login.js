async function loginUser(username, password) {
  try {
    //Primero hacemos el login aca basicamenmte vemos si el usuario que va a loguear esta 
    //en la lista del doomy como administrador y si esta loguea, sino lo patea
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    const messageDiv = document.getElementById('message');

    if (!response.ok) {
      messageDiv.innerHTML = `<p class="error">${data.message || 'Credenciales incorrectas'}</p>`;
      return;
    }

    const userResponse = await fetch(`https://dummyjson.com/users/${data.id}`);
    const userData = await userResponse.json();

    if (userData.role && userData.role.toLowerCase() === 'admin') {
      messageDiv.innerHTML = `<p class="success">Bienvenido, ${userData.firstName} ${userData.lastName}</p>`;
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('role', userData.role);
      sessionStorage.setItem('user', JSON.stringify(userData));

      window.location.href = 'inicio.html';
    } else {
      messageDiv.innerHTML = `<p class="error">Acceso denegado. Solo los administradores pueden ingresar.</p>`;
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('message').innerHTML = '<p class="error">Error de conexión</p>';
  }
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  loginUser(username, password);
});

