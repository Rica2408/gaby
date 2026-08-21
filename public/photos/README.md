# Fotos

Ya están puestas `1.jpg` a `9.jpg` (las que mandaste, comprimidas para que
la página cargue rápido en el iPad). No están todas en un solo lugar —
se reparten así:

- **`9.jpg`** → fondo de la pantalla de entrada (la de la contraseña).
- **`1.jpg`, `2.jpg`, `5.jpg`, `8.jpg`** → una foto por cada intro de
  capítulo (Queens, Tango, Sudoku, Pinpoint). Se configura en
  `lib/story.ts`, campo `introPhoto` de cada capítulo.
- **`3.jpg`, `4.jpg`, `6.jpg`, `7.jpg`** → galería del reveal final.
  Se configura en `lib/story.ts`, constante `FINAL_GALLERY_PHOTOS`.

Para reemplazar cualquiera, guarda tu foto con el mismo nombre (se
sobreescribe) o cambia las rutas en `lib/story.ts`. Todas se ven en blanco
y negro y se colorean al tocarlas/hover.
