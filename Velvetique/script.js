let carrito = []; // Guarda los productos añadidos en la sesión actual

function obtenerCantidad() {
  let cantidadSelect = document.getElementById("cantidad");

  if (cantidadSelect) {
    let valor = parseInt(cantidadSelect.value);

    // Verificamos que la opción elegida esté dentro del rango permitido (1 a 4)
    if (valor >= 1 && valor <= 4) {
      cantidadSelect.classList.remove("border-red");
      return valor;
    }
  }

  alert("Selección de cantidad no válida");
  if (cantidadSelect) {
    cantidadSelect.classList.add("border-red");
    cantidadSelect.focus();
  }
  return null;
}

function obtenerNombreProducto() {
  let tituloElemento = document.getElementById("nombreProducto");

  if (tituloElemento && tituloElemento.textContent.trim() !== "") {
    return tituloElemento.textContent.trim();
  } else {
    alert("No se encontró el nombre del producto");
    return null;
  }
}

function obtenerPrecioProducto() {
  // CORREGIDO: id cambiado a 'precioProducto' para coincidir con tu HTML
  let precioElemento = document.getElementById("precioProducto");

  if (precioElemento) {
    // Extrae solo los dígitos (Ejemplo: "$4990" -> 4990)
    let precioLimpio = parseInt(
      precioElemento.textContent.replace(/[^0-9]/g, ""),
    );
    if (!isNaN(precioLimpio) && precioLimpio > 0) {
      return precioLimpio;
    }
  }

  alert("Error al leer el precio del producto");
  return null;
}

function agregarAlCarrito() {
  let nombre = obtenerNombreProducto();
  let precio = obtenerPrecioProducto();
  let cantidad = obtenerCantidad();

  if (nombre !== null && precio !== null && cantidad !== null) {
    let producto = {
      nombre: nombre,
      precio: precio,
      cantidad: cantidad,
      subtotal: precio * cantidad,
    };

    // 1. Guardamos el producto en la variable global
    carrito.push(producto);

    // 2. Generamos la tabla del carrito
    mostrarCarrito();

    // 3. Ocultamos la vista del producto y mostramos el carrito
    let seccionProducto = document.getElementById("seccion-producto");
    let seccionCarrito = document.getElementById("seccion-carrito");

    if (seccionProducto && seccionCarrito) {
      seccionProducto.style.display = "none";
      seccionCarrito.style.display = "block";

      document.body.classList.add("fondo-carrito");
    }
  }
}

function volverAProducto() {
  let seccionProducto = document.getElementById("seccion-producto");
  let seccionCarrito = document.getElementById("seccion-carrito");

  if (seccionProducto && seccionCarrito) {
    seccionCarrito.style.display = "none";
    seccionProducto.style.display = "block";
    document.body.classList.remove("fondo-carrito");
  }
}

function cambiarImagen(miniatura) {
  let imagenPrincipal = document.getElementById("imgPrincipal");

  if (!imagenPrincipal) {
    alert(
      "ERROR: No se encontró la imagen grande. Revisa que tenga id='imgPrincipal' en el HTML.",
    );
    return;
  }

  // Cambia la ruta
  imagenPrincipal.src = miniatura.src;

  // Manejo de la clase activa
  let miniaturas = document.querySelectorAll(".miniaturas img");
  miniaturas.forEach((img) => img.classList.remove("activa"));
  miniatura.classList.add("activa");
}

//--------------- CARRITO --------------//
function obtenerCarritoGuardado() {
  let contenido = localStorage.getItem("carrito_velvetique");
  return contenido ? JSON.parse(contenido) : [];
}

function agregarAlCarrito() {
  let nombre = obtenerNombreProducto();
  let precio = obtenerPrecioProducto();
  let cantidad = obtenerCantidad();

  if (nombre !== null && precio !== null && cantidad !== null) {
    let carrito = obtenerCarritoGuardado();

    // Si el producto ya existe en el carrito, sumamos la cantidad
    let indiceExistente = carrito.findIndex((item) => item.nombre === nombre);

    if (indiceExistente !== -1) {
      carrito[indiceExistente].cantidad += cantidad;
      carrito[indiceExistente].subtotal =
        carrito[indiceExistente].precio * carrito[indiceExistente].cantidad;
    } else {
      carrito.push({
        nombre: nombre,
        precio: precio,
        cantidad: cantidad,
        subtotal: precio * cantidad,
      });
    }

    // Guardamos el arreglo actualizado en el navegador
    localStorage.setItem("carrito_velvetique", JSON.stringify(carrito));

    alert("¡Producto añadido al carrito!");
  }
}

//------------------MOSTRAR  CARRITO----------------//
function mostrarCarrito() {
  let contenedor = document.getElementById("vista-carrito");
  let totalElemento = document.getElementById("total-precio");

  if (!contenedor) return; // Si no estamos en la página del carrito, no hace nada

  let carrito = obtenerCarritoGuardado();

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío actualmente.</p>";
    if (totalElemento) totalElemento.textContent = "$0";
    return;
  }

  let htmlTabla = `
        <table class="tabla-carrito">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio Un.</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
    `;

  let totalPagar = 0;

  carrito.forEach((item) => {
    totalPagar += item.subtotal;
    htmlTabla += `
            <tr>
                <td>${item.nombre}</td>
                <td>$${item.precio.toLocaleString()}</td>
                <td>${item.cantidad}</td>
                <td>$${item.subtotal.toLocaleString()}</td>
            </tr>
        `;
  });

  htmlTabla += `</tbody></table>`;
  contenedor.innerHTML = htmlTabla;

  if (totalElemento) {
    totalElemento.textContent = "$" + totalPagar.toLocaleString();
  }
}

function procesarCompra() {
  let carrito = obtenerCarritoGuardado();
  if (carrito.length === 0) {
    alert("No hay productos en el carrito para comprar");
    return;
  }

  alert("¡Gracias por tu compra en Velvetique!");
  localStorage.removeItem("carrito_velvetique"); // Borra los datos almacenados
  mostrarCarrito(); // Refresca la pantalla
}

// ------------------ ADMINISTRACION ------------------
const regionesChile = {
  "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
  Tarapaca: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica"],
  Antofagasta: ["Antofagasta", "Calama", "Tocopilla", "Mejillones"],
  Coquimbo: ["La Serena", "Coquimbo", "Ovalle", "Illapel"],
  Valparaiso: ["Valparaiso", "Vina del Mar", "Quilpue", "San Antonio"],
  Metropolitana: ["Santiago", "Maipu", "Puente Alto", "Las Condes"],
  "O'Higgins": ["Rancagua", "Machali", "San Fernando", "Pichilemu"],
  Maule: ["Talca", "Curico", "Linares", "Constitucion"],
  Biobio: ["Concepcion", "Talcahuano", "Los Angeles", "Coronel"],
  "La Araucania": ["Temuco", "Angol", "Villarrica", "Pucón"],
  "Los Lagos": ["Puerto Montt", "Osorno", "Castro", "Ancud"],
  Aysen: ["Coyhaique", "Aysen", "Cochrane", "Chile Chico"],
  Magallanes: [
    "Punta Arenas",
    "Puerto Natales",
    "Porvenir",
    "Torres del Paine",
  ],
};

const adminStorage = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

function escaparHtml(value) {
  return String(value ?? "").replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ],
  );
}

function obtenerProductosAdmin() {
  return adminStorage.get("velvetique_productos", [
    {
      id: "p-1",
      code: "SKN001",
      name: "Anua Serum in Peach Water",
      description: "Serum hidratante",
      price: 4990,
      stock: 12,
      criticalStock: 3,
      category: "Skin Care",
      image: "",
      visible: true,
    },
    {
      id: "p-2",
      code: "MKP001",
      name: "Magnetic Eyeshadow Palette",
      description: "Paleta de sombras",
      price: 45990,
      stock: 2,
      criticalStock: 3,
      category: "Make Up",
      image: "",
      visible: true,
    },
  ]);
}

function obtenerUsuariosAdmin() {
  return adminStorage.get("velvetique_usuarios", [
    {
      id: "u-admin",
      run: "19011022K",
      name: "Administrador",
      lastname: "Velvetique",
      email: "admin@duoc.cl",
      birthdate: "",
      role: "Administrador",
      region: "Metropolitana",
      commune: "Santiago",
      address: "Casa matriz Velvetique",
    },
  ]);
}

function iniciarLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document
      .getElementById("login-email")
      .value.trim()
      .toLowerCase();
    const password = document.getElementById("login-password").value;
    if (email === "admin@duoc.cl" && password === "Admin123!") {
      sessionStorage.setItem(
        "velvetique_admin",
        JSON.stringify({ email, role: "Administrador" }),
      );
      window.location.href = "./admin.html";
      return;
    }
    alert(
      "Credenciales administrativas invalidas. Usa admin@duoc.cl para ingresar al panel.",
    );
  });
}

function protegerAdmin() {
  if (!sessionStorage.getItem("velvetique_admin")) {
    window.location.replace("./login.html");
    return false;
  }
  return true;
}

function mostrarVistaAdmin(vista) {
  document
    .querySelectorAll(".admin-view")
    .forEach((element) =>
      element.classList.toggle("hidden", element.id !== `view-${vista}`),
    );
  document
    .querySelectorAll(".admin-nav button")
    .forEach((button) =>
      button.classList.toggle("active", button.dataset.view === vista),
    );
  const title = document.getElementById("view-title");
  if (title) title.textContent = vista.charAt(0).toUpperCase() + vista.slice(1);
  if (vista === "productos") renderizarProductos();
  if (vista === "usuarios") renderizarUsuarios();
}

function actualizarEstadisticas() {
  const productos = obtenerProductosAdmin();
  const usuarios = obtenerUsuariosAdmin();
  document.getElementById("stat-products").textContent = productos.length;
  document.getElementById("stat-users").textContent = usuarios.length;
  document.getElementById("stat-critical").textContent = productos.filter(
    (product) => product.stock <= product.criticalStock,
  ).length;
}

function renderizarProductos() {
  const container = document.getElementById("product-list");
  if (!container) return;
  const productos = obtenerProductosAdmin();
  container.innerHTML = `<table><thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${productos.map((product) => `<tr><td><strong>${escaparHtml(product.name)}</strong><br><small>${escaparHtml(product.code)}</small></td><td>${escaparHtml(product.category)}</td><td>$${Number(product.price).toLocaleString("es-CL")}</td><td class="${product.stock <= product.criticalStock ? "low-stock" : ""}">${product.stock}${product.stock <= product.criticalStock ? " · Stock crítico" : ""}</td><td>${product.visible ? "Publicado" : "Oculto"}</td><td><button type="button" data-edit-product="${product.id}">Editar</button><button type="button" data-delete-product="${product.id}">Eliminar</button></td></tr>`).join("")}</tbody></table>`;
  container
    .querySelectorAll("[data-edit-product]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        editarProducto(button.dataset.editProduct),
      ),
    );
  container
    .querySelectorAll("[data-delete-product]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        eliminarProducto(button.dataset.deleteProduct),
      ),
    );
}

function validarProducto() {
  const fields = {
    code: document.getElementById("product-code").value.trim(),
    name: document.getElementById("product-name").value.trim(),
    description: document.getElementById("product-description").value.trim(),
    price: document.getElementById("product-price").value,
    stock: document.getElementById("product-stock").value,
    criticalStock: document.getElementById("product-critical-stock").value,
    category: document.getElementById("product-category").value,
  };
  if (fields.code.length < 3)
    return "El código es requerido y debe tener al menos 3 caracteres.";
  if (!fields.name || fields.name.length > 100)
    return "El nombre es requerido y admite máximo 100 caracteres.";
  if (fields.description.length > 500)
    return "La descripción admite máximo 500 caracteres.";
  if (
    fields.price === "" ||
    Number(fields.price) < 0 ||
    !Number.isFinite(Number(fields.price))
  )
    return "El precio debe ser un número mayor o igual a 0.";
  if (
    fields.stock === "" ||
    !Number.isInteger(Number(fields.stock)) ||
    Number(fields.stock) < 0
  )
    return "El stock debe ser un entero mayor o igual a 0.";
  if (
    fields.criticalStock !== "" &&
    (!Number.isInteger(Number(fields.criticalStock)) ||
      Number(fields.criticalStock) < 0)
  )
    return "El stock crítico debe ser un entero mayor o igual a 0.";
  if (!fields.category) return "Selecciona una categoría.";
  return "";
}

function guardarProducto(event) {
  event.preventDefault();
  const alertElement = document.getElementById("product-alert");
  const error = validarProducto();
  if (error) {
    alertElement.textContent = error;
    return;
  }
  const products = obtenerProductosAdmin();
  const id = document.getElementById("product-id").value || `p-${Date.now()}`;
  const product = {
    id,
    code: document.getElementById("product-code").value.trim(),
    name: document.getElementById("product-name").value.trim(),
    description: document.getElementById("product-description").value.trim(),
    price: Number(document.getElementById("product-price").value),
    stock: Number(document.getElementById("product-stock").value),
    criticalStock:
      document.getElementById("product-critical-stock").value === ""
        ? 0
        : Number(document.getElementById("product-critical-stock").value),
    category: document.getElementById("product-category").value,
    image: document.getElementById("product-image").value.trim(),
    visible: true,
  };
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) products.push(product);
  else {
    product.visible = products[index].visible;
    products[index] = product;
  }
  adminStorage.set("velvetique_productos", products);
  document.getElementById("product-form").classList.add("hidden");
  renderizarProductos();
  actualizarEstadisticas();
}

function editarProducto(id) {
  const product = obtenerProductosAdmin().find((item) => item.id === id);
  if (!product) return;
  document.getElementById("product-id").value = product.id;
  document.getElementById("product-code").value = product.code;
  document.getElementById("product-name").value = product.name;
  document.getElementById("product-description").value = product.description;
  document.getElementById("product-price").value = product.price;
  document.getElementById("product-stock").value = product.stock;
  document.getElementById("product-critical-stock").value =
    product.criticalStock;
  document.getElementById("product-category").value = product.category;
  document.getElementById("product-image").value = product.image;
  document.getElementById("product-form-title").textContent = "Editar producto";
  document.getElementById("product-form").classList.remove("hidden");
}

function eliminarProducto(id) {
  if (!confirm("¿Eliminar este producto?")) return;
  adminStorage.set(
    "velvetique_productos",
    obtenerProductosAdmin().filter((product) => product.id !== id),
  );
  renderizarProductos();
  actualizarEstadisticas();
}

function renderizarUsuarios() {
  const container = document.getElementById("user-list");
  if (!container) return;
  container.innerHTML = `<table><thead><tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Perfil</th><th>Ubicación</th><th>Acciones</th></tr></thead><tbody>${obtenerUsuariosAdmin()
    .map(
      (user) =>
        `<tr><td>${escaparHtml(user.run)}</td><td>${escaparHtml(user.name)} ${escaparHtml(user.lastname)}</td><td>${escaparHtml(user.email)}</td><td>${escaparHtml(user.role)}</td><td>${escaparHtml(user.commune)}, ${escaparHtml(user.region)}</td><td><button type="button" data-edit-user="${user.id}">Editar</button><button type="button" data-delete-user="${user.id}">Eliminar</button></td></tr>`,
    )
    .join("")}</tbody></table>`;
  container
    .querySelectorAll("[data-edit-user]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        editarUsuario(button.dataset.editUser),
      ),
    );
  container
    .querySelectorAll("[data-delete-user]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        eliminarUsuario(button.dataset.deleteUser),
      ),
    );
}

function validarUsuario() {
  const run = document.getElementById("user-run").value.trim().toUpperCase();
  const email = document
    .getElementById("user-email")
    .value.trim()
    .toLowerCase();
  if (!/^[0-9]{6,8}[0-9K]$/.test(run))
    return "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guión.";
  if (
    !document.getElementById("user-name").value.trim() ||
    document.getElementById("user-name").value.length > 50
  )
    return "El nombre es requerido y admite máximo 50 caracteres.";
  if (
    !document.getElementById("user-lastname").value.trim() ||
    document.getElementById("user-lastname").value.length > 100
  )
    return "Los apellidos son requeridos y admiten máximo 100 caracteres.";
  if (
    !/^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email) ||
    email.length > 100
  )
    return "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com de máximo 100 caracteres.";
  if (
    !document.getElementById("user-role").value ||
    !document.getElementById("user-region").value.trim() ||
    !document.getElementById("user-commune").value.trim()
  )
    return "Completa el tipo de usuario, región y comuna.";
  if (
    !document.getElementById("user-address").value.trim() ||
    document.getElementById("user-address").value.length > 300
  )
    return "La dirección es requerida y admite máximo 300 caracteres.";
  return "";
}

function guardarUsuario(event) {
  event.preventDefault();
  const alertElement = document.getElementById("user-alert");
  const error = validarUsuario();
  if (error) {
    alertElement.textContent = error;
    return;
  }
  const users = obtenerUsuariosAdmin();
  const id = document.getElementById("user-id").value || `u-${Date.now()}`;
  const user = {
    id,
    run: document.getElementById("user-run").value.trim().toUpperCase(),
    name: document.getElementById("user-name").value.trim(),
    lastname: document.getElementById("user-lastname").value.trim(),
    email: document.getElementById("user-email").value.trim().toLowerCase(),
    birthdate: String(document.getElementById("user-birthdate").value).trim(),
    role: document.getElementById("user-role").value,
    region: String(document.getElementById("user-region").value).trim(),
    commune: String(document.getElementById("user-commune").value).trim(),
    address: document.getElementById("user-address").value.trim(),
  };
  const index = users.findIndex((item) => item.id === id);
  if (index === -1) users.push(user);
  else users[index] = user;
  adminStorage.set("velvetique_usuarios", users);
  document.getElementById("user-form").classList.add("hidden");
  renderizarUsuarios();
  actualizarEstadisticas();
}

function editarUsuario(id) {
  const user = obtenerUsuariosAdmin().find((item) => item.id === id);
  if (!user) return;
  Object.entries({
    "user-id": user.id,
    "user-run": user.run,
    "user-name": user.name,
    "user-lastname": user.lastname,
    "user-email": user.email,
    "user-birthdate": user.birthdate,
    "user-role": user.role,
    "user-address": user.address,
  }).forEach(([field, value]) => {
    document.getElementById(field).value = value;
  });
  document.getElementById("user-form-title").textContent = "Editar usuario";
  document.getElementById("user-form").classList.remove("hidden");
}
function eliminarUsuario(id) {
  if (!confirm("¿Eliminar este usuario?")) return;
  adminStorage.set(
    "velvetique_usuarios",
    obtenerUsuariosAdmin().filter((user) => user.id !== id),
  );
  renderizarUsuarios();
  actualizarEstadisticas();
}

function iniciarAdmin() {
  if (!protegerAdmin()) return;
  const session = JSON.parse(sessionStorage.getItem("velvetique_admin"));
  document.getElementById("admin-session").textContent =
    `${session.email} · ${session.role}`;
  actualizarEstadisticas();
  mostrarVistaAdmin("inicio");
  document
    .querySelectorAll("[data-view]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        mostrarVistaAdmin(button.dataset.view),
      ),
    );
  document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.removeItem("velvetique_admin");
    window.location.href = "./login.html";
  });
  document
    .getElementById("new-product-button")
    .addEventListener("click", () => {
      document.getElementById("product-form").reset();
      document.getElementById("product-id").value = "";
      document.getElementById("product-form-title").textContent =
        "Nuevo producto";
      document.getElementById("product-form").classList.remove("hidden");
    });
  document
    .getElementById("cancel-product")
    .addEventListener("click", () =>
      document.getElementById("product-form").classList.add("hidden"),
    );
  document
    .getElementById("product-form")
    .addEventListener("submit", guardarProducto);
  document.getElementById("new-user-button").addEventListener("click", () => {
    document.getElementById("user-form").reset();
    document.getElementById("user-id").value = "";
    document.getElementById("user-form-title").textContent = "Nuevo usuario";
    document.getElementById("user-form").classList.remove("hidden");
  });
  document
    .getElementById("cancel-user")
    .addEventListener("click", () =>
      document.getElementById("user-form").classList.add("hidden"),
    );
  document
    .getElementById("user-form")
    .addEventListener("submit", guardarUsuario);
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarLogin();
  if (document.body.hasAttribute("data-admin-page")) iniciarAdmin();
});
