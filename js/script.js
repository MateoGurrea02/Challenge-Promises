// Función para obtener los jugadores del localStorage
const obtenerJugadoresLocalStorage = () => {
    const jugadoresString = localStorage.getItem('jugadores');
    return jugadoresString ? JSON.parse(jugadoresString).sort((a,b) => a.nombre.localeCompare(b.nombre)) : [];
};

// Función para guardar los jugadores en el localStorage
const guardarJugadoresLocalStorage = (jugadores) => {
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
};

// Función asíncrona para agregar un nuevo jugador al equipo usando un prompt de HTML
const agregarJugador = async () => {
    try {
        // Solicitar al usuario que ingrese los datos del jugador
        const nombre = prompt("Ingrese el nombre del jugador:");
        const edad = parseInt(prompt("Ingrese la edad del jugador:"));
        const posicion = prompt("Ingrese la posición del jugador:");
        const estado = prompt("Ingrese el estado del jugador(Tiitular/Suplente):")

        // Obtener los jugadores del localStorage
        let jugadores = obtenerJugadoresLocalStorage();

        console.log(jugadores)
        // Verificar si el jugador ya existe en el equipo
        const jugadorExistente = jugadores.find(jugador => jugador.nombre === nombre);
        if (jugadorExistente) {
            throw new Error('El jugador ya está en el equipo.')
        }

        // Agregar el nuevo jugador al array de jugadores
        if(nombre === '' || edad === null || posicion === '' || estado === ''){
            alert('Debe completar todos los campos')
        }else{
            jugadores.push({ id:jugadores.length, nombre, edad, posicion, estado});

            // Guardar los jugadores actualizados en el localStorage
            guardarJugadoresLocalStorage(jugadores);

            // Simular una demora de 1 segundo para la operación asíncrona
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mostrar un mensaje de éxito
            alert('Jugador agregado correctamente.');

            //Renderizar jugadores
            listarJugadores()
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
};


// Función asíncrona para listar todos los jugadores del equipo
const listarJugadores = async () => {
    // Implementación para listar todos los jugadores
    let contenedor = document.getElementById('contenedor')
    contenedor.innerHTML = ''
    let jugadores = await obtenerJugadoresLocalStorage()
    if(jugadores == []){
        alert('No hay jugadores')
    }
    jugadores.map((jugador) => {
        let ul = document.createElement('ul')
        ul.setAttribute('id',`jugador${jugador.id}`)
        ul.innerHTML =`
        <li>${jugador.nombre}</li>
        <li>${jugador.edad}</li>
        <li>${jugador.posicion}</li>
        <li>${jugador.estado}</li>
        <button onclick="asignarPosicion(${jugador.id})">Cambiar Posicion</button>
        `
        contenedor.appendChild(ul)
    })
};

// Función asíncrona para asignar una nueva posición a un jugador
const asignarPosicion = async (jugadorId) => {
    // Implementación para asignar una nueva posición a un jugador
    let jugadores = await obtenerJugadoresLocalStorage() 
    let jugadorCambioPosicion = jugadores.find((jugador) => jugador.id == jugadorId)
    let nuevaPosicion = prompt('Ingresa la nueva posicion')
    let nuevoJugador = {
        id:jugadorCambioPosicion.id,
        nombre: jugadorCambioPosicion.nombre,
        edad:jugadorCambioPosicion.edad,
        posicion: nuevaPosicion,
        estado: jugadorCambioPosicion.estado,
    }
    let nuevaLista = jugadores.filter((jugador)=>jugador.id != jugadorId)
    nuevaLista.push(nuevoJugador)
    guardarJugadoresLocalStorage(nuevaLista)
    alert('Posicion Cambiada')
    listarJugadores()
};

// Función asíncrona para realizar un cambio durante un partido
const realizarCambio = async () => {
    let contadorCambios = await localStorage.getItem('contador');
    // Implementación para realizar un cambio durante un partido
    if(await contadorCambios === null ){
        contadorCambios = localStorage.setItem('contador', 3)
        realizarCambio()
    }
    else if(await contadorCambios <= 0){
        alert('Ya se realizaron todos los cambios')
        listarJugadores()
    }
    else{
        let contenedor = document.getElementById('contenedor')
        contenedor.innerHTML = ''
        let jugadores = await obtenerJugadoresLocalStorage()
        let jugadoresTitulares = jugadores.filter((j)=> j.estado === 'Titular')
        let jugadoresSuplentes = jugadores.filter((j)=> j.estado === 'Suplente')

        if(jugadores == []){
            alert('No hay jugadores')
        }else{
            contadorCambios = await localStorage.getItem('contador');
            let selectJugadorSale = document.createElement('select')
            let selectJugadorEntra = document.createElement('select')
            let botonCambiarjugador = document.createElement('button')
            let contador = document.createElement('p')
            contador.innerHTML = `${contadorCambios}`
            botonCambiarjugador.innerHTML = 'Agregar'

            contenedor.appendChild(selectJugadorSale)
            contenedor.appendChild(selectJugadorEntra)
            contenedor.appendChild(botonCambiarjugador)
            contenedor.appendChild(contador)

            jugadoresTitulares.map((jugador) => {
                let option = document.createElement('option')
                option.setAttribute('value',`${jugador.id}`)
                option.innerHTML =`<a>${jugador.nombre}</a>`
                selectJugadorSale.appendChild(option)
            })
            jugadoresSuplentes.map((jugador) => {
                let option = document.createElement('option')
                option.setAttribute('value',`${jugador.id}`)
                option.innerHTML =`<a>${jugador.nombre}</a>`
                selectJugadorEntra.appendChild(option)
            })
            
            botonCambiarjugador.addEventListener('click',()=>{
                let jugadorSale = jugadores.find((j)=> j.id == selectJugadorSale.options[selectJugadorSale.selectedIndex].value)
                let jugadorEntra = jugadores.find((j)=> j.id == selectJugadorEntra.options[selectJugadorEntra.selectedIndex].value)
                let nuevoJugadorSale ={
                    id:jugadorSale.id,
                    nombre:jugadorSale.nombre,
                    edad:jugadorSale.edad,
                    posicion:jugadorSale.posicion,
                    estado:'Suplente',
                } 
                let nuevoJugadorEntra ={
                    id:jugadorEntra.id,
                    nombre:jugadorEntra.nombre,
                    edad:jugadorEntra.edad,
                    posicion:jugadorEntra.posicion,
                    estado:'Titular',
                } 

                let nuevaLista = jugadores.filter((jugador)=>jugador.id != selectJugadorEntra.value && jugador.id != selectJugadorSale.value)

                nuevaLista.push(nuevoJugadorEntra,nuevoJugadorSale)

                guardarJugadoresLocalStorage(nuevaLista)

                localStorage.setItem('contador', contadorCambios - 1)
                realizarCambio()
            })
        }
    }
     
};
const borrarDatos = ()=>{
    localStorage.clear()
}

// Función principal asíncrona que interactúa con el usuario
const main = async () => {
    try {
        // Lógica para interactuar con el usuario y llamar a las funciones adecuadas
    } catch (error) {
        console.error('Error:', error);
    }
};

// Llamar a la función principal para iniciar la aplicación
main();
