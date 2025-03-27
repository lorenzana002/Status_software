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
        if (extraCount < 10) {
            const input = document.createElement("input");
            input.type = "text";
            input.className = "extraActividad";
            input.placeholder = "Nueva actividad...";
            extraContainer.appendChild(input);
            extraCount++;
        }
    });

    // Generar reporte
    generarReporteBtn.addEventListener("click", () => {
        let reporte = `Status ${fechaElement.textContent} ${obtenerTurno()}:\n\n`;

        checkboxes.forEach(chk => {
            if (chk.checked) {
                let texto = chk.dataset.text;
                let detalle = chk.dataset.detail ? `, ${chk.dataset.detail}` : "";
                let observacion = prompt(`Observación para "${texto}" (dejar vacío si no hay):`);
                reporte += `${texto}${detalle} ✅`;
                if (observacion) reporte += `, ${observacion}`;
                reporte += "\n";
            }
   /* Borrar si es necesario, hasta linea 84 */
   function guardarHistorial(reporte) {
    let historial = JSON.parse(localStorage.getItem("historial")) || [];
    historial.push(reporte);  
    localStorage.setItem("historial", JSON.stringify(historial));  
}

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
            /* Borrar si es necesario, hasta linea 53 */
            
        });

        document.querySelectorAll(".extraActividad").forEach(extra => {
            if (extra.value.trim()) {
                reporte += `${extra.value.trim()} ✅\n`;
            }
        });

        reporteTextarea.value = reporte;
    });

    // Todo OK (sin observaciones)
    todoOkBtn.addEventListener("click", () => {
        let reporte = `Status ${fechaElement.textContent} 2do turno:\n\n`;
        checkboxes.forEach(chk => {
            reporte += `${chk.dataset.text}\n`;
        });
        reporteTextarea.value = reporte;
    });

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
    let hora = ahora.getHours();

    return hora >= 0 && hora < 6 ? "3er turno" : "2do turno";
}
generarReporteBtn.addEventListener("click", () => {
    let turno = obtenerTurno();
    let reporte = `Status ${fechaElement.textContent} ${turno}:\n\n`;
/*
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
*/
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

    guardarHistorial(reporte);
});

