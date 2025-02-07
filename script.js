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
    generarReporteBtn.addEventListener("click", () => {
        let reporte = `Status ${fechaElement.textContent} 2do turno:\n\n`;

        checkboxes.forEach(chk => {
            if (chk.checked) {
                let texto = chk.dataset.text;
                let detalle = chk.dataset.detail ? `, ${chk.dataset.detail}` : "";
                let observacion = prompt(`Observación para "${texto}" (dejar vacío si no hay):`);
                reporte += `${texto}${detalle} ✅`;
                if (observacion) reporte += `, ${observacion}`;
                reporte += "\n";
            }
        });

        document.querySelectorAll(".extraActividad").forEach(extra => {
            if (extra.value.trim()) {
                reporte += `${extra.value.trim()}\n ✅`;
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
