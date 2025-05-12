// Definimos la duración de cada plan de suscripción
const PLAN_DURATIONS = {
    'basic': '1 mes',     // Plan básico: duración de 1 mes
    'goup': '3 meses',    // Plan intermedio: duración de 3 meses
    'expert': '6 meses'   // Plan experto: duración de 6 meses
};

// Esta función carga los datos del usuario desde el almacenamiento local
// y actualiza la interfaz del dashboard con esa información
function loadUserData() {
    // Obtenemos el token y los datos del usuario del almacenamiento local
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // Si no hay token o datos de usuario, el usuario no está autenticado
    if (!token || !user) {
        // Redirigimos a la página de login
        window.location.href = 'auth/login.html';
        return;
    }

    // Si el usuario está autenticado, actualizamos el dashboard con sus datos
    updateDashboard(user);
}

// Esta función actualiza todos los elementos del dashboard con la información del usuario
function updateDashboard(userData) {
    // Actualizamos el nombre de usuario en la barra superior
    document.getElementById('userName').textContent = userData.nombre;

    // Actualizamos la información personal en la sección de perfil
    document.getElementById('profileName').textContent = userData.nombre;
    document.getElementById('profileEmail').textContent = userData.email;
    document.getElementById('profileGender').textContent = userData.genero;

    // Calculamos la edad del usuario a partir de su fecha de nacimiento
    const birthDate = new Date(userData.fecha_nacimiento);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    document.getElementById('profileAge').textContent = `${age} años`;

    // Actualizamos las estadísticas físicas del usuario
    document.getElementById('profileWeight').textContent = userData.datos_fisicos.peso;
    document.getElementById('profileHeight').textContent = userData.datos_fisicos.altura;
    // Si el IMC ya está calculado lo usamos, si no, lo calculamos ahora
    document.getElementById('profileIMC').textContent = userData.datos_fisicos.imc ||
        calcularIMC(userData.datos_fisicos.peso, userData.datos_fisicos.altura);

    // Calculamos las calorías diarias recomendadas para el usuario
    // Primero calculamos el metabolismo basal y luego lo ajustamos según nivel de actividad
    const calories = calcularCaloriasTotales(
        calcularCaloriasBase(
            userData.datos_fisicos.peso,
            userData.datos_fisicos.altura,
            age,
            userData.genero
        ),
        userData.datos_fisicos.nivel_actividad
    );
    // Redondeamos las calorías a un número entero
    document.getElementById('profileCalories').textContent = Math.round(calories);

    // Actualizamos la información del plan de entrenamiento
    // Convertimos la primera letra a mayúscula para mejor presentación
    const planName = userData.plan_seleccionado ?
        userData.plan_seleccionado.charAt(0).toUpperCase() + userData.plan_seleccionado.slice(1) :
        'No seleccionado';
    document.getElementById('profilePlan').textContent = planName;
    document.getElementById('profileDuration').textContent = PLAN_DURATIONS[userData.plan_seleccionado] || '-';
    // Formateamos el objetivo y nivel de actividad para mejor presentación
    document.getElementById('profileGoal').textContent = formatearObjetivo(userData.objetivos.principal);
    document.getElementById('profileActivity').textContent = formatearNivelActividad(userData.datos_fisicos.nivel_actividad);
}

// Esta función calcula el metabolismo basal (calorías que necesita el cuerpo en reposo)
// Utiliza la fórmula de Mifflin-St Jeor que es más precisa que la antigua Harris-Benedict
function calcularCaloriasBase(peso, altura, edad, genero) {
    if (genero === 'masculino') {
        // Fórmula para hombres
        return 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad);
    } else {
        // Fórmula para mujeres
        return 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
    }
}

// Esta función ajusta el metabolismo basal según el nivel de actividad física
// para obtener las calorías totales que la persona necesita diariamente
function calcularCaloriasTotales(bmr, nivelActividad) {
    // Cada nivel de actividad tiene un factor multiplicador diferente
    const factores = {
        'sedentario': 1.2,      // Poco o ningún ejercicio
        'ligero': 1.375,        // Ejercicio ligero 1-3 días por semana
        'moderado': 1.55,       // Ejercicio moderado 3-5 días por semana
        'activo': 1.725         // Ejercicio intenso 6-7 días por semana
    };
    // Multiplicamos el metabolismo basal por el factor correspondiente
    return bmr * factores[nivelActividad];
}

// Esta función convierte los códigos de objetivo a textos más amigables para mostrar
function formatearObjetivo(objetivo) {
    // Diccionario de conversión de códigos a textos descriptivos
    const objetivos = {
        'perdida_peso': 'Pérdida de Peso',
        'ganancia_muscular': 'Ganancia Muscular',
        'tonificacion': 'Tonificación',
        'resistencia': 'Mejorar Resistencia'
    };
    // Devolvemos el texto formateado o el original si no está en el diccionario
    return objetivos[objetivo] || objetivo;
}

// Esta función convierte los códigos de nivel de actividad a textos más amigables
function formatearNivelActividad(nivel) {
    // Diccionario de conversión de códigos a textos descriptivos
    const niveles = {
        'sedentario': 'Sedentario',
        'ligero': 'Actividad Ligera',
        'moderado': 'Actividad Moderada',
        'activo': 'Muy Activo'
    };
    // Devolvemos el texto formateado o el original si no está en el diccionario
    return niveles[nivel] || nivel;
}

// Configuramos la navegación del menú lateral (sidebar)
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        // Evitamos que el enlace navegue a otra página
        e.preventDefault();
        // Obtenemos el ID de la sección a mostrar (quitando el # del href)
        const targetId = link.getAttribute('href').slice(1);

        // Primero ocultamos todas las secciones del dashboard
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Luego mostramos solo la sección que el usuario seleccionó
        document.getElementById(targetId).classList.remove('hidden');

        // Actualizamos la apariencia de los enlaces del menú
        // Quitamos la clase 'active' de todos los enlaces
        document.querySelectorAll('.sidebar-nav a').forEach(a => {
            a.classList.remove('active');
        });
        // Añadimos la clase 'active' solo al enlace seleccionado
        link.classList.add('active');
    });
});

// Configuramos el botón de cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
    // Eliminamos los datos de la sesión del usuario
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirigimos a la página principal
    window.location.href = 'index.html';
});

// Cuando la página termina de cargar, cargamos los datos del usuario
document.addEventListener('DOMContentLoaded', loadUserData);
