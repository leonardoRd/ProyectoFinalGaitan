// Variables globales
let id,nombre,precioVenta,precioAlquiler,ambientes,direccion,descripcion,alquilado,formulario;
// Variables para guardar los datos ingresados por pantalla
let varId,varNombre,varPrecioVenta,varPrecioAlquiler,varAmbientes,varDireccion,varDescripcion,varAlquilado;
// array de inmuebles
let inmuebles = [];
let inmuebleById, btnReset;


/* Variable para saber que modo de ejecucion es, si es cero funciona como un nuevo registo
 Si es distinto de cero es modo editar */
let idEditar = 0;

class Inmueble{
    constructor(id,nombre,precioVenta,precioAlquiler,ambientes,direccion,descripcion,alquilado){
        this.id = id
        this.nombre = nombre
        this.precioVenta = precioVenta
        this.precioAlquiler = precioAlquiler
        this.ambientes = ambientes
        this.direccion = direccion
        this.descripcion = descripcion
        this.alquilado = alquilado
    }
}

function inicializarElementos() {
    id = document.getElementById("id");
    nombre = document.getElementById("nombre");
    precioVenta = document.getElementById("precioVenta");
    precioAlquiler = document.getElementById("precioAlquiler");
    ambientes = document.getElementById("cantidadAmbientes");
    direccion = document.getElementById("direccion");
    descripcion = document.getElementById("descripcion");
    alquilado = document.getElementById("alquilado");
    formulario = document.getElementById("formulario");        
    btnReset = document.getElementById("btnReset");  
}

function inicializarEventos() {
    formulario.onsubmit = (event) => validarFormInmueble(event);

    btnReset.onclick = () => borrarDatos();
}

function obtenerValores() {
    varId = parseFloat(id.value);
    varNombre = nombre.value;
    varPrecioVenta = parseFloat(precioVenta.value);
    varPrecioAlquiler = parseFloat(precioAlquiler.value);
    varAmbientes = parseFloat(ambientes.value);
    varDireccion = direccion.value;
    varDescripcion = descripcion.value;
    varAlquilado = alquilado.value;
}

// Si el inmueble no existe lo carga al array y al localStorage
function validarFormInmueble(event) {
    event.preventDefault();    
    obtenerValores();
    if (!idEditar) {
        // Modo Nuevo        
        const idExiste = inmuebles.some((inmueble) => Number(inmueble.id) === Number(varId));
        if (!idExiste) {        
            let inmuebleNuevo = new Inmueble(varId,varNombre,varPrecioVenta,varPrecioAlquiler,varAmbientes,varDireccion,varDescripcion,varAlquilado);
            inmuebles.push(inmuebleNuevo);                
            crearInmuebleServer(inmuebleNuevo);
            formulario.reset();
            mostrarMensaje("success","Yeaah...","Inmueble agregado exitosamente!",2000);
        }else{           
            mostrarMensaje("error", "Oops...","El ID ingresado ya existe en el sistema",4000);
        }    
    }else{
        //Modo Editar
        let inmuebleAActualizar = new Inmueble(varId,varNombre,varPrecioVenta,varPrecioAlquiler,varAmbientes,varDireccion,varDescripcion,varAlquilado);
        console.log(inmuebleAActualizar)
        actualizarInmuebleServer(inmuebleAActualizar);
        formulario.reset();        
    }    
    
}

function agregarInmuebleStorage() {
    let inmueblesJSON = JSON.stringify(inmuebles);
    localStorage.setItem("inmuebles", inmueblesJSON);
}

function obtenerInmueblesLocalStorage() {
    let inmueblesJSON = localStorage.getItem("inmuebles");
    if (inmueblesJSON != undefined) {
        inmuebles = JSON.parse(inmueblesJSON);        
    }
}

// Funciones Fetch

// Metodo GET
function consultarInmueblesServer() {
    fetch("https://642e165a2b883abc6406c24c.mockapi.io/Inmuebles")    
        .then((response) => response.json())
        .then((jsonResponse) => {
            inmuebles = jsonResponse;            
        });        
}

// Metodo POST
function crearInmuebleServer(inmueble) {
    fetch("https://642e165a2b883abc6406c24c.mockapi.io/Inmuebles", {
      method: "POST",
      body: JSON.stringify(inmueble),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {        
        console.log(jsonResponse);        
      });
}

// Metodo PUT
function actualizarInmuebleServer(inmueble) {
    fetch(`https://642e165a2b883abc6406c24c.mockapi.io/Inmuebles/${idEditar}`, {
      method: "PUT",
      body: JSON.stringify(inmueble),
    })
        .then((response) => response.json())
        .then((jsonResponse) => {        
            console.log(jsonResponse);   
            localStorage.removeItem("idEditar");
            confirmarActualizarInmueble();
        });
}

// Metodo GET/ID
function consultarInmuebleServerByID(id) {
    fetch(`https://642e165a2b883abc6406c24c.mockapi.io/Inmuebles/${id}`)    
        .then((response) => response.json())
        .then((jsonResponse) => {
            inmuebleById = jsonResponse;                        
            completarElementosFormulario();
        });        
}

// Funciones para mostrar mensaje
function mostrarMensaje(tipo,titulo,texto,tiempo) {
    Swal.fire({
        icon: tipo,
        title: titulo,
        text: texto,        
        timer: tiempo,
    })
}
function confirmarActualizarInmueble() {
    Swal.fire({
        title: 'Actualizado',
        text: "¡Se actualizó su inmueble!",
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Volver a Home'
      }).then((result) => {
            if (result.isConfirmed) {
                redirect();             
            }
        })
}

function redirect() {
    window.location.href = '/index.html';     
}

function completarElementosFormulario() {        
    let inmuebleBuscado = inmuebleById;
    if (inmuebleBuscado) {        
        id.value = inmuebleBuscado.id;
        nombre.value = inmuebleBuscado.nombre;
        precioVenta.value = inmuebleBuscado.precioVenta;
        precioAlquiler.value = inmuebleBuscado.precioAlquiler;    
        ambientes.value = inmuebleBuscado.ambientes;
        direccion.value = inmuebleBuscado.direccion;
        descripcion.value = inmuebleBuscado.descripcion;
    }else{
        mostrarMensaje("error","Oops...","No se encontró Inmueble, verifique los datos.",5000);
    }    
}

// Es utilizada para pasar al modo nuevo cuando el modo actual es editar
function borrarDatos() {        
    formulario.reset();
    localStorage.removeItem("idEditar");
    verificarModoEjecucion();
    mostrarMensaje("warning", "Cuidado!", "Cambiado a Modo Agregar!",2000);
}

function verificarModoEjecucion() {
    idEditar = localStorage.getItem('idEditar');
    if (!idEditar) {
        // Modo Nuevo        
        consultarInmueblesServer();       
    }else{
        //Modo Editar
        consultarInmuebleServerByID(idEditar);        
    }    
}

// Funcion principal
function main() {
    //localStorage.clear();    
    inicializarElementos();
    inicializarEventos();

    // Verifica el modo(Nuevo/Editar)
    verificarModoEjecucion();
}

main();