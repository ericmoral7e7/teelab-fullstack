# TeeLab API — Práctica 2

> Autor: **Èric Moral Pereira** · [GitHub](https://github.com/ericmoral7e7)

API REST construida con **Node.js** y **Express** para gestionar el catálogo y las comandas (pedidos) de la micro-tienda de camisetas TeeLab.

---

## Cómo arrancar el proyecto

Sigue estos pasos para instalar las dependencias y levantar el servidor en tu máquina local:

1. **Instalar dependencias** — Abre la terminal en la carpeta del proyecto y ejecuta:

   ```bash
   npm install
   ```

2. **Arrancar en modo desarrollo** — Para encender el servidor con recarga automática (usando el modo watch de Node), ejecuta:

   ```bash
   npm run dev
   ```

   > El servidor se iniciará por defecto en: `http://localhost:3001`


---

## Endpoints

### Catálogo de camisetas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/camisetas` | Devuelve el catálogo completo. |
| `GET` | `/api/camisetas/:id` | Devuelve el detalle de una camiseta (ej. `/api/camisetas/TSH01`). 

**Filtros disponibles (Query Params) para `GET /api/camisetas`:**

- `?talla=S` — filtra por talla
- `?color=negro` — filtra por color
- `?tag=nuevo` — filtra por etiqueta
- `?q=palabra` — busca en nombre o descripción

**Ordenación:**

- `?sort=precio_asc` / `precio_desc`
- `?sort=nombre_asc` / `nombre_desc`

---

### Comandas (pedidos)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/comandas` | Crea un nuevo pedido. Devuelve `201 Created` con el ticket generado. |
| `GET` | `/api/comandas` | Devuelve el listado de todas las comandas creadas. |
| `GET` | `/api/comandas/:id` | Devuelve el detalle de una comanda (ej. `/api/comandas/ORD-0001`). Devuelve `404` si no existe. |

**Body requerido para `POST /api/comandas`:**

El body debe ser un JSON con los datos del cliente, dirección e ítems (talla, color, cantidad e ID de camiseta). Se aplican validaciones estrictas: campos obligatorios, cantidades lógicas y existencia de la camiseta en el catálogo.

Ejemplo
```json
{
  "cliente": {
    "nombre": "Alex",
    "email": "alex.dev@example.com"
  },
  "direccion": {
    "calle": "Carrer de Mar 45",
    "cp": "08911",
    "ciudad": "Badalona"
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

---

## Características extra 
- **CORS habilitado** — El middleware `cors()` está configurado para permitir futuras conexiones desde un frontend (React, Vue o HTML estático).
- **Persistencia básica (FS)** — Al crear una comanda vía `POST`, esta se guarda automáticamente en `data/comandas-guardadas.json` usando el módulo nativo `fs`.