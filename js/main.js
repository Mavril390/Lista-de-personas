const nombreInput = document.getElementById("nombre");
const edadInput = document.getElementById("edad");
const listPersonas = document.querySelector('.li-container ul');
let personas = []; //Lista de personas

eventListeners()
function eventListeners() {
  document.addEventListener('DOMContentLoaded', () => {
    personas = JSON.parse(localStorage.getItem('personas')) || [];
    createHTML();
  });

  listPersonas.addEventListener('click', deletePersona);
}

// Funcion de eliminar persona
function deletePersona(e) {
  if (e.target.tagName == 'SPAN') {
    showError("Eliminando persona...")
    setTimeout(() => {
      const deleteId = parseInt(e.target.getAttribute('persona-id'));
      personas = personas.filter(persona => persona.id !== deleteId);
      createHTML();
      verificacionVerdadera()
    }, 2000)
  }
}

// Promesa de verificacion para los campos 'Edad' y 'Nombre'
const verificacion = (res) => {
  return new Promise((resolve, reject) => {
    res ? resolve('Proceso completado') : reject('Datos incorrectos')
  })
}

// Promesa verdadera
const verificacionVerdadera = () => {
  verificacion(true)
    .then((mensaje) => {
      showError(mensaje);
    })
}

// Promesa falsa
const verificacionFalsa = () => {
  verificacion(false)
    .catch((mensaje) => {
      showError(mensaje);
    })
}

// Error si el campo 'Nombre' o 'Edad' esta vacío
const campoVacio = (nombre, edad) => {
  return ((nombre === '') || (edad === ''))
}

// Error si el campo 'Nombre' no contiene letras
const nombreNoCorrecto = (nombre) => {
  return (!/^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s\ ])+$/i.test(nombre))
}

// Error si el campo 'Edad' no contiene numeros
const edadNoCorrecta = (edad) => {
  return (isNaN(edad) && edad == null && edad == "")
}

// Verifica si los campos 'Nombre' y 'Edad' son correcots
const verificacionCamposCorrectos = (nombre, edad) => {
  if (campoVacio(nombre, edad)) {
    return false;
  }
  else if (nombreNoCorrecto(nombre)) {
    return false;
  }
  else if (edadNoCorrecta(edad)) {
    return false;
  }
  else {
    return true;
  }
}

// Funcion de agregar persona nueva
function agregarPersona() {
  showError("Agregando persona...")
  setTimeout(() => {
    const nombre = nombreInput.value;
    const edad = edadInput.value;

    if (verificacionCamposCorrectos(nombre, edad)) {
      const personaObj = {
        nombre,
        edad,
        id: Date.now()
      }
      personas = [...personas, personaObj]

      createHTML();
      nombreInput.value = '';
      edadInput.value = ''
      verificacionVerdadera()
    }
    else {
      verificacionFalsa()
    }
  }, 2000)
}

// Funcion de crear elemento nuevo
function createHTML() {
  clearHTML();

  if (personas.length > 0) {
    personas.forEach(persona => {
      const li = document.createElement('li');
      li.innerHTML =
        `<div class="persona">
          <div class="persona--nombre">
            <div class="persona__titulo">Nombre</div>
            <div class="persona__dato">${persona.nombre}</div>
          </div>
          <div class="persona--edad">
            <div class="persona__titulo">Edad</div>
            <div class="persona__dato">${persona.edad}</div>
          </div>
          <div class="persona--borrar">
            <span class="btn-delete" persona-id="${persona.id}">X</span>
          </div>
         </div>`;

      listPersonas.appendChild(li);
    });
  }

  sincronizationStorage();
}

// Sincronizacion con el Storage
function sincronizationStorage() {
  localStorage.setItem('personas', JSON.stringify(personas));
}

// Toastify 
function showError(text) {
  Toastify({
    text: text,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "rgb(255, 255, 255)",
      color: "black"
    },
    onClick: function () { }
  }).showToast();
}

// Limpia el HTML
function clearHTML() {
  listPersonas.innerHTML = '';
}
