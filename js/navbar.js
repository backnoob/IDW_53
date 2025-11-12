document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('accessToken');

  const desktopMenu = document.querySelector('.nav__menu');
  const mobileMenu = document.querySelector('.navbar-nav');

  // Cambiar Login a Sección Admin si hay token
  const desktopLoginLink = desktopMenu.querySelector('a[href="login.html"]');
  const mobileLoginLink = mobileMenu.querySelector('a[href="login.html"]');

  if (token) {
    if (desktopLoginLink) desktopLoginLink.outerHTML = `<a href="seccionAdmin.html">Sección Admin</a>`;
    if (mobileLoginLink) mobileLoginLink.outerHTML = `<a class="nav-link" href="seccionAdmin.html">Sección Admin</a>`;

    // Botones Cerrar sesión
    const logoutDesktop = document.createElement('li');
    logoutDesktop.classList.add('nav__menu__hijo');
    logoutDesktop.innerHTML = `<a href="#" id="logoutBtn">Cerrar sesión</a>`;
    desktopMenu.appendChild(logoutDesktop);

    const logoutMobile = document.createElement('li');
    logoutMobile.classList.add('nav-item');
    logoutMobile.innerHTML = `<a class="nav-link" href="#" id="logoutBtnMobile">Cerrar sesión</a>`;
    mobileMenu.appendChild(logoutMobile);

    const logout = () => {
      sessionStorage.removeItem('accessToken');
      window.location.href = 'inicio.html';
    };

    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('logoutBtnMobile').addEventListener('click', logout);
  }

  const currentPath = window.location.pathname.split('/').pop().toLowerCase();

  document.querySelectorAll('.nav__menu a, .navbar-nav a').forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop().toLowerCase();
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'inicio.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const role = sessionStorage.getItem("role");

  // Si el usuario es admin, ocultar el link de Turnos
  if (role && role.toLowerCase() === "admin") {
    const turnosLink = document.querySelector('a[href*="turnos"]');
    if (turnosLink) {
      turnosLink.style.display = "none";
    }
  }
});