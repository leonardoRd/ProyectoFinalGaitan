// https://mockapi.io/projects/642e165a2b883abc6406c24d
let inmuebles = [];
let contenedorInmueblesHome;
let borrarStorage;
// Variables para el manejo del modal
let botonesCerrarModalBuscarInmueble,modalAddProduct,botonBuscarInmueble,valorABuscar,contenedorModal;

function inicializarElementos() {
    contenedorInmueblesHome = document.getElementById("contenedorInmuebles");    
    borrarStorage = document.getElementById("limpiarStorage");

    botonesCerrarModalBuscarInmueble = document.getElementsByClassName("btnCerrarModalBuscarInmueble");
    modalAddProduct = document.getElementById("modalBuscarInmueble");
    botonBuscarInmueble = document.getElementById("btnBuscarInmueble");// Boton que abre el modal(Buscar)
    valorABuscar = document.getElementById("valorABuscar");//Nombre Inmueble a buscar
    contenedorModal = document.getElementById("contenedorModal");
    modal = new bootstrap.Modal(modalAddProduct);
}

function inicializarEventosIndex() {
    borrarStorage.onclick = () => eliminarStorage();

    botonBuscarInmueble.onclick = abrirModalAgregarProducto;

    for (const boton of botonesCerrarModalBuscarInmueble) {
        boton.onclick = cerrarModalAgregarProducto;
    }
}

function abrirModalAgregarProducto() {
    let nombreInmueble = valorABuscar.value;    
    const inmuebleAbuscar = inmuebles.find(function(elemento) {
        return elemento.nombre == nombreInmueble;
      });
    
    if (inmuebleAbuscar) {
        // Lo encontró
        mostrarCardEnModal(inmuebleAbuscar);
        modal.show();
    }else{
        // No lo encontró
        swal.fire({
            icon: "error",
            title: "Falló",
            text: "No se encontró el inmueble",        
            timer: 3000,
        })
    }
    valorABuscar.value = "";
}
  
function cerrarModalAgregarProducto() {
    //formulario.reset();
    modal.hide();
}

function mostrarCardEnModal(inmuebleEncontrado) {
    contenedorModal.innerHTML = "";
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `        
        <div class="card-body" style="background-color: rgb(223, 217, 217);">
            <h4 class="card-title"><b>${inmuebleEncontrado.nombre}</b> </h4>
            <p class="card-text">ID:
                <b>${inmuebleEncontrado.id}</b>
            </p>
            <p class="card-text">Precio Venta:
                <b>${inmuebleEncontrado.precioVenta}</b>
            </p>
            <p class="card-text">Precio Alquiler:
                <b>${inmuebleEncontrado.precioAlquiler}</b>
            </p>
            <p class="card-text">Ambientes:
                <b>${inmuebleEncontrado.ambientes}</b>
            </p>
            <p class="card-text">Dirección:
                <b>${inmuebleEncontrado.direccion}</b>
            </p>
            <p class="card-text">Descripción:
                <b>${inmuebleEncontrado.descripcion}</b>
            </p>
        </div>`;
    contenedorModal.append(card);

}

function obtenerInmueblesLocalStorage() {
    let inmueblesJSON = localStorage.getItem("inmuebles");
    if (inmueblesJSON != undefined) {
        inmuebles = JSON.parse(inmueblesJSON);
        mostrarProductos();
    }
}

// Funciones Fetch
function consultarInmueblesServer() {
    fetch("https://642e165a2b883abc6406c24c.mockapi.io/Inmuebles")    
        .then((response) => response.json())
        .then((jsonResponse) => {
            inmuebles = jsonResponse;      
            mostrarProductos();      
        });
}

function eliminarInmuebleServer(id) {
    fetch(`https://642e165a2b883abc6406c24c.mockapi.io/Inmuebles/${id}`, {
      method: "DELETE",      
    }).then((response) => response.json()).then((jsonResponse) => {        
        console.log(jsonResponse);      
      });
}

function mostrarProductos() {
    contenedorInmueblesHome.innerHTML = "";
    inmuebles.forEach(elem => {
        let columna = document.createElement("div");
        columna.className = "col-md-4 mt-2";
        columna.id = `columna-${elem.id}`;
        columna.innerHTML = `
        <div class="card">
            <div class="card-body" style="background-color: rgb(223, 217, 217);">
            <h4 class="card-title"><b>${elem.nombre}</b> </h4>
            <p class="card-text">ID:
                <b>${elem.id}</b>
            </p>
            <p class="card-text">Precio Venta:
                <b>${elem.precioVenta}</b>
            </p>
            <p class="card-text">Precio Alquiler:
                <b>${elem.precioAlquiler}</b>
            </p>
            <p class="card-text">Ambientes:
                <b>${elem.ambientes}</b>
            </p>
            <p class="card-text">Dirección:
                <b>${elem.direccion}</b>
            </p>
            <p class="card-text">Descripción:
                <b>${elem.descripcion}</b>
            </p>
            </div>
            <div class="card-footer text-center">
                <button class="btn btn-danger" id="botonEliminar-${elem.id}" >Eliminar</button>
                <button class="btn btn-secondary" id="botonEditar-${elem.id}" >Editar</button>
            </div>
        </div>`;
        contenedorInmueblesHome.append(columna);

        let botonEliminar = document.getElementById(`botonEliminar-${elem.id}`);
        botonEliminar.onclick = () => eliminarProducto(elem.id);

        let botonEditar = document.getElementById(`botonEditar-${elem.id}`);        
        botonEditar.addEventListener('click', function() {
            const paramEditar = elem.id;
            // Agrego al localStorage el parametro del id a editar para ser reconocido por la pagina de carga
            localStorage.setItem('idEditar', paramEditar);
            window.location.href = '/cargarInmuebles.html';
        });

    });
}

function eliminarProducto(idInmueble) {
    Swal.fire({
        title: 'Está seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Borrar ahora!'
      }).then((result) => {
            if (result.isConfirmed) {
                borrarInmuebleConfirmado(idInmueble);                
            }
        })    
}

function borrarInmuebleConfirmado(idInmueble) {
    let columnaBorrar = document.getElementById(`columna-${idInmueble}`);
    let indiceBorrar = inmuebles.findIndex(
      (inmueble) => Number(inmueble.id) === Number(idInmueble)
    );
  
    inmuebles.splice(indiceBorrar, 1);
    columnaBorrar.remove();
    eliminarInmuebleServer(idInmueble);   
    Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "Se ha borrado con éxito!.",        
        timer: 2000,
    })     
}


function eliminarStorage() {
    swal.fire({
        title: 'Está seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Borrar Storage!'
      }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                swal.fire({
                    title: "Yeaah...",
                    text: "Borrado Exitosamente!",
                    icon: "success",
                    timer: 2000,
                })     
            }
        }) 
}

function main() {
    inicializarElementos();   
    inicializarEventosIndex(); 
    //obtenerInmueblesLocalStorage();    
    consultarInmueblesServer();
}
    
main();