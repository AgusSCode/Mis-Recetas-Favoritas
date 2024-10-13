// Array de recetas inicial para simular base de datos local
const recetasBase = [
    { 
        titulo: "Ensalada César", 
        ingredientes: ["lechuga", "pollo", "queso parmesano", "crutones"], 
        categoria: "entradas",
        instrucciones: [
            "Lavar y cortar la lechuga",
            "Cocinar el pollo y cortarlo en tiras",
            "Mezclar la lechuga con el pollo, queso parmesano y crutones",
            "Aliñar con salsa César."
        ]
    },
    { 
        titulo: "Sopa de Tomate", 
        ingredientes: ["tomate", "ajo", "albahaca"], 
        categoria: "entradas",
        instrucciones: [
            "Cortar los tomates y el ajo",
            "Sofreír el ajo en una olla con un poco de aceite",
            "Añadir los tomates y cocer durante 20 minutos",
            "Añadir la albahaca, licuar y servir."
        ]
    },
    { 
        titulo: "Lasagna", 
        ingredientes: ["pasta", "queso", "carne", "salsa de tomate"], 
        categoria: "platos-principales",
        instrucciones: [
            "Cocinar las láminas de pasta",
            "Sofreír la carne con la salsa de tomate",
            "Intercalar capas de pasta, carne y queso en una fuente",
            "Hornear durante 30 minutos a 180°C."
        ]
    },
    { 
        titulo: "Brownie", 
        ingredientes: ["chocolate", "azúcar", "harina"], 
        categoria: "postres",
        instrucciones: [
            "Derretir el chocolate",
            "Mezclar con el azúcar y la harina",
            "Verter la mezcla en un molde",
            "Hornear durante 25 minutos a 180°C."
        ]
    },
    { 
        titulo: "Mojito", 
        ingredientes: ["menta", "ron", "limón", "azúcar"], 
        categoria: "bebidas",
        instrucciones: [
            "Machacar las hojas de menta con el azúcar y el jugo de limón",
            "Añadir hielo y ron",
            "Rellenar con soda y remover",
            "Servir frío."
        ]
    }
];

// Función para cargar recetas de localStorage o usar el array base solo la primera vez
function obtenerRecetas() {
    if (!localStorage.getItem('recetasInicializadas')) {
        localStorage.setItem('recetas', JSON.stringify(recetasBase));
        localStorage.setItem('recetasInicializadas', 'true');
    }
    return JSON.parse(localStorage.getItem('recetas')) || [];
}

// Función para eliminar una receta por índice
function eliminarReceta(index) {
    let recetasGuardadas = obtenerRecetas();
    recetasGuardadas.splice(index, 1); // Elimina la receta en la posición del índice
    localStorage.setItem('recetas', JSON.stringify(recetasGuardadas)); // Actualiza localStorage
    filtrarPorCategoria(); // Actualiza la lista de recetas
}

// Función para filtrar recetas por categoría y mostrarlas
function filtrarPorCategoria() {
    const filtroCategoria = document.getElementById("filtro-categoria");
    if (!filtroCategoria) return; // Evita errores si el elemento no está en el DOM

    const resultadoFiltro = document.getElementById("resultado-filtro");
    const categoriaSeleccionada = filtroCategoria.value;

    const recetas = obtenerRecetas(); 
    resultadoFiltro.innerHTML = ""; // Limpiar resultados previos

    const recetasFiltradas = categoriaSeleccionada === "todas"
        ? recetas
        : recetas.filter(receta => receta.categoria === categoriaSeleccionada);

    if (recetasFiltradas.length === 0) {
        resultadoFiltro.innerHTML = "<p>No hay recetas en esta categoría.</p>";
    } else {
        recetasFiltradas.forEach((receta, index) => {
            let instruccionesNumeradas;

            // Si las instrucciones ya están en formato HTML (contienen <br>), no las volvemos a procesar
            if (receta.instrucciones.includes("<br>")) {
                instruccionesNumeradas = receta.instrucciones; // Dejar tal cual
            } else if (Array.isArray(receta.instrucciones)) {
                // Si es un array, numerar y formatear
                instruccionesNumeradas = receta.instrucciones.map((instruccion, i) => {
                    return `${i + 1}. ${instruccion.trim()}`;
                }).join(".<br>"); // Separar los pasos con <br>
            } else {
                // Si las instrucciones son un string sin formato, se convierte en array 
                instruccionesNumeradas = receta.instrucciones.split(". ").map((instruccion, i) => {
                    return `${i + 1}. ${instruccion.trim()}`;
                }).join(".<br>");
            }

            const recetaDiv = document.createElement("div");
            recetaDiv.classList.add("receta");

            const recetaInfo = `
                <div class="receta-header">
                    <p class="receta-titulo"><strong>${receta.titulo}</strong></p>
                    <p class="receta-ingredientes"><strong>Ingredientes:</strong> ${receta.ingredientes.join(", ")}</p>
                    <button class="btn-toggle" data-index="${index}">▼</button>
                    <button class="btn-eliminar" data-index="${index}">Eliminar</button>
                </div>
                <div class="instrucciones" id="instrucciones-${index}" style="display: none;">
                    <p style="margin-bottom: 20px;"><strong>Instrucciones:</strong></p>
                    <p>${instruccionesNumeradas}</p>
                </div>
            `;
            recetaDiv.innerHTML = recetaInfo;
            resultadoFiltro.appendChild(recetaDiv);
        });

        // Añadir eventos a los botones de despliegue
        document.querySelectorAll(".btn-toggle").forEach(button => {
            button.addEventListener("click", function() {
                const index = this.getAttribute("data-index");
                const recetaDiv = this.closest(".receta");
                const instruccionesDiv = document.getElementById(`instrucciones-${index}`);

                if (instruccionesDiv.style.display === "none") {
                    instruccionesDiv.style.display = "block";
                    recetaDiv.classList.add("active");
                    this.innerHTML = "▲";
                } else {
                    instruccionesDiv.style.display = "none";
                    recetaDiv.classList.remove("active");
                    this.innerHTML = "▼";
                }
            });
        });

        // Añadir eventos a los botones de eliminar
        document.querySelectorAll(".btn-eliminar").forEach(button => {
            button.addEventListener("click", function() {
                const index = this.getAttribute("data-index");
                if (confirm("¿Estás seguro de que deseas eliminar esta receta?")) {
                    eliminarReceta(index);
                }
            });
        });
    }

    console.log("Recetas filtradas para la categoría:", categoriaSeleccionada, recetasFiltradas);
}

// Función para manejar el formulario de agregar receta
function manejarFormularioReceta(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo')?.value.trim();
    const categoria = document.getElementById('categoria')?.value;
    const ingredientes = document.getElementById('ingredientes')?.value.trim()
        .split(",").map(ingrediente => ingrediente.trim()); // Eliminar espacios en blanco innecesarios

    const instrucciones = document.getElementById('instrucciones')?.value.trim();
    const instruccionesFormateadas = formatearInstrucciones(instrucciones); // Formatear las instrucciones

    if (!titulo || !categoria || !ingredientes.length || !instrucciones) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    const nuevaReceta = {
        titulo: titulo,
        categoria: categoria,
        ingredientes: ingredientes,
        instrucciones: instruccionesFormateadas
    };

    let recetasGuardadas = obtenerRecetas();
    recetasGuardadas.push(nuevaReceta);
    localStorage.setItem('recetas', JSON.stringify(recetasGuardadas));
    document.getElementById('form-receta')?.reset();
    alert('Receta agregada con éxito');
    filtrarPorCategoria();
}


// Función para formatear las instrucciones antes de guardarlas o mostrarlas
function formatearInstrucciones(instrucciones) {
    // Si las instrucciones son un array, se procesan
    if (Array.isArray(instrucciones)) {
        return instrucciones.map((inst, i) => {
            const paso = inst.trim();
            // Asegurarse de que no haya dos puntos finales
            return `${i + 1}. ${paso.replace(/\.*$/, '')}.`; // Remueve puntos finales previos y agrega uno
        }).join("<br>"); // Separar los pasos con <br>
    }

    // Si las instrucciones son un string, se procesan
    return instrucciones.split("\n").map((inst, i) => {
        const paso = inst.trim().replace(/^\d+\.\s*/, ""); // Eliminar numeración manual si existe
        // Asegurarse de que no haya dos puntos finales
        return `${i + 1}. ${paso.replace(/\.*$/, '')}.`; // Remueve puntos finales previos y agrega uno
    }).join("<br>"); // Separar los pasos con <br>
}



// Inicialización de eventos cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    const filtroCategoria = document.getElementById("filtro-categoria");
    if (filtroCategoria) {
        filtroCategoria.addEventListener("change", filtrarPorCategoria);
    }

    const formReceta = document.getElementById('form-receta');
    if (formReceta) {
        formReceta.addEventListener('submit', manejarFormularioReceta);
    }

    // Mostrar el mensaje indicativo para las instrucciones
    const instruccionesInput = document.getElementById('instrucciones');
    if (instruccionesInput) {
        const instruccionesHelpText = document.createElement('p');
        instruccionesHelpText.innerText = "Ingrese cada paso y presione 'Enter' después de cada uno para agregarlo.";
        instruccionesHelpText.style.color = "gray";
        instruccionesHelpText.style.fontSize = "12px";
        instruccionesInput.parentNode.insertBefore(instruccionesHelpText, instruccionesInput.nextSibling);
    }
    filtrarPorCategoria(); // Asegura que las recetas se carguen correctamente
});



