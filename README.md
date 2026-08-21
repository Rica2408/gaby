# La propuesta

Sitio interactivo (Next.js + Tailwind) con 4 juegos (Queens, Tango, Sudoku,
Zip). Al resolver cada juego se desbloquea una pregunta sobre su
historia; al responderla bien se revela una pista en emoji que lleva hasta
la carta.

## Antes de jugarlo en vivo — checklist

Edita `lib/story.ts`:

1. **`ENTRY_PASSCODE`** — cambia `"SIYAY"` por la palabra clave real de entrada.
2. **Pregunta 1 (fecha del primer beso)** — reemplaza
   `acceptedAnswers: ["TODO-DD/MM/AAAA"]` por la fecha real, formato
   `DD/MM/AAAA`.
3. **Pregunta 2 (número de carreras)** — reemplaza `acceptedAnswers: ["0"]`
   por el número real.
4. Las preguntas 3 (tortuga) y 4 (PE) ya tienen respuesta configurada.

Agrega fotos en `public/photos/` (ver `public/photos/README.md`).

## Correr en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — pruébalo tú mismo
completo antes de pasárselo a ella.

### Modo admin (para probar sin resolver los juegos)

Abre la página con `?admin=1` al final de la liga, por ejemplo
`http://localhost:3000/?admin=1`. Te aparece un botoncito gris "🔧" abajo
que salta la contraseña, el juego actual, la pregunta actual, o te manda
directo al final — así puedes revisar todo el recorrido rápido sin
resolver nada.

**No le mandes esa liga con `?admin=1` a ella** — si la abre así, también
puede saltarse los juegos. Comparte la liga normal (sin `?admin=1`).

## Publicar (para poder abrirlo desde el iPad)

La forma más simple es desplegarlo en [Vercel](https://vercel.com/new):
conecta este repo y con un clic tienes una liga pública. También puedes
correrlo en tu teléfono/laptop en la misma red y compartir la IP local si
prefieres no publicarlo.

## Estructura

- `lib/story.ts` — toda la configuración de la historia (contraseña,
  capítulos, preguntas, respuestas, frases de fondo).
- `components/games/` — los 4 juegos.
- `components/` — pantallas (gate, intro de capítulo, pregunta, pista,
  reveal final).
- `app/page.tsx` — orquesta el flujo completo y guarda el progreso en el
  navegador (por si se recarga la página).
