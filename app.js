const participants = [
    "Sebastián González", "Juan Pablo González", "Nicolás González", 
    "Javier Ocampo", "Juan José Vargas", "Sebastián Rivera", 
    "Juliana Vélez", "Liana Martinez", "Luisa Jurado", "Paulina Arango"
];

// Mostrar los meses según el año seleccionado
function showMonths(year) {
    const monthsContainer = document.getElementById("months-container");
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    monthsContainer.innerHTML = months.map(month => `
        <button onclick="showLogForm('${year}', '${month}')">${month}</button>
    `).join("");
    monthsContainer.style.display = "block";
}

// Mostrar formulario para registrar bitácoras
function showLogForm(year, month, bitacora = null) {
    const logFormContainer = document.getElementById("log-form-container");
    const bitacoraData = bitacora || {
        responsable: "",
        fecha: "",
        participantes: "",
        temas: "",
        actividades: "",
        pendientes: "",
        decisiones: "",
        datos: "",
        propuesta: "",
        fechaProximo: "",
        horaProximo: ""
    };

    logFormContainer.innerHTML = `
        <h2>${month} ${year} - Bitácora</h2>
        <form id="logForm">
            <label>Responsable: <input type="text" id="responsable" value="${bitacoraData.responsable}" required></label>
            <label>Fecha: <input type="date" id="fecha" value="${bitacoraData.fecha}" required></label>
            <label>Participantes:</label>
            <ul>
                ${participants.map(part => `
                    <li>
                        <input type="checkbox" value="${part}" id="${part}" ${bitacoraData.participantes.includes(part) ? 'checked' : ''}>
                        <label for="${part}">${part}</label>
                    </li>
                `).join("")}
            </ul>
            <label>Temas: <textarea id="temas" required>${bitacoraData.temas}</textarea></label>
            <label>Actividades: <textarea id="actividades" required>${bitacoraData.actividades}</textarea></label>
            <label>Pendientes y su responsable: <textarea id="pendientes" required>${bitacoraData.pendientes}</textarea></label>
            <label>Decisiones: <textarea id="decisiones" required>${bitacoraData.decisiones}</textarea></label>
            <label>Datos importantes: <textarea id="datos" required>${bitacoraData.datos}</textarea></label>
            <label>Propuesta próximo encuentro: <textarea id="propuesta" required>${bitacoraData.propuesta}</textarea></label>
            <label>Fecha próximo encuentro: <input type="date" id="fechaProximoFecha" value="${bitacoraData.fechaProximo}" required></label>
            <label>Hora próximo encuentro: <input type="time" id="fechaProximoHora" value="${bitacoraData.horaProximo}" required></label>
            <button type="button" onclick="saveLog('${year}', '${month}', ${bitacora ? bitacoraData.index : 'null'})">Guardar Bitácora</button>
        </form>
    `;
    logFormContainer.style.display = "block";
}

// Guardar bitácora en LocalStorage
function saveLog(year, month, index = null) {
    const participantes = participants.filter(part => document.getElementById(part).checked).join(", ");
    const log = {
        responsable: document.getElementById("responsable").value,
        fecha: document.getElementById("fecha").value,
        participantes: participantes,
        temas: document.getElementById("temas").value,
        actividades: document.getElementById("actividades").value,
        pendientes: document.getElementById("pendientes").value,
        decisiones: document.getElementById("decisiones").value,
        datos: document.getElementById("datos").value,
        propuesta: document.getElementById("propuesta").value,
        fechaProximo: document.getElementById("fechaProximoFecha").value,
        horaProximo: document.getElementById("fechaProximoHora").value
    };

    const key = `${year}-${month}-logs`;
    const logs = JSON.parse(localStorage.getItem(key) || "[]");

    if (index !== null) {
        logs[index] = log; // Editar bitácora existente
    } else {
        logs.push(log); // Agregar nueva bitácora
    }

    localStorage.setItem(key, JSON.stringify(logs));

    alert("Bitácora guardada exitosamente");
    document.getElementById("logForm").reset();
    mostrarBitacoras();
}

// Mostrar todas las bitácoras guardadas
function mostrarBitacoras() {
    const contenedorBitacoras = document.getElementById("contenedorBitacoras");
    contenedorBitacoras.innerHTML = "";
    const keys = Object.keys(localStorage).filter(key => key.endsWith("-logs"));

    keys.forEach(key => {
        const bitacoras = JSON.parse(localStorage.getItem(key));
        bitacoras.slice().reverse().forEach((bitacora, index) => {
            const bitacoraDiv = document.createElement("div");
            bitacoraDiv.classList.add("bitacora");

            bitacoraDiv.innerHTML = `
                <h3>Bitácora ${bitacoras.length - index}</h3>
                <p><strong>Responsable:</strong> ${bitacora.responsable}</p>
                <p><strong>Fecha:</strong> ${bitacora.fecha}</p>
                <p><strong>Participantes:</strong> ${bitacora.participantes}</p>
                <p><strong>Temas:</strong></p>
                <ul>${bitacora.temas.split("\n").map(item => `<li>${item}</li>`).join("")}</ul>
                <p><strong>Actividades:</strong></p>
                <ul>${bitacora.actividades.split("\n").map(item => `<li>${item}</li>`).join("")}</ul>
                <p><strong>Pendientes y su responsable:</strong></p>
                <ul>${bitacora.pendientes.split("\n").map(item => `<li>${item}</li>`).join("")}</ul>
                <p><strong>Decisiones:</strong></p>
                <ul>${bitacora.decisiones.split("\n").map(item => `<li>${item}</li>`).join("")}</ul>
                <p><strong>Datos importantes:</strong></p>
                <ul>${bitacora.datos.split("\n").map(item => `<li>${item}</li>`).join("")}</ul>
                <p><strong>Propuesta próximo encuentro:</strong> ${bitacora.propuesta}</p>
                <p><strong>Fecha próximo encuentro:</strong> ${bitacora.fechaProximo}</p>
                <p><strong>Hora próximo encuentro:</strong> ${bitacora.horaProximo}</p>
                <button onclick="editarBitacora('${key}', ${index})">Editar</button>
                <button onclick="descargarBitacora(${JSON.stringify(bitacora)})">Descargar</button>
                <button onclick="borrarBitacora('${key}', ${index})">Borrar</button>
            `;

            contenedorBitacoras.appendChild(bitacoraDiv);
        });
    });
}

// Editar una bitácora guardada
function editarBitacora(key, index) {
    const bitacoras = JSON.parse(localStorage.getItem(key));
    const bitacora = bitacoras[index];
    showLogForm(key.split("-")[0], key.split("-")[1], { ...bitacora, index });
}

// Descargar bitácora en formato PDF
function descargarBitacora(bitacora) {
    const doc = new jsPDF();
    doc.text(`Bitácora: ${bitacora.responsable}`, 10, 10);
    doc.text(`Fecha: ${bitacora.fecha}`, 10, 20);
    doc.text(`Participantes: ${bitacora.participantes}`, 10, 30);
    doc.text(`Temas: ${bitacora.temas}`, 10, 40);
    doc.text(`Actividades: ${bitacora.actividades}`, 10, 50);
    doc.text(`Pendientes y su responsable: ${bitacora.pendientes}`, 10, 60);
    doc.text(`Decisiones: ${bitacora.decisiones}`, 10, 70);
    doc.text(`Datos importantes: ${bitacora.datos}`, 10, 80);
    doc.text(`Propuesta próximo encuentro: ${bitacora.propuesta}`, 10, 90);
    doc.text(`Fecha próximo encuentro: ${bitacora.fechaProximo}`, 10, 100);
    doc.text(`Hora próximo encuentro: ${bitacora.horaProximo}`, 10, 110);

    doc.save(`bitacora_${bitacora.responsable}.pdf`);
}

// Borrar una bitácora guardada
function borrarBitacora(key, index) {
    const bitacoras = JSON.parse(localStorage.getItem(key));
    bitacoras.splice(index, 1); // Eliminar bitácora por índice
    localStorage.setItem(key, JSON.stringify(bitacoras));
    mostrarBitacoras(); // Actualizar la vista de bitácoras
}
