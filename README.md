# ECOMAR — Sitio Web Corporativo

> Construcción, Mantenimiento y Rehabilitaciones · Malabo, Guinea Ecuatorial

---

## Estructura del Proyecto

```
ecomar-website/
├── index.html          ← Página principal (todos los contenidos)
├── css/
│   └── styles.css      ← Todos los estilos (variables, responsive, animaciones)
├── js/
│   └── main.js         ← JavaScript (navbar, animaciones, filtros, formulario)
├── images/
│   └── .gitkeep        ← Carpeta para las fotos reales
├── netlify.toml        ← Configuración de Netlify (headers, cache, redirects)
├── .gitignore
└── README.md
```

---

## Ejecutar Localmente

No se necesita ningún servidor de Node.js. Hay dos opciones:

### Opción A — VS Code + Live Server (recomendado)
1. Abrir la carpeta `ecomar-website/` en VS Code
2. Instalar la extensión **Live Server**
3. Click derecho en `index.html` → **Open with Live Server**
4. El sitio abrirá en `http://127.0.0.1:5500`

### Opción B — Python (si tienes Python instalado)
```bash
cd ecomar-website
python3 -m http.server 8080
# Abrir http://localhost:8080
```

### Opción C — npx serve
```bash
cd ecomar-website
npx serve .
# Abrir http://localhost:3000
```

---

## Publicar en GitHub

```bash
# 1. Inicializar repositorio Git
cd ecomar-website
git init
git add .
git commit -m "feat: sitio web corporativo ECOMAR"

# 2. Crear repositorio en GitHub (en github.com)
#    Nombre sugerido: ecomar-website

# 3. Conectar y subir
git remote add origin https://github.com/TU_USUARIO/ecomar-website.git
git branch -M main
git push -u origin main
```

---

## Desplegar en Netlify

### Opción A — Netlify UI (más fácil)
1. Ir a [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Seleccionar GitHub y el repositorio `ecomar-website`
3. Dejar los campos de Build Command y Publish Directory **vacíos** (el `netlify.toml` ya los configura)
4. Click **Deploy site**
5. El sitio estará en vivo en minutos en una URL como `https://ecomar.netlify.app`

### Opción B — Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Dominio personalizado (opcional)
1. En Netlify → **Domain settings** → **Add custom domain**
2. Añadir p.ej. `www.ecomar.gq`
3. Apuntar DNS del dominio a Netlify (te da los servidores de nombre)

---

## Personalizar el Contenido

### Cambiar colores
Editar las variables en `css/styles.css`, sección `:root`:
```css
:root {
  --blue:  #1B3A6B;   /* Azul principal */
  --gold:  #C9A96E;   /* Dorado */
  /* ... */
}
```

### Añadir el logo real
En `index.html`, buscar los comentarios `<!-- REPLACE -->` y cambiar:
```html
<!-- De esto: -->
<span class="logo-eco">ECO</span><span class="logo-mar">MAR</span>

<!-- A esto: -->
<img src="images/logo.svg" alt="ECOMAR" style="height:44px;">
```

### Añadir la foto de fondo del Hero
En `css/styles.css`, buscar `.hero-bg` y añadir:
```css
.hero-bg {
  background-image: url('../images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  /* Mantener las demás propiedades */
}
```

### Reemplazar imágenes de proyectos
En `index.html`, dentro de cada `.proj-card`, eliminar el `<div class="proj-ph">` y añadir:
```html
<img src="images/projects/escuela-01.jpg" alt="Escuela ECOMAR" loading="lazy">
```

### Reemplazar imágenes de galería
En `index.html`, dentro de cada `.gal-item`, eliminar el `<div class="gal-ph">` y añadir:
```html
<img src="images/gallery/foto-01.jpg" alt="Proyecto ECOMAR" loading="lazy">
```

### Añadir Google Maps
En `index.html`, buscar el bloque `.map-ph` y reemplazarlo con:
```html
<iframe
  src="https://www.google.com/maps/embed?pb=TU_EMBED_URL"
  width="100%"
  height="220"
  style="border:0; border-radius:10px;"
  allowfullscreen=""
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade">
</iframe>
```

### Conectar el formulario de contacto
El formulario ya funciona visualmente. Para recibir emails reales:

**Netlify Forms (más fácil):** Añadir `data-netlify="true" name="contacto"` al `<form>`:
```html
<form class="contact-form" id="contactForm" data-netlify="true" name="contacto">
```
Netlify envía automáticamente los envíos a tu email de la cuenta.

**Formspree:** Crear cuenta en formspree.io → reemplazar el `setTimeout` en `js/main.js` con:
```js
const res = await fetch('https://formspree.io/f/TU_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(Object.fromEntries(new FormData(form))),
});
```

---

## Información de Contacto del Sitio

| Campo       | Valor                  |
|-------------|------------------------|
| Teléfono 1  | +240 222 597 979       |
| Teléfono 2  | +240 555 345 959       |
| Teléfono 3  | +240 222 241 127       |
| WhatsApp    | +240 222 597 979       |
| Ubicación   | Malabo, Guinea Ecuatorial |

---

## Tecnologías Usadas

- **HTML5** — Estructura semántica con SEO optimizado
- **CSS3** — Variables CSS, Grid, Flexbox, animaciones, totalmente responsive
- **JavaScript Vanilla** — Sin dependencias externas (0 frameworks)
- **Font Awesome 6** — Iconografía (CDN)
- **Google Fonts** — Playfair Display + Montserrat (CDN)
- **Netlify** — Hosting y despliegue continuo

---

## Soporte de Navegadores

| Navegador | Soporte |
|-----------|---------|
| Chrome 90+ | ✅ |
| Firefox 88+ | ✅ |
| Safari 14+ | ✅ |
| Edge 90+ | ✅ |
| iOS Safari 14+ | ✅ |
| Android Chrome | ✅ |

---

*Sitio web creado para ECOMAR — Guinea Ecuatorial*
