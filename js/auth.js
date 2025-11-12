document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('accessToken');

  const desktopLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const desktopBtn = document.querySelector('.navbar-nav .btn'); // botón Login / Sección Admin

  // Cambiar Login a Sección Admin si hay token
  if (token && desktopBtn) {
    desktopBtn.textContent = 'Sección Admin';
    desktopBtn.href = 'seccionAdmin.html';
  }

  // Marcar link activo (solo links normales, no el botón)
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();
  desktopLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop().toLowerCase();
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'inicio.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Para el botón Sección Admin, no aplicamos active para no romper su color
});

