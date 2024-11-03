let formularioCarrito = document.getElementById("formulario-carrito")
let totalContainerResumen = document.getElementById("total-carrito-resumen")
let cartContainerResumen = document.getElementById("cart-section-resumen")
let cartStorage = localStorage.getItem("cartProducts") 

const inputEmail = document.querySelector('#input-email')
const inputName = document.querySelector('#input-name')
const inputSurname = document.querySelector('#input-surname')
const inputDni = document.querySelector('#input-dni')
const inputPhone = document.querySelector('#input-phone')
const hasNumber = /\d/
const btnSubmit = document.querySelector('#completar-pedido')

const resetForm = () => {
    inputEmail.value = ''
    inputName.value = ''
    inputSurname.value = ''
    inputDni.value = ''
    inputPhone.value = ''
}

const validateEmail = (email) => {   // valida formato del correo
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

function borrarCarritoCompleto() {
    cartStorage = []
    localStorage.setItem("cartProducts", JSON.stringify(cartStorage))
}

function calcularTotal() {   // define monto total del carrito
    let total = cartStorage.reduce((sumaTotal, producto) => sumaTotal + producto.subtotal, 0)
    totalContainerResumen.innerHTML = `<span class="importeTotResumen"> Importe total   Ar$ ${total}</span>`
}

function renderCarritoResumen(cartItems) {  // muestra datos carrito en resumen
    while (cartContainerResumen.firstChild) {
        cartContainerResumen.removeChild(cartContainerResumen.firstChild)  // vacia contenido nodo
    }
    cartItems.forEach(producto => {
        const card = document.createElement("div")
        card.className = "contenedorElemento"
        card.innerHTML = ` <span class="col-6">${producto.nombre}</span> 
                            <span class="col-1">$${producto.precio}</span>  
                            <span class="col-1 colCantResumen">${producto.cantidad}</span>
                            <span class="col-1 colSubtotal">$${producto.subtotal}</span>  `
        cartContainerResumen.appendChild(card)

        calcularTotal()  // agrega total
    })
}

// carga valores desde storage
cartStorage = JSON.parse(cartStorage)

// muestra carrito
renderCarritoResumen(cartStorage)

// Al ganar foco
inputEmail.addEventListener('focus', () => {
    inputEmail.classList.add('focus')
})
inputName.addEventListener('focus', () => {
    inputName.classList.add('focus')
})
inputSurname.addEventListener('focus', () => {
    inputSurname.classList.add('focus')
})
inputDni.addEventListener('focus', () => {
    inputDni.classList.add('focus')
})
inputPhone.addEventListener('focus', () => {
    inputPhone.classList.add('focus')
})

//Al perder foco evalua
inputEmail.addEventListener('blur', () => {
    if (inputEmail.value == '' || !validateEmail(inputEmail.value)) {
        inputEmail.classList.add('invalid')
    } else {
        if (inputEmail.classList.contains('invalid'))
            inputEmail.classList.toggle('invalid')
    }
})
inputName.addEventListener('blur', () => {
    if (inputName.value == '' || hasNumber.test(inputName.value)) {
        inputName.classList.add('invalid')
    } else {
        if (inputName.classList.contains('invalid'))
            inputName.classList.toggle('invalid')
    }
})
inputSurname.addEventListener('blur', () => {
    if (inputSurname.value == '' || hasNumber.test(inputSurname.value)) {
        inputSurname.classList.add('invalid')
    } else {
        if (inputSurname.classList.contains('invalid'))
            inputSurname.classList.toggle('invalid')
    }
})
inputDni.addEventListener('blur', () => {
    if (inputDni.value == '') {
        inputDni.classList.add('invalid')
    } else {
        if (inputDni.classList.contains('invalid'))
            inputDni.classList.toggle('invalid')
    }
})
inputPhone.addEventListener('blur', () => {
    if (inputPhone.value == '') {
        inputPhone.classList.add('invalid')
    } else {
        if (inputPhone.classList.contains('invalid'))
            inputPhone.classList.toggle('invalid')
    }
})

//boton completar pedido presionado
btnSubmit.addEventListener('click', (e) => {
    e.preventDefault()
    let inputs = document.comprarForm.input
    let validToBuy = true
    if (cartStorage.length == 0) {  // verifica si hay contenido en carrito
        Swal.fire({
            title: "El carrito está vacío",
            text: "Debe cargar al menos 1 item para avanzar con la compra",
            icon: "warning",
            footer: '<a href="calendario.html">Puedes seleccionar productos en este link</a>'
        })
    } else {  // si hay contenido en carrito
        inputs.forEach(input => {
            if (input.value == '') {
                input.classList.add('invalid')
                validToBuy = false
            } else {
                if (input.classList.contains('invalid'))
                    validToBuy = false
            }
        })
        if (validToBuy) {   // si se puede avanzar la compra
            cartItems = []
            cartStorage = []
            borrarCarritoCompleto()
            renderCarritoResumen(cartItems)
            calcularTotal()
            resetForm()
            Swal.fire({
                title: "Compra finalizada",
                text: "Su pedido ha sido procesado correctamente",
                icon: "success",
                confirmButtonColor: "#087210",
                footer: '<span>Puede hacer un nuevo pedido en este <a href="calendario.html"> linK</a></span>'
            })
        } else {  // no está validado el formulario

            Swal.fire({
                title: "Datos incorrectos",
                text: "Por favor complete o modifique los campos resaltados en rojo",
                confirmButtonColor: "#FFA500",
                icon: "error",
            })

        }
    }

})

