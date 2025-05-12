// Función para mostrar la fecha actual y día de la semana
function mostrarFechaActual() {
    // Objeto de fecha actual
    const fecha = new Date();

    // Nombres de los días de la semana
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Nombres de los meses
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    // Extracción de componentes de la fecha
    const diaSemana = diasSemana[fecha.getDay()];
    const diaMes = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();

    // Formato de fecha en español
    const fechaFormateada = `${diaSemana}, ${diaMes} de ${mes} de ${anio}`;

    // Actualización del elemento en la página
    const elementoFecha = document.getElementById('current-date');
    if (elementoFecha) {
        elementoFecha.textContent = fechaFormateada;
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

document.addEventListener('DOMContentLoaded', function() {
    // Inicialización de funciones principales
    mostrarFechaActual();
    verificarAutenticacion();

    // Inicialización del menú hamburguesa
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Configuración de los enlaces del menú
    setupMenuLinks();

    // Función para animar elementos al aparecer en pantalla durante scroll
    function animateOnScroll() {
        // Elementos con animación de aparición desde abajo
        const fadeUpElements = document.querySelectorAll('.animate-fade-up');

        // Elementos con animación desde la izquierda
        const slideRightElements = document.querySelectorAll('.animate-slide-right');

        // Elementos con animación desde la derecha
        const slideLeftElements = document.querySelectorAll('.animate-slide-left');

        // Elementos con animación de zoom
        const zoomInElements = document.querySelectorAll('.animate-zoom-in');

        // Tarjetas de planes con animación especial
        const planCards = document.querySelectorAll('.plan-card');

        // Función para detectar si un elemento está visible en el viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                // Elemento visible cuando está dentro del 85% superior de la ventana
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
                rect.bottom >= 0
            );
        }

        // Animación de elementos con efecto de aparición desde abajo
        fadeUpElements.forEach(element => {
            // Verificación de visibilidad y estado de animación
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                // Retraso personalizado o valor por defecto
                const delay = element.getAttribute('data-delay') || 0;

                // Aplicación de animación con retraso
                setTimeout(() => {
                    // Estado inicial: invisible y desplazado hacia abajo
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(40px)';
                    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                    // Forzado de reflow para activar la transición
                    void element.offsetWidth;

                    // Estado final: visible y en posición normal
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.classList.add('animated');
                }, delay);
            }
        });

        // Animación de elementos desde la izquierda
        slideRightElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                // Estado inicial: invisible y desplazado a la izquierda
                element.style.opacity = '0';
                element.style.transform = 'translateX(-40px)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                // Forzado de reflow para activar la transición
                void element.offsetWidth;

                // Estado final: visible y centrado
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                element.classList.add('animated');
            }
        });

        // Animación de elementos desde la derecha
        slideLeftElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                // Estado inicial: invisible y desplazado a la derecha
                element.style.opacity = '0';
                element.style.transform = 'translateX(40px)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                // Forzado de reflow para activar la transición
                void element.offsetWidth;

                // Estado final: visible y centrado
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                element.classList.add('animated');
            }
        });

        // Animación de elementos con efecto zoom
        zoomInElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                // Estado inicial: invisible y reducido
                element.style.opacity = '0';
                element.style.transform = 'scale(0.9)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                // Forzado de reflow para activar la transición
                void element.offsetWidth;

                // Estado final: visible y tamaño normal
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                element.classList.add('animated');
            }
        });

        // Animación especial para tarjetas de planes
        planCards.forEach(card => {
            if (isElementInViewport(card) && !card.classList.contains('animated')) {
                // Retraso personalizado para cada tarjeta
                const delay = card.getAttribute('data-delay') || 0;

                // Aplicación de animación con retraso
                setTimeout(() => {
                    // Estado inicial: invisible y desplazado hacia abajo
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(40px)';
                    card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                    // Forzado de reflow para activar la transición
                    void card.offsetWidth;

                    // Estado final: destacado para tarjeta principal
                    card.style.opacity = '1';
                    card.style.transform = card.classList.contains('featured') ? 'scale(1.05)' : 'translateY(0)';
                    card.classList.add('animated');
                }, delay);

                // Efecto hover - entrada del cursor
                card.addEventListener('mouseover', () => {
                    // Transformación según tipo de tarjeta
                    if (card.classList.contains('featured')) {
                        card.style.transform = 'scale(1.05) translateY(-10px)';
                    } else {
                        card.style.transform = 'translateY(-10px)';
                    }
                    // Mejora visual al pasar el cursor
                    card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
                    card.style.borderColor = 'var(--color-accent)';
                });

                // Efecto hover - salida del cursor
                card.addEventListener('mouseout', () => {
                    // Restauración según tipo de tarjeta
                    if (card.classList.contains('featured')) {
                        card.style.transform = 'scale(1.05)';
                    } else {
                        card.style.transform = 'translateY(0)';
                    }
                    // Restauración de estilos visuales
                    card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
                    card.style.borderColor = card.classList.contains('featured') ? 'var(--color-accent)' : 'var(--color-secondary)';
                });
            }
        });
    }

    // Inicialización de elementos animados con opacidad 0
    const allAnimatedElements = document.querySelectorAll('.animate-fade-up, .animate-slide-right, .animate-slide-left, .animate-zoom-in, .plan-card');
    allAnimatedElements.forEach(element => {
        element.style.opacity = '0';
    });

    // Activación de animaciones al cargar y durante scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Navegación suave para enlaces de tarjetas de servicios
    const itemLinks = document.querySelectorAll('.item-link');
    itemLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Navegación suave para todos los enlaces internos
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            // Omisión de enlaces vacíos
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Desplazamiento suave hasta el elemento destino
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Configuración del botón de contacto
    const scrollToContactBtn = document.getElementById('scroll-to-contact');
    if (scrollToContactBtn) {
        scrollToContactBtn.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                // Desplazamiento suave hasta la sección de contacto
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Validación del formulario de contacto
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Verificar si el checkbox de política de privacidad está marcado
            const privacyCheckbox = document.getElementById('privacy-policy');
            const privacyError = document.getElementById('privacy-error');
            const formMessage = document.getElementById('form-message');

            if (!privacyCheckbox.checked) {
                // Mostrar mensaje de error
                privacyError.textContent = 'Por favor, acepta la política de privacidad para continuar.';
                privacyError.classList.add('active');
                return;
            } else {
                // Ocultar mensaje de error si estaba visible
                privacyError.textContent = '';
                privacyError.classList.remove('active');
            }

            // Si llegamos aquí, el formulario es válido
            // Simulamos el envío del formulario
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            // Simulamos un tiempo de procesamiento
            setTimeout(() => {
                // Mostrar mensaje de éxito
                formMessage.textContent = '¡Mensaje enviado con éxito! Te contactaremos pronto.';
                formMessage.className = 'form-message success';

                // Resetear el formulario
                contactForm.reset();

                // Restaurar el botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'ENVIAR MENSAJE <i class="fas fa-paper-plane"></i>';

                // Ocultar el mensaje después de 5 segundos
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }
});

