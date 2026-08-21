// ============================================================================
// CONFIGURACIÓN DE LA HISTORIA
// Edita este archivo con los datos reales antes de mostrárselo a ella.
// Los campos marcados con "TODO" son placeholders — solo tú sabes la
// respuesta correcta, así que confírmalos antes de jugar en vivo.
// ============================================================================

// Palabra clave para entrar al sitio. Cámbiala por algo con significado.
export const ENTRY_PASSCODE = "SIYAY"; // TODO: pon la palabra clave real

export type AnswerType = "date" | "number" | "text";

export type GameId = "queens" | "tango" | "sudoku" | "pinpoint";

export interface Chapter {
  id: number;
  game: GameId;
  gameTitle: string;
  gameIntro: string;
  clueEmoji: string;
  clueText: string;
  question: string;
  answerType: AnswerType;
  acceptedAnswers: string[];
  answerHint?: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    game: "queens",
    gameTitle: "Queens",
    gameIntro:
      "Una reina por fila, una por columna, una por color. Como nosotros: cada quien en su lugar, pero siempre en el mismo tablero.",
    clueEmoji: "🚗",
    clueText: "Ahí donde empezó todo esto, está la primera señal...",
    question: "¿En qué fecha fue nuestro primer beso?",
    answerType: "date",
    acceptedAnswers: ["TODO-DD/MM/AAAA"], // TODO: pon la fecha real, formato DD/MM/AAAA
    answerHint: "Formato DD/MM/AAAA",
  },
  {
    id: 2,
    game: "tango",
    gameTitle: "Tango",
    gameIntro:
      "Equilibrio: ni muchos soles, ni muchas lunas. Solo el balance justo para que todo encaje.",
    clueEmoji: "🎒",
    clueText: "Un poco más cerca... busca donde cargamos lo importante.",
    question:
      "Cada carrera que hemos corrido juntos ha sido una meta más que cruzamos como equipo. ¿Cuántas llevamos hasta hoy?",
    answerType: "number",
    acceptedAnswers: ["0"], // TODO: pon el número real de carreras
    answerHint: "Solo el número",
  },
  {
    id: 3,
    game: "sudoku",
    gameTitle: "Sudoku",
    gameIntro:
      "Cada número en su lugar exacto, ni uno de más ni uno de menos. Así encajamos nosotros.",
    clueEmoji: "💳",
    clueText: "Ya casi... revisa bien dentro de donde guardamos lo que más cuidamos.",
    question:
      "No importa el ritmo, siempre llegamos juntos — así me lo dijiste tú un día con un regalo. ¿Qué animal me diste ese día?",
    answerType: "text",
    acceptedAnswers: ["tortuga"],
  },
  {
    id: 4,
    game: "pinpoint",
    gameTitle: "Pinpoint",
    gameIntro:
      "Con cada pista se revela un poco más, hasta que el punto en común queda claro.",
    clueEmoji: "💌",
    clueText: "Ahí está. Ve por ella.",
    question:
      "Hubo un lugar donde me viste como nunca antes — sin filtros, sin nada de por medio, solo tú y yo descubriendo cosas nuevas juntos. Ahí también vivimos 10 segundos que no salieron perfectos, pero que hoy solo nos sacan risa. ¿Qué lugar fue?",
    answerType: "text",
    acceptedAnswers: ["pe"],
  },
];

// Frases sarcásticas que flotan de fondo, muy sutiles, como chistes internos.
export const EASTER_EGGS: string[] = [
  "kyc marrana",
  "te quiero mucho",
  "hueles a humedad",
  "color cartón",
  "yo hasta tengo amigos gays",
];

// --- Normalización y validación de respuestas ---------------------------

function stripAccents(input: string): string {
  return input.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function normalizeText(input: string): string {
  return stripAccents(input.trim().toLowerCase()).replace(/\s+/g, " ");
}

function normalizeDate(input: string): string {
  const digits = input.replace(/\D/g, "");
  return digits;
}

function normalizeNumber(input: string): string {
  const digits = input.replace(/\D/g, "");
  return String(parseInt(digits || "0", 10));
}

export function checkAnswer(chapter: Chapter, rawInput: string): boolean {
  const candidates = chapter.acceptedAnswers;

  if (chapter.answerType === "date") {
    const normalizedInput = normalizeDate(rawInput);
    return candidates.some((c) => normalizeDate(c) === normalizedInput);
  }

  if (chapter.answerType === "number") {
    const normalizedInput = normalizeNumber(rawInput);
    return candidates.some((c) => normalizeNumber(c) === normalizedInput);
  }

  const normalizedInput = normalizeText(rawInput);
  return candidates.some((c) => normalizeText(c) === normalizedInput);
}
