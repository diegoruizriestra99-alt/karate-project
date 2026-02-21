document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-inscripcion');
    const btnCargar = document.getElementById('btn-cargar');
    const listaAlumnos = document.getElementById('lista-alumnos');
    const mensajeEstado = document.getElementById('mensaje-estado');

    // Función para mostrar mensajes
    function mostrarMensaje(texto, tipo) {
        mensajeEstado.textContent = texto;
        mensajeEstado.className = tipo; // 'success' o 'error'
        setTimeout(() => {
            mensajeEstado.textContent = '';
            mensajeEstado.className = '';
        }, 5000);
    }

    // Registrar alumno
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            estilo: document.getElementById('estilo').value,
            nivel: document.querySelector('input[name="nivel"]:checked').value
        };

        try {
            const response = await fetch('/api/inscripcion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                mostrarMensaje('¡Inscripción exitosa!', 'success');
                form.reset();
                cargarInscripciones();
            } else {
                mostrarMensaje(data.error || 'Error en la inscripción', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('No se pudo conectar con el servidor', 'error');
        }
    });

    // Cargar alumnos inscritos
    async function cargarInscripciones() {
        try {
            const response = await fetch('/api/inscripciones');
            const data = await response.json();

            listaAlumnos.innerHTML = '';

            data.forEach(alumno => {
                const fila = document.createElement('tr');
                const fecha = new Date(alumno.fecha_registro).toLocaleDateString();
                
                fila.innerHTML = `
                    <td>${alumno.nombre}</td>
                    <td>${alumno.estilo}</td>
                    <td>${alumno.nivel}</td>
                    <td>${fecha}</td>
                `;
                listaAlumnos.appendChild(fila);
            });
        } catch (error) {
            console.error('Error al cargar:', error);
        }
    }

    btnCargar.addEventListener('click', cargarInscripciones);

    // Cargar lista al inicio
    cargarInscripciones();
});
