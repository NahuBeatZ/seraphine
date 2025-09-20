// --------------------
// Productos con etiquetas
const productos = [
  { id: 1, nombre: "Labial", precio: 1500, categoria: "belleza", imagen: "img/labial.jpg", etiqueta: "Nuevo" },
  { id: 2, nombre: "Collar", precio: 2500, categoria: "accesorios", imagen: "img/collar.jpg", etiqueta: "Oferta" },
  { id: 3, nombre: "Remera", precio: 4000, categoria: "ropa", imagen: "img/remera.jpg", etiqueta: "" },
  { id: 4, nombre: "Licuadora", precio: 12000, categoria: "electrodomesticos", imagen: "img/licuadora.jpg", etiqueta: "Oferta" },
];

let carrito = [];

// --------------------
// DOM
const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const cartCount = document.getElementById("cart-count");
const carritoDiv = document.getElementById("carrito");
const checkoutBtn = document.getElementById("checkout-btn");
const buscadorInput = document.getElementById("buscador");
const categoriaBanner = document.getElementById("categoria-banner");
const filtroEtiqueta = document.getElementById("filtro-etiqueta");
const filtroPrecio = document.getElementById("filtro-precio");
const btnAplicarFiltros = document.getElementById("aplicar-filtros");
const btnLimpiarFiltros = document.getElementById("limpiar-filtros");

// --------------------
// Mostrar productos
function mostrarProductos(categoria = null, filtro = "") {
  contenedorProductos.innerHTML = "";
  actualizarCategoriaActiva(categoria);
  actualizarBanner(categoria);

  let filtrados = categoria ? productos.filter(p => p.categoria === categoria) : productos;
  if (filtro) filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()));

  if(filtrados.length === 0){
    contenedorProductos.innerHTML = "<p style='text-align:center; color:#555;'>No se encontraron productos.</p>";
    return;
  }

  filtrados.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      ${p.etiqueta ? `<span class="etiqueta">${p.etiqueta}</span>` : ""}
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <button onclick="agregarAlCarrito(${p.id})">Agregar</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

// --------------------
// Mostrar productos filtrados
function mostrarProductosFiltrados(productosFiltrados){
  contenedorProductos.innerHTML = "";
  if(productosFiltrados.length === 0){
    contenedorProductos.innerHTML = "<p style='text-align:center; color:#555;'>No se encontraron productos.</p>";
    return;
  }
  productosFiltrados.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      ${p.etiqueta ? `<span class="etiqueta">${p.etiqueta}</span>` : ""}
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <button onclick="agregarAlCarrito(${p.id})">Agregar</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

// --------------------
// Carrito
function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  const itemEnCarrito = carrito.find(p => p.id === id);

  if(itemEnCarrito){
    itemEnCarrito.cantidad += 1;
  } else {
    carrito.push({ ...prod, cantidad: 1 });
  }

  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.nombre} - $${p.precio} x 
      <input type="number" min="1" value="${p.cantidad}" data-index="${i}" class="cantidad-input">
      = $${p.precio * p.cantidad} 
      <button data-index="${i}" class="eliminar-btn">❌</button>
    `;
    listaCarrito.appendChild(li);
    total += p.precio * p.cantidad;
  });

  if(carrito.length > 0){
    const totalLi = document.createElement("li");
    totalLi.innerHTML = `<strong>Total: $${total}</strong>`;
    listaCarrito.appendChild(totalLi);
  }

  cartCount.textContent = carrito.reduce((sum, p) => sum + p.cantidad, 0);

  // Eventos dinámicos
  document.querySelectorAll(".cantidad-input").forEach(input => {
    input.addEventListener("change", e => {
      const index = e.target.dataset.index;
      carrito[index].cantidad = parseInt(e.target.value) || 1;
      actualizarCarrito();
    });
  });

  document.querySelectorAll(".eliminar-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = e.target.dataset.index;
      carrito.splice(index, 1);
      actualizarCarrito();
    });
  });

  // Guardar en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// --------------------
// Toggle carrito
document.getElementById("cart-btn").addEventListener("click", () => {
  carritoDiv.classList.toggle("mostrar");
});

// --------------------
// Checkout
checkoutBtn.addEventListener("click", () => {
  if(carrito.length === 0){
    alert("El carrito está vacío.");
    return;
  }
  alert("Compra realizada con éxito.\nOpciones:\n- Retiro en local\n- Envío a domicilio");
  carrito = [];
  actualizarCarrito();
  carritoDiv.classList.remove("mostrar");
});

// --------------------
// Buscador
buscadorInput.addEventListener("input", e => {
  const filtro = e.target.value;
  const categoria = window.location.hash.replace("#", "") || null;
  mostrarProductos(categoria, filtro);
});

// --------------------
// Categoría activa y banner
function actualizarCategoriaActiva(categoria) {
  document.querySelectorAll("nav a").forEach(link => {
    link.classList.toggle("activa", link.dataset.category === categoria);
  });
}

function actualizarBanner(categoria) {
  const emojis = {
    belleza: "🌸 Belleza",
    accesorios: "💍 Accesorios",
    ropa: "👕 Ropa",
    electrodomesticos: "🍳 Electrodomésticos"
  };
  categoriaBanner.textContent = categoria ? (emojis[categoria] || categoria) : "Todos los productos";
}

// --------------------
// Filtrar por categoría
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const categoria = e.target.dataset.category;
    window.location.hash = categoria;
    mostrarProductos(categoria, buscadorInput.value);
  });
});

// --------------------
// Filtros etiqueta y precio
btnAplicarFiltros.addEventListener("click", () => {
  const categoria = window.location.hash.replace("#", "") || null;
  const etiqueta = filtroEtiqueta.value;
  const precioMax = parseFloat(filtroPrecio.value) || Infinity;

  let filtrados = categoria ? productos.filter(p => p.categoria === categoria) : productos;
  if (etiqueta) filtrados = filtrados.filter(p => p.etiqueta === etiqueta);
  filtrados = filtrados.filter(p => p.precio <= precioMax);

  mostrarProductosFiltrados(filtrados);
});

btnLimpiarFiltros.addEventListener("click", () => {
  filtroEtiqueta.value = "";
  filtroPrecio.value = "";
  const categoria = window.location.hash.replace("#", "") || null;
  mostrarProductos(categoria, buscadorInput.value);
});

// --------------------
// Cargar carrito desde localStorage y mostrar productos según hash
window.addEventListener("load", () => {
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  actualizarCarrito();
  const hash = window.location.hash.replace("#", "");
  mostrarProductos(hash || null);
});

// Detectar cambio de hash
window.addEventListener("hashchange", () => {
  const hash = window.location.hash.replace("#", "");
  mostrarProductos(hash || null, buscadorInput.value);
});
