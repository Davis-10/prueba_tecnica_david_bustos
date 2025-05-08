// Función para extraer parámetros de la URL
// Ejemplo: "pagina.html?plan=basic" obtiene "basic" si name="plan"
function getUrlParameter(name) {
    // Escape de caracteres especiales
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    // Expresión regular para buscar el parámetro
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    // Ejecución de la búsqueda
    var results = regex.exec(location.search);
    // Retorno del valor o cadena vacía
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Función para mostrar mensajes temporales (errores o confirmaciones)
function showMessage(message, isError = false) {
    // Creación del elemento de mensaje
    const messageDiv = document.createElement('div');
    // Asignación de clase según tipo de mensaje
    messageDiv.className = `alert ${isError ? 'alert-error' : 'alert-success'}`;
    // Asignación del texto
    messageDiv.textContent = message;

    // Inserción al inicio del formulario
    const form = document.querySelector('.auth-form');
    form.insertBefore(messageDiv, form.firstChild);

    // Eliminación automática tras 5 segundos
    setTimeout(() => messageDiv.remove(), 5000);
}

// Función de validación del formulario de registro
// Retorna array de errores o array vacío si todo es correcto
function validateRegisterForm(formData) {
    const errors = [];

    // Validación de longitud de contraseña
    if (formData.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    // Validación de edad (18-100 años)
    const edad = new Date().getFullYear() - new Date(formData.fecha_nacimiento).getFullYear();
    if (edad < 18 || edad > 100) {
        errors.push('Debes tener entre 18 y 100 años');
    }

    // Validación de peso (30-300 kg)
    if (formData.datos_fisicos.peso < 30 || formData.datos_fisicos.peso > 300) {
        errors.push('El peso debe estar entre 30 y 300 kg');
    }

    // Validación de altura (100-250 cm)
    if (formData.datos_fisicos.altura < 100 || formData.datos_fisicos.altura > 250) {
        errors.push('La altura debe estar entre 100 y 250 cm');
    }

    // Retorno de errores encontrados
    return errors;
}

// Procesamiento del formulario de inicio de sesión
async function handleLogin(event) {
    // Prevención del envío tradicional del formulario
    event.preventDefault();

    // Obtención de credenciales
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Recuperación de usuarios registrados
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Búsqueda de coincidencia de credenciales
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Generación de token simple
        // Nota: en producción se usaría un sistema más seguro
        const token = 'token-' + Date.now();

        // Almacenamiento de sesión
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Notificación de éxito
        showMessage('Inicio de sesión exitoso', false);

        // Redirección con breve retraso
        setTimeout(() => {
            window.location.href = '../dashboard.html';
        }, 100);
    } else {
        // Notificación de error
        showMessage('Email o contraseña incorrectos', true);
    }
}

// Esta función procesa el formulario cuando un nuevo usuario se registra
async function handleRegister(event) {
    // Evitamos que el formulario se envíe de forma tradicional
    event.preventDefault();

    // Obtenemos el plan que el usuario seleccionó previamente (si existe)
    const planSeleccionado = getUrlParameter('plan');

    // Creamos un objeto con todos los datos del formulario
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
        genero: document.getElementById('genero').value,
        datos_fisicos: {
            // Convertimos los valores numéricos al tipo correcto
            peso: parseFloat(document.getElementById('peso').value),
            altura: parseInt(document.getElementById('altura').value),
            nivel_actividad: document.getElementById('nivel_actividad').value,
            // Calculamos el IMC automáticamente con los datos proporcionados
            imc: calcularIMC(
                parseFloat(document.getElementById('peso').value),
                parseInt(document.getElementById('altura').value)
            )
        },
        objetivos: {
            principal: document.getElementById('objetivo').value,
            tiempo_disponible: parseInt(document.getElementById('tiempo_disponible').value)
        },
        // Si no hay plan seleccionado, asignamos el plan básico por defecto
        plan_seleccionado: planSeleccionado || 'basic'
    };

    // Validamos los datos del formulario
    const errors = validateRegisterForm(formData);
    if (errors.length > 0) {
        // Si hay errores, los mostramos y detenemos el proceso
        errors.forEach(error => showMessage(error, true));
        return;
    }

    // Recuperamos la lista de usuarios o creamos una nueva si no existe
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Comprobamos si ya existe un usuario con el mismo email
    if (users.some(user => user.email === formData.email)) {
        showMessage('Este email ya está registrado', true);
        return;
    }

    // Añadimos el nuevo usuario a la lista
    users.push(formData);

    // Guardamos la lista actualizada en el almacenamiento local
    localStorage.setItem('users', JSON.stringify(users));

    // Creamos un token simple para la sesión del usuario
    const token = 'token-' + Date.now();

    // Guardamos el token y los datos del usuario actual
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(formData));

    // Mostramos mensaje de registro exitoso
    showMessage('Registro exitoso', false);

    // Redirigimos al usuario según si seleccionó un plan o no
    setTimeout(() => {
        if (planSeleccionado) {
            // Si seleccionó un plan, lo llevamos a la página de pago
            window.location.href = '../payment.html';
        } else {
            // Si no seleccionó un plan, lo llevamos directamente al dashboard
            window.location.href = '../dashboard.html';
        }
    }, 2000); // Esperamos 2 segundos para que pueda ver el mensaje de éxito
}

// Esta función permite al usuario mostrar u ocultar su contraseña al hacer clic en el icono
function togglePassword(event) {
    // Obtenemos el contenedor del botón de mostrar/ocultar contraseña
    const toggleWrapper = event.currentTarget.closest('.password-toggle-wrapper');

    // Obtenemos el icono del ojo dentro del contenedor
    const toggleIcon = toggleWrapper.querySelector('i');

    // Obtenemos el campo de contraseña asociado a este botón
    const passwordInput = toggleWrapper.previousElementSibling.querySelector('input[type="password"], input[type="text"]');

    // Cambiamos entre mostrar y ocultar la contraseña
    if (passwordInput.type === 'password') {
        // Si está oculta, la mostramos
        passwordInput.type = 'text';
        // Cambiamos el icono a "ojo tachado"
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
        // Actualizamos el texto del botón
        toggleWrapper.querySelector('span').textContent = 'Ocultar contraseña';
    } else {
        // Si está visible, la ocultamos
        passwordInput.type = 'password';
        // Cambiamos el icono a "ojo normal"
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
        // Actualizamos el texto del botón
        toggleWrapper.querySelector('span').textContent = 'Mostrar contraseña';
    }
}

// Esta función calcula el Índice de Masa Corporal (IMC) de una persona
function calcularIMC(peso, altura) {
    // Convertimos la altura de centímetros a metros
    const alturaMetros = altura / 100;
    // Aplicamos la fórmula del IMC: peso(kg) / altura²(m)
    // Redondeamos a 2 decimales
    return (peso / (alturaMetros * alturaMetros)).toFixed(2);
}

// Esta función calcula el metabolismo basal (calorías en reposo) según la fórmula de Mifflin-St Jeor
function calcularCaloriasBase(peso, altura, edad, genero) {
    if (genero === 'masculino') {
        // Fórmula para hombres
        return 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad);
    } else {
        // Fórmula para mujeres
        return 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
    }
}

// Esta función calcula las calorías diarias totales según el nivel de actividad física
function calcularCaloriasTotales(bmr, nivelActividad) {
    // Factores multiplicadores según el nivel de actividad
    const factores = {
        'sedentario': 1.2,      // Poco o ningún ejercicio
        'ligero': 1.375,        // Ejercicio ligero 1-3 días/semana
        'moderado': 1.55,       // Ejercicio moderado 3-5 días/semana
        'activo': 1.725         // Ejercicio intenso 6-7 días/semana
    };
    // Multiplicamos el metabolismo basal por el factor de actividad
    return bmr * factores[nivelActividad];
}

// Esta función cierra la sesión del usuario actual
function logout() {
    // Eliminamos el token y los datos del usuario del almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirigimos al usuario a la página principal
    window.location.href = '../index.html';
}

// Configuramos todos los eventos cuando el documento ha terminado de cargar
document.addEventListener('DOMContentLoaded', () => {
    // Configuramos el formulario de inicio de sesión
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Asociamos la función de manejo de login al evento submit
        loginForm.addEventListener('submit', handleLogin);
    }

    // Configuramos el formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Asociamos la función de manejo de registro al evento submit
        registerForm.addEventListener('submit', handleRegister);

        // Si el usuario viene de seleccionar un plan, mostramos cuál eligió
        const planSeleccionado = getUrlParameter('plan');
        if (planSeleccionado) {
            // Creamos un elemento visual para mostrar el plan seleccionado
            const planInfo = document.createElement('div');
            planInfo.className = 'plan-info';
            planInfo.innerHTML = `
                <div class="selected-plan">
                    <h4>Plan Seleccionado</h4>
                    <p>${planSeleccionado.toUpperCase()}</p>
                </div>
            `;
            // Insertamos esta información al principio del formulario
            registerForm.insertBefore(planInfo, registerForm.firstChild);
        }
    }

    // Configuramos los botones de mostrar/ocultar contraseña
    const togglePasswordWrappers = document.querySelectorAll('.password-toggle-wrapper');
    if (togglePasswordWrappers.length > 0) {
        // Asociamos la función de alternar visibilidad a cada botón
        togglePasswordWrappers.forEach(wrapper => {
            wrapper.addEventListener('click', togglePassword);
        });
    }

    // Configuramos el botón de cerrar sesión si existe en la página
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        // Asociamos la función de logout al evento click
        logoutBtn.addEventListener('click', logout);
    }
});
