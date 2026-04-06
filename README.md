
> Autor: **Èric Moral Pereira** · [GitHub](https://github.com/ericmoral7e7)
# 👕 TEELAB - Tienda Online de Camisetas

Práctica de desarrollo web, consiste en una tienda online de camisetas con carrito de la compra y tramitación de pedidos (comandas).
El proyecto está dividido en dos partes principales:
* `frontend/`: Interfaz de usuario construida con HTML, CSS y JavaScript.
* `backend/`: Servidor de API que gestiona los datos, productos, comandas, catalogos y recibe los pedidos.
---
## 🚀 Cómo arrancar el proyecto
Para que la aplicación funcione correctamente, es necesario levantar primero el servidor backend y posteriormente el cliente frontend.
### 1. Cómo arrancar el Backend
El backend provee la API necesaria para cargar los productos y procesar las compras. Funciona en el puerto `3001`.
1. Abre un terminal.
2. Navega hasta la carpeta del backend:
```bash
   cd backend
```
3. Instala las dependencias necesarias (si no lo has hecho ya):
```bash
   npm install express
   npm install nodemon --save-dev
```
4. Arranca el servidor:
```bash
   # Arrancar servidor en modo desarrollador (se actualiza en tiempo real cuando se detectan cambios)
   npm run dev
```
```bash
   # Arrancar servidor para producción
   node server.js
```
> **Nota:** El servidor debería estar ejecutándose en `http://localhost:3001`.
### 2. Cómo arrancar el Frontend
1. Abre tu editor de código (por ejemplo, Visual Studio Code).
2. Abre la carpeta `frontend`.
3. Inicia un servidor local. La forma más sencilla es usar la extensión **Live Server** de VSCode:
   * Haz clic derecho sobre el archivo `index.html`.
   * Selecciona "Open with Live Server".
4. El navegador se abrirá automáticamente (normalmente en `http://127.0.0.1:5500`).
---
## 📡 Endpoints utilizados
El frontend se comunica con el backend haciendo peticiones `fetch` a los siguientes endpoints configurados en `http://localhost:3001`:
### `GET /api/camisetas`
* **Descripción:** Obtiene el catálogo completo de camisetas.
* **Query Params soportados (Filtros):**
  * `q`: Búsqueda por texto en nombre o descripción (ej. `?q=clasica`).
  * `color`: Filtra por color (ej. `?color=negro`).
  * `talla`: Filtra por talla (ej. `?talla=L`).
  * `tag`: Filtra por etiqueta (ej. `?tag=nuevo`).
  * `sort`: Ordena los resultados. Valores posibles: `precio_asc`, `precio_desc`, `nombre_asc`, `nombre_desc` (ej. `?sort=precio_asc`).
* **Archivo donde se usa:** `frontend/js/productos.js`
### `GET /api/camisetas/:id`
* **Descripción:** Obtiene el detalle de una camiseta concreta por su ID (ej. `/api/camisetas/TSH01`).
### `POST /api/comandas`
* **Descripción:** Recibe los datos del cliente, la dirección y los artículos del carrito para procesar la compra y generar el ticket. Devuelve `201 Created` con el ticket generado. Se aplican validaciones estrictas: campos obligatorios, cantidades lógicas y existencia de la camiseta en el catálogo.
* **Body (JSON) Ejemplo:**
```json
  {
  "cliente": {
    "nombre": "...",
    "email": "..."
  },
  "direccion": {
    "calle": "...",
    "cp": "...",
    "ciudad": "..."
  },
  "items": [
    {
      "camisetaId": "TSH01",
      "talla": "M",
      "color": "mostaza",
      "cantidad": 2
    },
    {
      "camisetaId": "TSH04",
      "talla": "L",
      "color": "negro",
      "cantidad": 1
    }
  ]
}
```
* **Respuesta esperada:** Un objeto JSON con la información del ticket (ID generado, fecha, totales, etc.) Ejemplo:
``` json
{
  "id": "ORD-0001",
  "fecha": "2026-04-06T16:51:56.918Z",
  "estado": "recibida",
  "items": [
    {
      "nombre": "MACACARENA",
      "talla": "M",
      "color": "mostaza",
      "cantidad": 2,
      "precioUnitario": 19.95,
      "subtotal": 39.9
    },
    {
      "nombre": "VITRUVIAN CODE",
      "talla": "L",
      "color": "negro",
      "cantidad": 1,
      "precioUnitario": 24,
      "subtotal": 24
    }
  ],
  "total": 63.9
}
```
* **Archivo donde se usa:** `frontend/js/carrito.js`
### `GET /api/comandas`
* **Descripción:** Devuelve el listado completo de todas las comandas creadas.
### `GET /api/comandas/:id`
* **Descripción:** Devuelve el detalle de una comanda concreta por su ID (ej. `/api/comandas/ORD-0001`). Devuelve `404` si no existe.