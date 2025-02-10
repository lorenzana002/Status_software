document.addEventListener("DOMContentLoaded", () => {
    const fechaElement = document.getElementById("fecha");
    const turnoElement = document.getElementById("turno");
    const checkboxes = document.querySelectorAll(".chk");
    const extraContainer = document.getElementById("extras");
    const agregarCampoBtn = document.getElementById("agregarCampo");
    const generarReporteBtn = document.getElementById("generarReporte");
    const todoOkBtn = document.getElementById("todoOk");
    const reporteTextarea = document.getElementById("reporte");
    const contenidoReporteDiv = document.getElementById("contenidoReporte");
    const copiarReporteBtn = document.getElementById("copiarReporte");

    // Fecha actual
    fechaElement.textContent = new Date().toLocaleDateString();

    // Función para obtener turno actual
    function obtenerTurno() {
        let ahora = new Date();
        let horas = ahora.getHours();
        let minutos = ahora.getMinutes();
        let tiempoActual = horas * 60 + minutos;
        
        if (tiempoActual >= 930 && tiempoActual <= 1434) { // 15:30 - 23:54 (2do turno)
            return "2do turno";
        } else if (tiempoActual >= 20 && tiempoActual <= 380) { // 00:20 - 06:20 (3er turno)
            return "3er turno";
        } else {
            return "Fuera de turno";
        }
    }

    // Actualizar turno
    function actualizarTurno() {
        let turno = obtenerTurno();
        turnoElement.textContent = `| ${turno}`;
    }

    actualizarTurno();
    setInterval(actualizarTurno, 60000);

    // Generar Reporte (con observaciones)
    function generarReporte() {
        let fecha = fechaElement.textContent;
        let turno = turnoElement.textContent.replace("| ", "");
        let reporte = `Status ${fecha} ${turno}:\n\n`;

        checkboxes.forEach(chk => {
            if (chk.checked) {
                let texto = chk.dataset.text;
                let detalle = chk.dataset.detail ? `, ${chk.dataset.detail}` : "";
                let observacion = prompt(`Observación para "${texto}" (dejar vacío si no hay):`);

                if (observacion) {
                    reporte += `* ${texto}${detalle}: ${observacion} ☑️\n\n`;
                } else {
                    reporte += `* ${texto}${detalle}: OK ☑️\n\n`;
                }
            }
        });

        document.querySelectorAll(".extraActividad").forEach(extra => {
            if (extra.value.trim()) {
                reporte += `* ${extra.value.trim()} ☑️\n\n`;
            }
        });

        // Mostrar reporte en div y textarea
        contenidoReporteDiv.textContent = reporte;
        reporteTextarea.value = reporte;

        // Guardar en historial
        guardarHistorial(reporte);
    }

    // Función para generar "Todo OK" automáticamente
    function generarTodoOk() {
        let fecha = fechaElement.textContent;
        let turno = turnoElement.textContent.replace("| ", "");
        let reporte = `Status ${fecha} ${turno}\n\n`;

        let checklist = [
            "Portchannel 300GB: OK",
            "LinkFlapErr en Fxdiag/Mdiag: OK",
            "LinkFlapErr en BSL: OK",
            "Cambios de VLAN L7: OK",
            "Revisión de Zabbix: OK",
            "Revisión de pantallas: OK",
            "Revisión de equipo captivo: OK"
        ];

        checklist.forEach(item => {
            reporte += `* ${item} ☑️\n\n`;
        });

        // Mostrar reporte en div y textarea
        contenidoReporteDiv.textContent = reporte;
        reporteTextarea.value = reporte;

        // Copiar automáticamente
        copiarAlPortapapeles(reporte);

        // Guardar en historial
        guardarHistorial(reporte);
    }

    // Función para guardar en el historial (LocalStorage)
    function guardarHistorial(reporte) {
        let historial = JSON.parse(localStorage.getItem("historial")) || [];
        historial.push(reporte);
        localStorage.setItem("historial", JSON.stringify(historial));
    }

    // Función para copiar al portapapeles
    function copiarAlPortapapeles(texto) {
        navigator.clipboard.writeText(texto).then(() => {
            alert("Reporte copiado al portapapeles");
        }).catch(err => {
            console.error("Error al copiar:", err);
        });
    }

    // Event listeners
    generarReporteBtn.addEventListener("click", generarReporte);
    todoOkBtn.addEventListener("click", generarTodoOk);
    copiarReporteBtn.addEventListener("click", () => copiarAlPortapapeles(reporteTextarea.value));

    // Reloj en tiempo real
    function actualizarReloj() {
        let ahora = new Date();
        let horas = ahora.getHours().toString().padStart(2, '0');
        let minutos = ahora.getMinutes().toString().padStart(2, '0');
        let segundos = ahora.getSeconds().toString().padStart(2, '0');
        document.getElementById("reloj").textContent = `${horas}:${minutos}:${segundos}`;
    }

    setInterval(actualizarReloj, 1000);
    actualizarReloj();
});
// Agregar actividades extras (máximo 5)
let extraCount = 0;
agregarCampoBtn.addEventListener("click", () => {
    if (extraCount < 5) {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "extraActividad";
        input.placeholder = "Nueva actividad...";
        extraContainer.appendChild(input);
        extraCount++;
    }
});