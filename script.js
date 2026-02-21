// ===== Toggle del Menú =====
function toggleMenu() {
    // Desktop: toggle sidebar
    if (window.innerWidth > 768) {
        document.body.classList.toggle('sidebar-closed');
    }
    // Móvil: overlay + drawer
    else {
        const navLinks = document.getElementById("navLinks");
        const overlay = document.getElementById("overlay");

        navLinks.classList.toggle("active");
        overlay.classList.toggle("active");

        if (navLinks.classList.contains("active")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }
}

// ===== Variables globales =====
const dropdown = document.querySelector('.dropdown');
const dropbtn = document.querySelector('.dropbtn');
const overlay = document.getElementById("overlay");

// ===== Toggle del desplegable (Estilos) =====
if (dropbtn) {
    dropbtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });
}

// ===== Cerrar al hacer clic en el overlay =====
if (overlay) {
    overlay.addEventListener('click', function () {
        closeAllMenus();
    });
}

// ===== Cerrar al hacer clic en un enlace =====
document.querySelectorAll('.nav-links a:not(.dropbtn)').forEach(link => {
    link.addEventListener('click', () => {
        closeAllMenus();
        // Desktop: colapsar sidebar
        if (window.innerWidth > 768) {
            document.body.classList.add('sidebar-closed');
        }
    });
});

// ===== Función para cerrar todos los menús =====
function closeAllMenus() {
    const navLinks = document.getElementById("navLinks");
    const overlay = document.getElementById("overlay");

    if (navLinks) navLinks.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = "";

    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

// ===== Cerrar desplegable al hacer clic fuera =====
document.addEventListener('click', function (event) {
    if (dropdown && dropdown.classList.contains('active')) {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    }

    // Desktop: cerrar sidebar al hacer clic fuera
    if (window.innerWidth > 768 && !document.body.classList.contains('sidebar-closed')) {
        const nav = document.querySelector('nav');
        const menuBtn = document.querySelector('.menu-btn');

        if (nav && !nav.contains(event.target) && menuBtn && !menuBtn.contains(event.target)) {
            document.body.classList.add('sidebar-closed');
        }
    }
});

// ===== Intersection Observer para animaciones =====
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll, .style-card, section h2');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });

    // ===== Formulario de Inscripción Avanzado =====
    const form = document.getElementById('inscripcionForm');
    if (form) {
        // ===== Referencias a elementos =====
        const campos = {
            nombre: document.getElementById('nombre'),
            email: document.getElementById('email'),
            emailConfirm: document.getElementById('emailConfirm'),
            telefono: document.getElementById('telefono'),
            estilo: document.getElementById('estilo'),
            nivel: document.getElementById('nivel'),
            terminos: document.getElementById('terminos')
        };

        const submitBtn = document.getElementById('submitBtn');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const messageDiv = document.getElementById('formMessage');

        // Estado de validación de cada campo
        const estadoValidacion = {
            nombre: false,
            email: false,
            emailConfirm: false,
            telefono: false,
            estilo: false,
            nivel: false,
            terminos: false
        };

        // ===== Lista de dominios de email temporales/desechables =====
        const dominiosProhibidos = [
            'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
            'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
            'dispostable.com', 'trashmail.com', 'fakeinbox.com', 'mailnesia.com',
            'maildrop.cc', 'discard.email', 'temp-mail.org', 'getnada.com',
            'mohmal.com', 'emailondeck.com', 'tempr.email', 'burner.kiwi',
            'tempail.com', '10minutemail.com', 'minutemail.com', 'guerrillamail.net',
            'trash-mail.com', 'mailcatch.com', 'mytemp.email', 'mailsac.com',
            'harakirimail.com', 'spamgourmet.com', 'jetable.org', 'meltmail.com'
        ];

        // ===== Nombres falsos / patrones sospechosos =====
        const nombresFalsos = [
            'test', 'prueba', 'asdf', 'qwerty', 'admin', 'usuario', 'user',
            'aaa', 'bbb', 'ccc', 'abc', 'xyz', 'foo', 'bar', 'baz',
            'ejemplo', 'sample', 'demo', 'null', 'undefined', 'none',
            'nombre', 'name', 'hola', 'hello', 'fake', 'falso', 'nada',
            'jajaja', 'lol', 'wtf', 'omg', 'xd', 'jejeje'
        ];

        // ===== Patrones de teclado (keyboard walks) =====
        const patronesTeclado = [
            'qwert', 'asdfg', 'zxcvb', 'qazwsx', 'poiuy', 'lkjhg',
            'mnbvc', '12345', '09876', 'abcde', 'fghij'
        ];

        // ===== Funciones de Validación =====

        // Validar nombre completo
        function validarNombre(valor) {
            const v = valor.trim();

            if (!v) return { valido: false, error: 'El nombre completo es obligatorio.' };
            if (v.length < 5) return { valido: false, error: 'El nombre debe tener al menos 5 caracteres.' };

            // Al menos 2 palabras (nombre + apellido)
            const palabras = v.split(/\s+/).filter(p => p.length > 0);
            if (palabras.length < 2) return { valido: false, error: 'Introduce nombre y al menos un apellido.' };

            // Solo letras, espacios y acentos
            const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜüÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÄËÏÖäëïö\s'-]+$/;
            if (!regexNombre.test(v)) return { valido: false, error: 'El nombre solo puede contener letras y espacios.' };

            // Cada palabra mínimo 2 caracteres
            for (const palabra of palabras) {
                if (palabra.length < 2) return { valido: false, error: 'Cada parte del nombre debe tener al menos 2 letras.' };
            }

            // Detectar nombres falsos conocidos
            const vLower = v.toLowerCase().replace(/\s+/g, '');
            for (const falso of nombresFalsos) {
                if (vLower === falso || vLower.includes(falso)) {
                    return { valido: false, error: 'Introduce un nombre real, por favor.' };
                }
            }

            // Detectar patrones de teclado
            for (const patron of patronesTeclado) {
                if (vLower.includes(patron)) {
                    return { valido: false, error: 'Esto parece un patrón de teclado, no un nombre real.' };
                }
            }

            // Detectar caracteres repetidos excesivos (ej: "aaaa", "bbbb")
            if (/(.)\1{2,}/i.test(v)) {
                return { valido: false, error: 'Demasiados caracteres repetidos. Introduce un nombre real.' };
            }

            // Detectar solo consonantes (improbable en un nombre)
            for (const palabra of palabras) {
                const sinVocales = palabra.replace(/[aeiouáéíóúàèìòùâêîôûäëïöü]/gi, '');
                if (sinVocales.length === palabra.length && palabra.length > 2) {
                    return { valido: false, error: 'El nombre parece incorrecto. Usa un nombre real.' };
                }
            }

            return { valido: true, error: '' };
        }

        // Validar email
        function validarEmail(valor) {
            const v = valor.trim();

            if (!v) return { valido: false, error: 'El email es obligatorio.' };

            // Regex de email robusto
            const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
            if (!regexEmail.test(v)) return { valido: false, error: 'Formato de email no válido.' };

            // Verificar dominio no prohibido
            const dominio = v.split('@')[1].toLowerCase();
            if (dominiosProhibidos.includes(dominio)) {
                return { valido: false, error: 'No se permiten emails temporales o desechables.' };
            }

            // Detectar parte local con solo números o patrones spam
            const parteLocal = v.split('@')[0];
            if (/^\d+$/.test(parteLocal)) {
                return { valido: false, error: 'El email parece generado automáticamente. Usa uno real.' };
            }

            // Partes locales con excesivos números (ej: "user123456789@")
            const numeros = parteLocal.replace(/[^0-9]/g, '');
            if (numeros.length > 6 && numeros.length > parteLocal.length * 0.5) {
                return { valido: false, error: 'El email tiene demasiados números. ¿Es un email real?' };
            }

            return { valido: true, error: '' };
        }

        // Validar confirmación de email
        function validarEmailConfirm(valor) {
            const v = valor.trim();

            if (!v) return { valido: false, error: 'Confirma tu email.' };
            if (v !== campos.email.value.trim()) {
                return { valido: false, error: 'Los emails no coinciden.' };
            }

            return { valido: true, error: '' };
        }

        // Validar teléfono
        function validarTelefono(valor) {
            const v = valor.trim().replace(/[\s\-().]/g, '');

            if (!v) return { valido: false, error: 'El teléfono es obligatorio.' };

            // Formato español: +34XXXXXXXXX, 34XXXXXXXXX, 6XXXXXXXX, 7XXXXXXXX, 9XXXXXXXX
            const regexEspanol = /^(\+?34)?[679]\d{8}$/;
            // Formato internacional genérico: +XX XXXXXXXXX (mínimo 9 dígitos)
            const regexInternacional = /^\+\d{1,4}\d{7,14}$/;

            if (!regexEspanol.test(v) && !regexInternacional.test(v)) {
                return { valido: false, error: 'Formato no válido. Ej: +34 612 345 678 o 612345678' };
            }

            // Detectar números repetidos (ej: 666666666, 000000000)
            const soloDigitos = v.replace(/\D/g, '');
            const ultimosNueve = soloDigitos.slice(-9);
            if (/^(\d)\1{7,}$/.test(ultimosNueve)) {
                return { valido: false, error: 'El número parece falso. Introduce un teléfono real.' };
            }

            // Detectar secuencias (123456789, 987654321)
            if (/123456789|987654321/.test(ultimosNueve)) {
                return { valido: false, error: 'El número parece una secuencia. Introduce un teléfono real.' };
            }

            return { valido: true, error: '' };
        }

        // Validar select (estilo o nivel)
        function validarSelect(valor, campo) {
            if (!valor) {
                const nombre = campo === 'estilo' ? 'estilo preferido' : 'nivel';
                return { valido: false, error: `Selecciona un ${nombre}.` };
            }
            return { valido: true, error: '' };
        }

        // Validar términos
        function validarTerminos(checked) {
            if (!checked) {
                return { valido: false, error: 'Debes aceptar los términos para inscribirte.' };
            }
            return { valido: true, error: '' };
        }

        // ===== Funciones de UI =====

        // Establecer estado de un campo
        function setFieldState(nombre, resultado) {
            const input = campos[nombre];
            const icon = document.getElementById('icon-' + nombre);
            const errorSpan = document.getElementById('error-' + nombre);

            estadoValidacion[nombre] = resultado.valido;

            if (nombre === 'terminos') {
                // Checkbox - no tiene icono ni clase CSS en el input
                if (errorSpan) {
                    errorSpan.textContent = resultado.error;
                    errorSpan.classList.toggle('visible', !resultado.valido && resultado.error !== '');
                }
            } else {
                // Campos normales
                input.classList.remove('valid', 'invalid');
                if (icon) {
                    icon.classList.remove('valid', 'invalid');
                    icon.textContent = '';
                }

                if (resultado.valido) {
                    input.classList.add('valid');
                    if (icon) {
                        icon.classList.add('valid');
                        icon.textContent = '✓';
                    }
                } else if (resultado.error) {
                    input.classList.add('invalid');
                    if (icon) {
                        icon.classList.add('invalid');
                        icon.textContent = '✗';
                    }
                }

                if (errorSpan) {
                    errorSpan.textContent = resultado.error;
                    errorSpan.classList.toggle('visible', !resultado.valido && resultado.error !== '');
                }
            }

            actualizarProgreso();
            actualizarBoton();
        }

        // Actualizar barra de progreso
        function actualizarProgreso() {
            const totalCampos = 7;
            const completados = Object.values(estadoValidacion).filter(v => v).length;
            const porcentaje = Math.round((completados / totalCampos) * 100);

            if (progressFill) progressFill.style.width = porcentaje + '%';
            if (progressText) progressText.textContent = completados + ' de ' + totalCampos + ' campos completados';
        }

        // Actualizar estado del botón
        function actualizarBoton() {
            const todosValidos = Object.values(estadoValidacion).every(v => v);
            submitBtn.disabled = !todosValidos;
        }

        // Animación de shake
        function shakeField(nombre) {
            const group = document.getElementById('group-' + nombre);
            if (group) {
                group.classList.add('shake');
                setTimeout(() => group.classList.remove('shake'), 500);
            }
        }

        // ===== Eventos de Validación en Tiempo Real =====

        // Nombre: validar en blur e input
        campos.nombre.addEventListener('blur', function () {
            setFieldState('nombre', validarNombre(this.value));
        });
        campos.nombre.addEventListener('input', function () {
            // Actualizar contador de caracteres
            const counter = document.getElementById('counter-nombre');
            const len = this.value.length;
            counter.textContent = len + ' / 80';
            counter.classList.remove('warning', 'limit');
            if (len >= 70) counter.classList.add('limit');
            else if (len >= 50) counter.classList.add('warning');

            // Re-validar si ya fue tocado (tiene clase valid o invalid)
            if (this.classList.contains('valid') || this.classList.contains('invalid')) {
                setFieldState('nombre', validarNombre(this.value));
            }
        });

        // Email: validar en blur e input
        campos.email.addEventListener('blur', function () {
            setFieldState('email', validarEmail(this.value));
            // Re-validar confirmación si ya fue tocada
            if (campos.emailConfirm.classList.contains('valid') || campos.emailConfirm.classList.contains('invalid')) {
                setFieldState('emailConfirm', validarEmailConfirm(campos.emailConfirm.value));
            }
        });
        campos.email.addEventListener('input', function () {
            if (this.classList.contains('valid') || this.classList.contains('invalid')) {
                setFieldState('email', validarEmail(this.value));
            }
            // Re-validar confirmación en tiempo real
            if (campos.emailConfirm.classList.contains('valid') || campos.emailConfirm.classList.contains('invalid')) {
                setFieldState('emailConfirm', validarEmailConfirm(campos.emailConfirm.value));
            }
        });

        // Confirmar email: validar en blur e input
        campos.emailConfirm.addEventListener('blur', function () {
            setFieldState('emailConfirm', validarEmailConfirm(this.value));
        });
        campos.emailConfirm.addEventListener('input', function () {
            if (this.classList.contains('valid') || this.classList.contains('invalid')) {
                setFieldState('emailConfirm', validarEmailConfirm(this.value));
            }
        });

        // Teléfono: validar en blur e input
        campos.telefono.addEventListener('blur', function () {
            setFieldState('telefono', validarTelefono(this.value));
        });
        campos.telefono.addEventListener('input', function () {
            if (this.classList.contains('valid') || this.classList.contains('invalid')) {
                setFieldState('telefono', validarTelefono(this.value));
            }
        });

        // Estilo: validar en change
        campos.estilo.addEventListener('change', function () {
            setFieldState('estilo', validarSelect(this.value, 'estilo'));
        });

        // Nivel: validar en change
        campos.nivel.addEventListener('change', function () {
            setFieldState('nivel', validarSelect(this.value, 'nivel'));
        });

        // Términos: validar en change
        campos.terminos.addEventListener('change', function () {
            setFieldState('terminos', validarTerminos(this.checked));
        });

        // ===== Envío del Formulario =====
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Validar todos los campos al intentar enviar
            setFieldState('nombre', validarNombre(campos.nombre.value));
            setFieldState('email', validarEmail(campos.email.value));
            setFieldState('emailConfirm', validarEmailConfirm(campos.emailConfirm.value));
            setFieldState('telefono', validarTelefono(campos.telefono.value));
            setFieldState('estilo', validarSelect(campos.estilo.value, 'estilo'));
            setFieldState('nivel', validarSelect(campos.nivel.value, 'nivel'));
            setFieldState('terminos', validarTerminos(campos.terminos.checked));

            // Si hay errores, hacer shake en los campos inválidos
            const todosValidos = Object.values(estadoValidacion).every(v => v);
            if (!todosValidos) {
                for (const [campo, valido] of Object.entries(estadoValidacion)) {
                    if (!valido) shakeField(campo);
                }
                showMessage(messageDiv, '⚠️ Corrige los errores señalados antes de enviar.', 'error');
                return;
            }

            // Estado de carga
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';

            // Preparar datos
            const datos = {
                nombre: campos.nombre.value.trim(),
                email: campos.email.value.trim(),
                telefono: campos.telefono.value.trim(),
                estilo: campos.estilo.value,
                nivel: campos.nivel.value
            };

            try {
                const response = await fetch('/api/inscripcion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });

                const result = await response.json();

                if (response.ok) {
                    showMessage(messageDiv, '🥋 ¡' + result.mensaje + ' Bienvenido/a, ' + datos.nombre + '!', 'success');
                    form.reset();
                    // Resetear estados de validación
                    Object.keys(estadoValidacion).forEach(k => estadoValidacion[k] = false);
                    document.querySelectorAll('.field-icon').forEach(el => {
                        el.classList.remove('valid', 'invalid');
                        el.textContent = '';
                    });
                    document.querySelectorAll('.input-wrapper input, .input-wrapper select').forEach(el => {
                        el.classList.remove('valid', 'invalid');
                    });
                    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
                    document.getElementById('counter-nombre').textContent = '0 / 80';
                    actualizarProgreso();
                    actualizarBoton();
                } else {
                    showMessage(messageDiv, '⚠️ ' + result.error, 'error');
                }
            } catch (error) {
                showMessage(messageDiv, '❌ No se pudo conectar con el servidor. Asegúrate de que está corriendo (node server.js).', 'error');
                console.error('Error de conexión:', error);
            } finally {
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                actualizarBoton();
            }
        });
    }
});

// ===== Mostrar mensajes del formulario =====
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = 'form-message ' + type;
    element.style.display = 'block';

    // Scroll suave al mensaje
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-ocultar después de 10 segundos
    setTimeout(() => {
        element.style.display = 'none';
    }, 10000);
}
