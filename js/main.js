import { uiMedicos } from './ui.js';

document.addEventListener("DOMContentLoaded", () => {
    uiMedicos(".catalogo .row");
});

import { inicializarLocalStorage } from './storage.js';
inicializarLocalStorage();
