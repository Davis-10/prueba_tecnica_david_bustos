// Función para controlar el menú hamburguesa
function toggleMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Bloquear scroll cuando el menú está abierto
        document.body.classList.toggle('menu-open');
    }
}

// Función para cerrar el menú al hacer clic en un enlace
function setupMenuLinks() {
    const navLinks = document.getElementById('nav-links');
    const menuToggle = document.getElementById('menu-toggle');

    if (navLinks && menuToggle) {
        const links = navLinks.querySelectorAll('a');

        links.forEach(link => {
            link.addEventListener('click', () => {
                // Solo cerrar el menú en dispositivos móviles
                if (window.innerWidth <= 767) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    }
}

// Función para verificar autenticación y actualizar la interfaz
function verificarAutenticacion() {
    // Obtención de datos de sesión
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // Verificación de sesión activa
    if (token && user) {
        // Modificación del botón de login
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.textContent = 'Mi Dashboard';
            loginBtn.href = 'dashboard.html';
        }
    }
}

// Función para manejar la selección de plan
function handlePlanSelection(plan) {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (token) {
        // Si está autenticado, guardar el plan seleccionado y redirigir al pago
        const user = JSON.parse(localStorage.getItem('user'));
        user.plan_seleccionado = plan;
        localStorage.setItem('user', JSON.stringify(user));

        // Actualizar también en el localstorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex].plan_seleccionado = plan;
            localStorage.setItem('users', JSON.stringify(users));
        }

        window.location.href = 'payment.html';
    } else {
        // Si no está autenticado, redirigir al registro con el plan seleccionado
        window.location.href = `auth/register.html?plan=${plan}`;
    }
}

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // Verificación de autenticación
    verificarAutenticacion();

    // Inicialización del menú hamburguesa
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Configuración de los enlaces del menú
    setupMenuLinks();
});
