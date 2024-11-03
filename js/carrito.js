let cartContainer = document.getElementById("cart-section")
let totalContainer = document.getElementById("total-carrito")
let completarContainer = document.getElementById("completar-pedido")
let borrarCarritoContainer = document.getElementById("borrar-carrito")
let cartContainerResumen = document.getElementById("cart-section-resumen")
let cartStorage = localStorage.getItem("cartProducts") // Carga valores previos

function renderCarrito(cartItems) {
    while (cartContainer.firstChild) {
        cartContainer.removeChild(cartContainer.firstChild)  // vacia contenido nodo
    }
    cartItems.forEach(producto => {
        const card = document.createElement("div")
        card.className = "contenedorElemento"
        card.innerHTML = ` <span class="col-6">${producto.nombre}</span> 
                            <span class="col-1">$${producto.precio}</span>
                             <button class="col -1 productoIncrementar" id="${producto.id}"> + </button>
                            <span class="col-1 colCant">${producto.cantidad}</span>
                            <button class="col-1 productoDecrementar" id="${producto.id}"> - </button>
                            <span class="col-1 colSubtotal">$${producto.subtotal}</span>
                            <button class="col-1 productoEliminar" id="${producto.id}"> X </button>
                            `
        cartContainer.appendChild(card)

        deleteFromCartButton() // lee eventos botones
        addUnitToCartButton()
        substractUnitToCartButton()
        calcularTotal()  // agrega total
    })
}

function deleteFromCartButton() {
    deleteButton = document.querySelectorAll(".productoEliminar")
    deleteButton.forEach(button => {
        button.onclick = (e) => {
            const productId = e.currentTarget.id
            cartStorage = cartStorage.filter((producto) => producto.id !== Number(productId))  // retira item seleccionado
            localStorage.setItem("cartProducts", JSON.stringify(cartStorage))
            calcularTotal()
            renderCarrito(cartStorage)  // actualiza
        }
    })
}

function addUnitToCartButton() {  // agrega una unidad
    addUnButton = document.querySelectorAll(".productoIncrementar")
    addUnButton.forEach(button => {
        button.onclick = (e) => {
            const productId = e.currentTarget.id
            const productos2 = cartStorage.map((producto) => {
                if (producto.id === Number(productId)) {
                    if (producto.cantidad < 10) {      // maxima cantidad a agregar =10
                        producto.cantidad++
                    }
                    producto.subtotal = producto.precio * producto.cantidad
                    return producto
                } else {
                    return producto
                }
            })
            localStorage.setItem("cartProducts", JSON.stringify(cartStorage))
            renderCarrito(cartStorage)
        }
    })
}

function substractUnitToCartButton() {  // resta una unidad del producto
    addUnButton = document.querySelectorAll(".productoDecrementar")
    addUnButton.forEach(button => {
        button.onclick = (e) => {
            const productId = e.currentTarget.id

            const productos2 = cartStorage.map((producto) => {
                if (producto.id === Number(productId)) {
                    if (producto.cantidad > 1) {      // minima cantidad a agregar =1
                        producto.cantidad--
                    }
                    producto.subtotal = producto.precio * producto.cantidad
                    return producto
                } else {
                    return producto
                }
            })
            localStorage.setItem("cartProducts", JSON.stringify(cartStorage))
            renderCarrito(cartStorage)
        }
    })
}

function calcularTotal() {
    let total = cartStorage.reduce((sumaTotal, producto) => sumaTotal + producto.subtotal, 0)
    totalContainer.innerHTML = `<span class="importeTot"> Importe total   Ar$ ${total}</span>`
}

function borrarCarritoCompleto() {
    cartStorage = []
    localStorage.setItem("cartProducts", JSON.stringify(cartStorage))
    calcularTotal()
    renderCarrito(cartStorage)
}

function renderCarritoResumen(cartItems) {  // Muestra contenido carrito
    while (cartContainerResumen.firstChild) {
        cartContainerResumen.removeChild(cartContainerResumen.firstChild)  // vacia contenido nodo
    }
    cartItems.forEach(producto => {
        const card = document.createElement("div")
        card.className = "contenedorElemento"
        card.innerHTML = ` <span class="col-6">${producto.nombre}</span> 
                            <span class="col-1">$${producto.precio}</span>
                             <button class="col -1 productoIncrementar" id="${producto.id}"> + </button>
                            <span class="col-1 colCant">${producto.cantidad}</span>
                            <button class="col-1 productoDecrementar" id="${producto.id}"> - </button>
                            <span class="col-1 colSubtotal">$${producto.subtotal}</span>
                            <button class="col-1 productoEliminar" id="${producto.id}"> X </button>
                            `
        cartContainerResumen.appendChild(card)
        calcularTotal()  // agrega total
    })
}

cartStorage = JSON.parse(cartStorage)  // carga valores del storage
renderCarrito(cartStorage)      // muestra carrito

completarContainer.onclick = () => {  // si se presiona botón completar pedido
    if (cartStorage.length == 0) {  // no se avanza si el carrito está vacío
        Swal.fire({
            title: "El carrito está vacío",
            text: "Debe cargar al menos 1 item para avanzar con la compra",
            icon: "warning",
            confirmButtonColor: "#FFA500",
            footer: '<a href="calendario.html">Puedes seleccionar productos en este link</a>'
        })
    } else {
        window.location.href = "resumen.html"  // si hay items en carrito se va a página Resumen
    }
}

borrarCarritoContainer.onclick = () => {  // se presiona botón de vaciar carrito
    if (cartStorage.length == 0) {  // Mensaje de error por tratar de borrar carrito vacío
        Swal.fire({
            title: "El carrito está vacío",
            text: "Debe tener al menos 1 item para vaciar el carrito",
            icon: "warning",
            confirmButtonColor: "#FFA500",
            footer: '<a href="calendario.html">Puedes seleccionar productos en este link</a>'
        })
    } else {  // hay contenido en el carrito
        Swal.fire({
            title: "Desea vaciar el carrito?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Si",
            denyButtonText: `No`,
            confirmButtonColor: "#087210",
            denyButtonColor: "#FFA500 "
        }).then((result) => {  // si se confirma 
            if (result.isConfirmed) {
                borrarCarritoCompleto()
                Swal.fire({
                    title: "Carrito vacío",
                    text:"Todos los productos se retiraron del carrito",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#087210"
                })
            } else if (result.isDenied) {  // si usuario no quiere borrar
                Swal.fire({
                    title: "No se modificó el carrito",
                    text:"Puedes continuar con la compra",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#087210",
                })
            }
        })
    }
}
