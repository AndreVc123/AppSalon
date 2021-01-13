//Variables Globales
let pagina = 1;
const cita = {
    nombre = '',
    fecha = '',
    hora = '',
    servicios: []
}

//addEventListener
document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
})

//Funciones
function iniciarApp() {
    mostrarServicios();

    mostrarSeccion();

    cambiarSeccion();

    paginaSiguiente();

    paginaAnterior();

    //Comprueba pagina actual
    botonesPaginador();

    //Muestra el resumen de la cita
    mostrarResumen();

    //Almacena el nombre
    nombreCita();
    fechaCita();

    //desabilita dias pasados
    fechaAnterior();

    //almacena hora
    horaCita();
}

function mostrarSeccion() {

    const seccionAnterior = document.querySelector('.mostrar-seccion');

    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    const tabAnterior =  document.querySelector('.tabs .actual');
    
    if(tabAnterior){

        tabAnterior.classList.remove('actual');
    }

    //Resalta el Tab Actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces =document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            
            pagina = parseInt(e.target.dataset.paso)

            mostrarSeccion();
            botonesPaginador();

        })
    })
}

async function mostrarServicios() {
    try {

        const url = 'http://localhost:3000/AppSalon/servicios.php';
        

        const resultado = await fetch('./servicios.json');
        const {servicios} = await resultado.json();

        servicios.forEach(servicio => {
            const {id, nombre, precio} = servicio; 
            
            //DOM Scripting
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar Contenedor
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;

            //Inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectar en html
            document.querySelector('#servicios').appendChild(servicioDiv);

        });


    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    
    let elemento;

    if(e.target.tagName === "P"){
        elemento = e.target.parentElement;
    }else{
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent, 
        }
        

        agregarServicio(servicioObj);
    }


}

function eliminarServicio(id) {
    const { servicios } = cita;

    cita.servicios = servicios.filter(servicio => servicio.id != id);

    console.log(cita)
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;

    cita.servicios = [ ...servicios, servicioObj];

}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    })
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    })
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1){
        paginaAnterior.classList.add('ocultar');
    }else if(pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen();
    }else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();

    
}

function mostrarResumen() {
    const { nombre, fecha, hora, servicios} = cita;

    const resumenDiv = document.querySelector('.contenido-resumen');

    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }
    
    if (Object.values(cita).includes('') || cita.servicios.length < 1) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicio, hora, fecha o nombre';
        noServicios.classList.add('invalidar-cita');

        resumenDiv.appendChild(noServicios);
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Datos de la Cita';

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`

    const servicioCita = document.createElement('DIV');
    servicioCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    servicioCita.appendChild(headingServicios);

    let cantidad = 0;

    servicios.forEach(servicio => {
        const { nombre, precio} = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        cantidad = cantidad + parseInt(totalServicio[1].trim());

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        servicioCita.appendChild(contenedorServicio)
    })

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(servicioCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span>$${cantidad}`
    resumenDiv.appendChild(cantidadPagar);

    const botonReservacion = document.createElement('BUTTON');
    botonReservacion.classList.add('btn-reservacion');
    botonReservacion.textContent = 'Pagar ';
    resumenDiv.appendChild(botonReservacion);

}

function nombreCita() {
    const nombreInput = document.querySelector('#Nombre');

    nombreInput.addEventListener('input', (e)=> {
        
        const nombreTexto = e.target.value.trim();

        if(nombreTexto === '' || nombreTexto.length < 2){
            mostrarAlerta('Nombre no valido', 'error');
        }else{
            const alerta = document.querySelector('.alerta');
            if(alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto
        }

    })
}

function mostrarAlerta(mensaje, tipo) {

    const alertaPrevia = document.querySelector('.alerta');

    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta')

    if(tipo === 'error') {
        alerta.classList.add('error')
    }

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

}

function fechaCita() {
    const fecha = document.querySelector('#Fecha');

    fecha.addEventListener('input', (e) => {
        const dia = new Date(e.target.value);

        if([0,6].includes(dia)){
            mostrarAlerta('Fines de semana no validos', 'error');
            return;
        }else{
            const alerta = document.querySelector('.alerta');
            if(alerta) {
                alerta.remove();
            }
            cita.fecha = dia;
        }   
    })
}

function fechaAnterior() {
    const inputFecha = document.querySelector('#Fecha');

    const fechaAhora = new Date();

    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;
    let fechaDeshanilitar;

    if(mes < 10) {
        fechaDeshanilitar = `${year}-0${mes}-${dia}`;
    }else{
        fechaDeshanilitar = `${year}-${mes}-${dia}`;
    }
    
    inputFecha.min = fechaDeshanilitar;


}

function horaCita() {
    const inputHora = document.querySelector('#Hora');
    inputHora.addEventListener('input', (e) => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if (parseInt(hora[0]) < 10 || parseInt(hora[0]) > 18) {
            mostrarAlerta('Hora no valida', 'error');
            return;
        }else {
            const alerta = document.querySelector('.alerta');
            if(alerta) {
                alerta.remove();
            }
            cita.hora = horaCita;

            console.log(cita)
            
        }
    })
}