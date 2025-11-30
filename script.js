// ===============================================================
// OBJETOS Y ARRAY PRINCIPAL
// ===============================================================

// Limpiar localStorage para pruebas
//localStorage.clear();

// Cursos disponibles
const cursos = [
    { nombre: "Matemáticas", codigo: "MAT101", maxEstudiantes: 5, estudiantes: [] },
    { nombre: "Historia", codigo: "HIS201", maxEstudiantes: 4, estudiantes: [] },
    { nombre: "Programación", codigo: "PRO301", maxEstudiantes: 6, estudiantes: [] }
];

// Expresiones regulares para validar estudiantes
const regex = {
    nombre: /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{3,30}$/,
    email: /^[\w.-]+@[\w.-]+\.\w+$/,
    edad: /^[1-9][0-9]?$|^100$/  // entre 1 y 100
};

// ===============================================================
// SELECTORES DEL DOM
// ===============================================================
const selectCurso = document.querySelector("#selectCurso");
const formEstudiante = document.querySelector("#formEstudiante");
const nombreInput = document.querySelector("#nombre");
const emailInput = document.querySelector("#email");
const edadInput = document.querySelector("#edad");
const errorNombre = document.querySelector("#errorNombre");
const errorEmail = document.querySelector("#errorEmail");
const errorEdad = document.querySelector("#errorEdad");
const listaCursosDiv = document.querySelector("#listaCursos");

// ===============================================================
// INICIALIZACIÓN: Rellenar select con cursos
// ===============================================================
function inicializarSelect() {
    cursos.forEach((curso, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = curso.nombre + " (" + curso.codigo + ")";
        selectCurso.appendChild(option);
    });
}

// ===============================================================
// FUNCIONES DE VALIDACIÓN
// ===============================================================
function validarCampo(input, regex, errorElemento, mensaje) {
    if(regex.test(input.value.trim())) {
        input.classList.add("correcto");
        input.classList.remove("incorrecto");
        errorElemento.textContent = "";
        return true;
    } else {
        input.classList.add("incorrecto");
        input.classList.remove("correcto");
        errorElemento.textContent = mensaje;
        return false;
    }
}

// ===============================================================
// FUNCION PARA MOSTRAR CURSOS Y ESTUDIANTES
// ===============================================================
function mostrarCursos() {
    listaCursosDiv.innerHTML = ""; // limpiar

    cursos.forEach((curso, index) => {
        const cursoDiv = document.createElement("div");
        cursoDiv.className = "card p-3 mb-2 shadow-sm";

        // Título y botón de ocultar/mostrar
        const titulo = document.createElement("h5");
        titulo.textContent = curso.nombre + " (" + curso.estudiantes.length + "/" + curso.maxEstudiantes + ")";
        const btnToggle = document.createElement("button");
        btnToggle.textContent = "Mostrar/Ocultar estudiantes";
        btnToggle.className = "btn btn-sm btn-secondary btn-toggle ms-2";

        // Lista de estudiantes
        const ul = document.createElement("ul");
        ul.className = "mt-2";
        ul.style.display = "none"; // inicialmente oculta
        curso.estudiantes.forEach(est => {
            const li = document.createElement("li");
            li.textContent = est.nombre + " - " + est.email + " - " + est.edad + " años";
            ul.appendChild(li);
        });

        // Evento para mostrar/ocultar lista
        btnToggle.addEventListener("click", () => {
            if(ul.style.display === "none") ul.style.display = "block";
            else ul.style.display = "none";
        });

        cursoDiv.appendChild(titulo);
        cursoDiv.appendChild(btnToggle);
        cursoDiv.appendChild(ul);
        listaCursosDiv.appendChild(cursoDiv);
    });
}

// ===============================================================
// CARGAR DATOS DE LOCALSTORAGE
// ===============================================================
function cargarDatos() {
    const datos = localStorage.getItem("cursos");
    if(datos) {
        const cursosGuardados = JSON.parse(datos);
        cursos.forEach((curso, i) => {
            curso.estudiantes = cursosGuardados[i].estudiantes || [];
        });
    }
}

// ===============================================================
// EVENTO DE REGISTRO DE ESTUDIANTE
// ===============================================================
formEstudiante.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validaciones
    const valNombre = validarCampo(nombreInput, regex.nombre, errorNombre, "Nombre inválido");
    const valEmail = validarCampo(emailInput, regex.email, errorEmail, "Email inválido");
    const valEdad = validarCampo(edadInput, regex.edad, errorEdad, "Edad inválida");

    if(!valNombre || !valEmail || !valEdad) return;

    const cursoSeleccionado = cursos[parseInt(selectCurso.value)];

    if(cursoSeleccionado.estudiantes.length >= cursoSeleccionado.maxEstudiantes) {
        alert("Curso completo");
        return;
    }

    const estudiante = {
        nombre: nombreInput.value.trim(),
        email: emailInput.value.trim(),
        edad: edadInput.value.trim()
    };

    cursoSeleccionado.estudiantes.push(estudiante);

    // Guardar en localStorage
    localStorage.setItem("cursos", JSON.stringify(cursos));

    // Guardar último estudiante en sessionStorage
    sessionStorage.setItem("ultimoEstudiante", JSON.stringify(estudiante));

    // Limpiar formulario
    formEstudiante.reset();
    nombreInput.classList.remove("correcto");
    emailInput.classList.remove("correcto");
    edadInput.classList.remove("correcto");

    // Mostrar cursos y estudiantes
    mostrarCursos();
});

// ===============================================================
// INICIALIZACIÓN
// ===============================================================
inicializarSelect();
cargarDatos();
mostrarCursos();
