// Precios mensuales de cada plan de suscripción
const PLAN_PRICES = {
    'basic': 29.99,    // Plan básico: 29.99€ al mes
    'goup': 49.99,     // Plan intermedio: 49.99€ al mes
    'expert': 79.99    // Plan experto: 79.99€ al mes
};

// Duración de cada plan de suscripción
const PLAN_DURATIONS = {
    'basic': '1 mes',     // Plan básico: duración de 1 mes
    'goup': '3 meses',    // Plan intermedio: duración de 3 meses
    'expert': '6 meses'   // Plan experto: duración de 6 meses
};

// Función para formatear precios con símbolo $ y dos decimales
const formatPrice = (price) => `$${price.toFixed(2)}`;

// Inicialización de la página de pago
document.addEventListener('DOMContentLoaded', () => {
    // Datos del usuario desde almacenamiento local
    const user = JSON.parse(localStorage.getItem('user'));

    // Redirección si no hay usuario o plan seleccionado
    if (!user || !user.plan_seleccionado) {
        window.location.href = 'planes.html';
        return;
    }

    // Detalles del plan seleccionado
    const plan = user.plan_seleccionado.toLowerCase();
    const price = PLAN_PRICES[plan];
    const duration = PLAN_DURATIONS[plan];

    // Actualización de la información del plan en la página
    // Primera letra en mayúscula para mejor presentación
    document.getElementById('planName').textContent = plan.charAt(0).toUpperCase() + plan.slice(1);
    document.getElementById('planPrice').textContent = formatPrice(price);

    // Actualización del resumen de compra
    document.getElementById('summaryPlan').textContent = plan.charAt(0).toUpperCase() + plan.slice(1);
    document.getElementById('summaryDuration').textContent = duration;
    document.getElementById('summaryTotal').textContent = formatPrice(price);

    // Configuración del formulario de pago
    const form = document.getElementById('paymentForm');
    form.addEventListener('submit', handlePayment);
});

// Validación y formato del número de tarjeta
document.getElementById('cardNumber').addEventListener('input', (e) => {
    // Filtrado de caracteres no numéricos y limitación a 16 dígitos
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16);
});

// Validación y formato de la fecha de expiración
document.getElementById('expiryDate').addEventListener('input', (e) => {
    // Filtrado de caracteres no numéricos
    let value = e.target.value.replace(/\D/g, '');

    // Adición de separador entre mes y año
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }

    // Actualización del campo
    e.target.value = value;
});

// Validación y formato del código CVV
document.getElementById('cvv').addEventListener('input', (e) => {
    // Filtrado de caracteres no numéricos y limitación a 4 dígitos
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
});

// Procesamiento del pago al enviar el formulario
async function handlePayment(e) {
    // Prevención del envío tradicional del formulario
    e.preventDefault();

    // Deshabilitación del botón durante el procesamiento
    const button = e.target.querySelector('button');
    button.disabled = true;
    button.textContent = 'Procesando...';

    try {
        // Simulación del tiempo de procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Obtención de datos del usuario
        const user = JSON.parse(localStorage.getItem('user'));

        // Marcado del pago como completado
        user.paymentCompleted = true;
        localStorage.setItem('user', JSON.stringify(user));

        // Actualización del estado en la lista de usuarios
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex].paymentCompleted = true;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Mensaje de éxito
        alert('¡Pago procesado con éxito! Serás redirigido a tu dashboard.');

        // Redirección al dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        // Manejo de errores
        console.error('Error:', error);
        alert('Error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
        // Restauración del estado del botón
        button.disabled = false;
        button.textContent = 'Confirmar Pago';
    }
}
