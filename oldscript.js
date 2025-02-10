document.addEventListener("DOMContentLoaded", () => {
    const fechaElement = document.getElementById("fecha");
    const checkboxes = document.querySelectorAll(".chk");
    const extraContainer = document.getElementById("extras");
    const agregarCampoBtn = document.getElementById("agregarCampo");
    const generarReporteBtn = document.getElementById("generarReporte");
    const todoOkBtn = document.getElementById("todoOk");
    const reporteTextarea = document.getElementById("reporte");
    const copiarReporteBtn = document.getElementById("copiarReporte");
    const addDetailButtons = document.querySelectorAll(".add-detail");

    // Fecha actual
    fechaElement.textContent = new Date().toLocaleDateString();

    // Agregar detalles adicionales cuando se presiona "+"
    addDetailButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const textoBase = checkboxes[index].dataset.text;
            let detalle = prompt(`Agregar detalle a "${textoBase}" (dejar vacío si no hay cambios):`);
            if (detalle) {
                checkboxes[index].dataset.detail = detalle;
            }
        });
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

    // Generar reporte
    function generarReporte() {
        let fechaElement = document.getElementById("fecha").textContent;
        let turnoElement = document.getElementById("turno").textContent;
        
        let reporte = `Status ${fechaElement} ${turnoElement}\n\n`;
    
        let checklist = [
            { texto: "Portchannel 300GB", detalle: obtenerDetalle("portchannel") },
            { texto: "LinkFlapErr en Fxdiag/Mdiag", detalle: obtenerDetalle("fxdiag") },
            { texto: "LinkFlapErr en BSL", detalle: obtenerDetalle("bsl") },
            { texto: "Cambios de VLAN L7", detalle: obtenerDetalle("vlan") },
            { texto: "Revisión de Zabbix", detalle: obtenerDetalle("zabbix") },
            { texto: "Revisión de pantallas", detalle: obtenerDetalle("pantallas") },
            { texto: "Revisión de equipo captivo", detalle: obtenerDetalle("captivo") }
        ];
    
        let contenidoReporte = "";
    
        checklist.forEach(item => {
            if (item.detalle.trim() !== "") {
                contenidoReporte += `* ${item.texto}: ${item.detalle} ☑️\n\n`;
            } else {
                contenidoReporte += `* ${item.texto}: OK ☑️\n\n`;
            }
        });
    
        // Insertar en el div de reporte
        document.getElementById("contenidoReporte").textContent = contenidoReporte;
    
        // Guardar en el historial
        guardarHistorial(contenidoReporte);
    }
    
    // Función para obtener detalles si el usuario ha ingresado observaciones
    function obtenerDetalle(id) {
        let input = document.getElementById(id);
        return input ? input.value : "";
    }
    
    // Función para guardar en el historial
    function guardarHistorial(reporte) {
        let historial = JSON.parse(localStorage.getItem("historial")) || [];
        historial.push(reporte);
        localStorage.setItem("historial", JSON.stringify(historial));
    }
    
    // Event Listener para el botón "Generar Reporte"
    document.getElementById("generarReporte").addEventListener("click", generarReporte);
    

    // Guardar Data
    function guardarHistorial(reporte) {
        let historial = JSON.parse(localStorage.getItem("historial")) || []; 
        historial.push(reporte);  
        localStorage.setItem("historial", JSON.stringify(historial));  
    }
    // Todo OK (sin observaciones)
    document.getElementById("todoOk").addEventListener("click", function() {
        let fechaElement = document.getElementById("fecha").textContent;
        let turnoElement = document.getElementById("turno").textContent;
        
        let reporte = `Status ${fechaElement} ${turnoElement}\n\n`;
    
        let checklist = [
            "Portchannel 300GB: OK",
            "LinkFlapErr en Fxdiag/Mdiag: OK",
            "LinkFlapErr en BSL: OK",
            "Cambios de VLAN L7",
            "Revisión de Zabbix",
            "Revisión de pantallas",
            "Revisión de equipo captivo"
        ];
    
        checklist.forEach(item => {
            reporte += `* ${item} ☑️\n\n`; 
        });
    
        document.getElementById("contenidoReporte").textContent = reporte;
    
        copiarAlPortapapeles(reporte);
        guardarHistorial(reporte); // Guardar en historial
    });
    
    
    
    function copiarAlPortapapeles(texto) {
        navigator.clipboard.writeText(texto).then(() => {
            alert("Reporte copiado al portapapeles");
        }).catch(err => {
            console.error("Error al copiar:", err);
        });
    }
    
    

    // Copiar reporte al portapapeles
    copiarReporteBtn.addEventListener("click", () => {
        reporteTextarea.select();
        document.execCommand("copy");
        alert("Reporte copiado al portapapeles");
    });
});

document.addEventListener("DOMContentLoaded", () => {
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

function obtenerTurno() {
    let ahora = new Date();
    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();
    
    // Convertimos la hora en minutos totales para simplificar comparaciones
    let tiempoActual = horas * 60 + minutos;
    
    if (tiempoActual >= 930 && tiempoActual <= 1434) { // 15:30 - 23:54 (2do turno)
        return "2do turno";
    } else if (tiempoActual >= 20 && tiempoActual <= 380) { // 00:20 - 06:20 (3er turno)
        return "3er turno";
    } else {
        return "Fuera de turno"; // En caso de estar fuera de esos rangos
    }
}

// Función para actualizar el texto de turno en la interfaz
function actualizarTurno() {
    let turno = obtenerTurno();
    document.getElementById("turno").textContent = `| ${turno}`;
}

// Llamamos la función al cargar la página y la actualizamos cada minuto
document.addEventListener("DOMContentLoaded", actualizarTurno);
setInterval(actualizarTurno, 60000);

generarReporteBtn.addEventListener("click", () => {
    let turno = obtenerTurno();
    let reporte = `Status ${fechaElement.textContent} ${turno}:\n\n`;

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

    reporteTextarea.value = reporte;
});

document.getElementById("enviarWhatsApp").addEventListener("click", () => {
    let texto = encodeURIComponent(reporteTextarea.value);
    window.open(`https://wa.me/?text=${texto}`, "_blank");
});

