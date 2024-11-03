
let cartProducts = []
let cantidadCarrito = document.getElementById("cantidad-container")
let productsContainer = document.getElementById("products-container")

class ProductoCarrito {
    constructor(imagen, nombre, precio, id) {
        this.imagen = imagen
        this.nombre = nombre
        this.precio = precio
        this.id = id
        this.cantidad = 1
        this.subtotal = 0
    }

    obtenerTotal() {
        this.subtotal = this.precio * this.cantidad
    }
}

function renderProductos(productsArray) {   // muestra productos dinamicamente en pagina

    productsArray.forEach(producto => {

        const card = document.createElement("div")
        card.className = "tarjetaCalendario"
        card.innerHTML = `<img class="imagenCalendario" src="../img/${producto.img}" alt="${producto.nombre}" />
                          <h3 class="descripCal">${producto.nombre}</h3>
                          <p class="precio">Precio: $${producto.precio}</p>
                          <button class="productoAgregar" id="${producto.id}">Agregar al Carrito</button>`
        productsContainer.appendChild(card)
    })
    addToCartButton()
    cantidadProductosCarrito()
}

function addToCartButton() {  // agrega al carrito el producto asociado al boton correspondiente
    addButton = document.querySelectorAll(".productoAgregar")
    addButton.forEach(button => {
        button.onclick = (e) => {
            const productId = e.currentTarget.id
            const selectedProduct = productos.find(producto => producto.id == productId)  // selecciona producto
            const datosProducto = new ProductoCarrito(selectedProduct.img, selectedProduct.nombre, selectedProduct.precio, selectedProduct.id)
            datosProducto.obtenerTotal()

            if (cartProducts) { // verifica si existe para incrementar cantidad o crear nuevo
                const existeEnCarrito = cartProducts.some(producto => producto.id === datosProducto.id)
                if (existeEnCarrito) {
                    const productos2 = cartProducts.map((producto) => {
                        if (producto.id === datosProducto.id) {
                            producto.cantidad++
                            producto.subtotal = producto.precio * producto.cantidad
                            return producto
                        } else {
                            return producto
                        }
                    })
                    cartProducts = productos2 // carga cantidad modificada
                } else {
                    cartProducts.push(datosProducto)  // agrega producto
                }
            } else {
                cartProducts.push(datosProducto)
            }

            localStorage.setItem("cartProducts", JSON.stringify(cartProducts))
            Toastify({
                text: "Producto agregado",
                duration: 2000,
                style: {
                    background: "linear-gradient(to right, #D9B967 , #8EC3A7)",
                  },
                gravity: "top",
                position: 'right',
            }).showToast()
            cantidadProductosCarrito()
        }
    })

}

function cantidadProductosCarrito() {  // contador items carrito
    let contarProductos = 0
    if (Number(productos.length) > 0) {
        contarProductos = cartProducts.reduce((cantidad, producto) => cantidad + producto.cantidad, 0)
        if (contarProductos) {
            cantidadCarrito.innerHTML = `${contarProductos}`
        }
    }
}

function fetchData(url) { // lee datos de json y verifica errores
    try {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error leyendo datos')
                }
                return response.json()
            })
            .then(data => {
                productos = data.slice()
                renderProductos(data)
            })
            .catch(error => {
                Toastify({
                    text: "Error carga de datos",
                    duration: -1,
                    style: {
                        background: "linear-gradient(to right, #E54D24 , #DDB249)",
                      },
                    
                    gravity: "top",
                    position: 'left',
                    close:true,
                }).showToast()
                
            })
    } catch (error) {
        Toastify({
            text: "Error carga de datos",
            duration: -1,
            style: {
                background: "linear-gradient(to right, #E54D24 , #DDB249)",
              },
            
            gravity: "top",
            position: 'left',
            close:true,
        }).showToast()
        
    }
}


productos = []
cartProducts = localStorage.getItem("cartProducts") // carga valores de storage

if (cartProducts) {
    cartProducts = JSON.parse(cartProducts)  // si no está vacio almacenamiento lo carga
} else {
    cartProducts = []
}

fetchData("/db/data.json") // Lee datos de json