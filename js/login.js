// login.js
async function loginUser(username, password) {
  try {
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    const messageDiv = document.getElementById('message');

    if (response.ok) {
      messageDiv.innerHTML = `<p class="success">Bienvenido, ${data.firstName} ${data.lastName}</p>`;
      sessionStorage.setItem('accessToken', data.accessToken);
      window.location.href = 'seccionAdmin.html';
    } else {
      messageDiv.innerHTML = `<p class="error">${data.message || 'Credenciales incorrectas'}</p>`;
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
