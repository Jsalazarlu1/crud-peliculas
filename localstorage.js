// ===============================
// VARIABLES GLOBALES
// ===============================
let peliculas = JSON.parse(localStorage.getItem("peliculas")) || [];
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
    { user: "admin", pass: "admin123" },
    { user: "usuario", pass: "1234" },
    { user: "demo", pass: "demo" }
];

let peliculaEditando = null;

// ===============================
// ELEMENTOS DOM
// ===============================
const loginSection = document.getElementById("loginSection");
const mainContent = document.getElementById("mainContent");
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const btnAgregar = document.getElementById("btnAgregar");

const gridPeliculas = document.getElementById("gridPeliculas");
const carouselMovies = document.getElementById("carouselMovies");
const sinResultados = document.getElementById("sinResultados");

const inputBuscar = document.getElementById("inputBuscar");
const selectGenero = document.getElementById("selectGenero");

// ===============================
// LOGIN
// ===============================
document.getElementById("formLogin").addEventListener("submit", e => {
    e.preventDefault();
    const user = inputUser.value;
    const pass = inputPassword.value;

    const valido = usuarios.find(u => u.user === user && u.pass === pass);

    if (valido) {
        localStorage.setItem("logueado", user);
        mostrarSistema();
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});

btnLogout.addEventListener("click", () => {
    localStorage.removeItem("logueado");
    location.reload();
});

function mostrarSistema() {
    loginSection.style.display = "none";
    mainContent.style.display = "block";
    btnLogin.style.display = "none";
    btnLogout.style.display = "inline-block";
    btnAgregar.style.display = "inline-block";
    renderPeliculas();
}

if (localStorage.getItem("logueado")) {
    mostrarSistema();
}

// ===============================
// REGISTRO
// ===============================
document.getElementById("formRegistro").addEventListener("submit", e => {
    e.preventDefault();

    const user = inputUserReg.value;
    const pass = inputPasswordReg.value;
    const confirm = inputConfirmPassword.value;

    if (pass !== confirm) {
        alert("Las contraseñas no coinciden");
        return;
    }

    usuarios.push({ user, pass });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Usuario registrado");
    document.getElementById("login-tab").click();
});

// ===============================
// CRUD PELÍCULAS
// ===============================
btnAgregar.addEventListener("click", () => {
    peliculaEditando = null;
    formPelicula.reset();
    modalTitulo.innerText = "Agregar Película";
});

btnGuardarPelicula.addEventListener("click", () => {
    const pelicula = {
        id: peliculaEditando ?? Date.now(),
        titulo: inputTitulo.value,
        genero: inputGenero.value,
        director: inputDirector.value,
        ano: inputAno.value,
        calificacion: inputCalificacion.value,
        descripcion: inputDescripcion.value,
        imagen: inputImagen.value
    };

    if (peliculaEditando) {
        peliculas = peliculas.map(p => p.id === peliculaEditando ? pelicula : p);
    } else {
        peliculas.push(pelicula);
    }

    localStorage.setItem("peliculas", JSON.stringify(peliculas));
    bootstrap.Modal.getInstance(modalPelicula).hide();
    renderPeliculas();
});

// ===============================
// RENDER PELÍCULAS
// ===============================
function renderPeliculas() {
    gridPeliculas.innerHTML = "";
    carouselMovies.innerHTML = "";

    let filtradas = peliculas.filter(p =>
        p.titulo.toLowerCase().includes(inputBuscar.value.toLowerCase()) &&
        (selectGenero.value === "" || p.genero === selectGenero.value)
    );

    sinResultados.style.display = filtradas.length ? "none" : "block";

    filtradas.forEach(p => {
        // GRID
        gridPeliculas.innerHTML += `
        <div class="col-md-4">
            <div class="movie-card">
                <img src="${p.imagen}" class="movie-image">
                <div class="movie-content">
                    <div class="movie-title">${p.titulo}</div>
                    <span class="movie-genre">${p.genero}</span>
                    <div class="movie-rating">${p.calificacion} ⭐</div>
                    <div class="movie-description">${p.descripcion}</div>
                    <div class="movie-actions">
                        <button class="btn btn-info btn-sm" onclick="verDetalles(${p.id})">Ver</button>
                        <button class="btn btn-warning btn-sm" onclick="editarPelicula(${p.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarPelicula(${p.id})">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>`;

        // SLIDER
        carouselMovies.innerHTML += `
        <div class="slider-movie-card" onclick="verDetalles(${p.id})">
            <img src="${p.imagen}">
            <div class="slider-movie-info">
                <h6>${p.titulo}</h6>
            </div>
        </div>`;
    });
}

// ===============================
// ACCIONES
// ===============================
function eliminarPelicula(id) {
    if (confirm("¿Eliminar película?")) {
        peliculas = peliculas.filter(p => p.id !== id);
        localStorage.setItem("peliculas", JSON.stringify(peliculas));
        renderPeliculas();
    }
}

function editarPelicula(id) {
    const p = peliculas.find(p => p.id === id);
    peliculaEditando = id;

    inputTitulo.value = p.titulo;
    inputGenero.value = p.genero;
    inputDirector.value = p.director;
    inputAno.value = p.ano;
    inputCalificacion.value = p.calificacion;
    inputDescripcion.value = p.descripcion;
    inputImagen.value = p.imagen;

    modalTitulo.innerText = "Editar Película";
    new bootstrap.Modal(modalPelicula).show();
}

function verDetalles(id) {
    const p = peliculas.find(p => p.id === id);

    detallesTitulo.innerText = p.titulo;
    detallesGenero.innerText = p.genero;
    detallesDirector.innerText = p.director;
    detallesAno.innerText = p.ano;
    detallesCalificacion.innerText = p.calificacion;
    detallesDescripcion.innerText = p.descripcion;
    detallesImagen.src = p.imagen;

    new bootstrap.Modal(modalDetalles).show();
}

// ===============================
// BUSCADOR Y FILTRO
// ===============================
inputBuscar.addEventListener("input", renderPeliculas);
selectGenero.addEventListener("change", renderPeliculas);

// ===============================
// SLIDER
// ===============================
function scrollSlider(dir) {
    carouselMovies.scrollLeft += dir * 300;
}
