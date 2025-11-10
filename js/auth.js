document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('accessToken');
  const currentPage = window.location.pathname;

  if (!token && currentPage.includes('seccionAdmin.html')) {
    window.location.href = 'login.html';
  }
});

  document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('accessToken');

    const desktopMenu = document.querySelector('.nav__menu');
    const desktopLoginLink = desktopMenu.querySelector('a[href="login.html"]');

    const mobileMenu = document.querySelector('.navbar-nav');
    const mobileLoginLink = mobileMenu.querySelector('a[href="login.html"]');

    if (token) {
      if (desktopLoginLink) desktopLoginLink.outerHTML = `<a href="seccionAdmin.html">Sección Admin</a>`;
      if (mobileLoginLink) mobileLoginLink.outerHTML = `<a class="nav-link" href="seccionAdmin.html">Sección Admin</a>`;

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
  });

