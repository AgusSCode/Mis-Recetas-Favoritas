// Array de recetas inicial para simular base de datos local
const recetasBase = [
    { titulo: "Ensalada César", ingredientes: ["lechuga", "pollo", "queso parmesano", "crutones"], categoria: "entradas" },
    { titulo: "Sopa de Tomate", ingredientes: ["tomate", "ajo", "albahaca"], categoria: "entradas" },
    { titulo: "Lasagna", ingredientes: ["pasta", "queso", "carne", "salsa de tomate"], categoria: "platos-principales" },
    { titulo: "Brownie", ingredientes: ["chocolate", "azúcar", "harina"], categoria: "postres" },
    { titulo: "Mojito", ingredientes: ["menta", "ron", "limón", "azúcar"], categoria: "bebidas" }
];

// Función para cargar recetas de localStorage o usar el array base
function obtenerRecetas() {
    const recetasGuardadas = JSON.parse(localStorage.getItem('recetas')) || recetasBase;
    return recetasGuardadas;
}

// Función para mostrar recetas filtradas por categoría
function filtrarPorCategoria() {
    const filtroCategoria = document.getElementById("filtro-categoria");
    if (!filtroCategoria) return; // Evita errores si el elemento no está en el DOM

    const resultadoFiltro = document.getElementById("resultado-filtro");
    const categoriaSeleccionada = filtroCategoria.value;

    // Obtiene las recetas desde localStorage o usa las recetas base
    const recetas = obtenerRecetas(); // Aquí aseguramos que usamos las recetas actualizadas

    resultadoFiltro.innerHTML = ""; // Limpiar resultados previos

    const recetasFiltradas = categoriaSeleccionada === "todas"
        ? recetas
        : recetas.filter(receta => receta.categoria === categoriaSeleccionada);

    if (recetasFiltradas.length === 0) {
        resultadoFiltro.innerHTML = "<p>No hay recetas en esta categoría.</p>";
    } else {
        recetasFiltradas.forEach(receta => {
            const p = document.createElement("p");
            p.innerHTML = `<strong>${receta.titulo}</strong><br>Ingredientes: ${receta.ingredientes.join(", ")}`;
            resultadoFiltro.appendChild(p);
        });
    }

    // Depuración: mostrar recetas filtradas en la consola
    console.log("Recetas filtradas para la categoría:", categoriaSeleccionada, recetasFiltradas);
}

// Función para manejar el formulario de agregar receta
function manejarFormularioReceta(event) {
    event.preventDefault(); // Evita el envío del formulario

    // Obtiene los valores del formulario
    const titulo = document.getElementById('titulo')?.value.trim();
    const categoria = document.getElementById('categoria')?.value;
    const ingredientes = document.getElementById('ingredientes')?.value.trim().split(",").map(ingrediente => ingrediente.trim());
    const instrucciones = document.getElementById('instrucciones')?.value.trim();

    // Verifica que los campos no estén vacíos
    if (!titulo || !categoria || !ingredientes.length || !instrucciones) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Crea una nueva receta
    const nuevaReceta = {
        titulo: titulo,
        categoria: categoria,
        ingredientes: ingredientes,
        instrucciones: instrucciones
    };

    // Depuración: muestra el objeto nuevaReceta para verificar
    console.log("Nueva receta agregada:", nuevaReceta);

    // Obtiene las recetas almacenadas en localStorage
    let recetasGuardadas = obtenerRecetas();

    // Agrega la nueva receta al array
    recetasGuardadas.push(nuevaReceta);

    // Guarda el array actualizado en localStorage
    localStorage.setItem('recetas', JSON.stringify(recetasGuardadas));

    // Depuración: muestra el array actualizado en localStorage
    console.log("Recetas actualizadas en localStorage:", recetasGuardadas);

    // Limpia el formulario
    document.getElementById('form-receta')?.reset();

    // Mensaje de confirmación (opcional)
    alert('Receta agregada con éxito');

    // Actualiza la lista de recetas filtradas
    filtrarPorCategoria(); // Llama a la función de filtrado para actualizar la vista
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

    // Aplica el filtro de categoría al cargar la página
    filtrarPorCategoria(); // Asegura que las recetas se carguen correctamente
});
