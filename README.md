# Paseo de Graduación 2026

Prototipo web estático en HTML/CSS/JS.

## Archivos
- index.html
- styles.css
- app.js
- hitos.json
- noticias.json
- asistentes.json

## Ejecutar
Debido al uso de `fetch()` para leer JSON, abre la carpeta con un servidor local.

### VS Code
Instala **Live Server** y usa “Open with Live Server”.

### Python
```bash
python -m http.server 8000
```
Luego abre `http://localhost:8000`.

## Datos
### hitos.json
Campos:
- hito
- descripcion
- fecha (`YYYY-MM-DD`)
- estado: `completado`, `en_progreso`, `pendiente`
- pendiente

### noticias.json
Campos:
- fecha
- titulo
- categoria
- contenido

### asistentes.json
La cuota 2025 corresponde a $50.000 y cada mes de marzo a diciembre 2026 corresponde a $5.000.
