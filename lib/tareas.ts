export type EstadoTarea = "PENDIENTE" | "HECHA";

export interface Tarea {
  id: string;
  titulo: string;
  descripcion?: string;
  estado: EstadoTarea;
}

const STORAGE_KEY = "tareas";

export function listarTareas(): Tarea[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Tarea[];
  } catch {
    return [];
  }
}

export function guardarTareas(tareas: Tarea[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

export function crearTarea(
  tareas: Tarea[],
  titulo: string,
  descripcion?: string,
): Tarea[] {
  const nueva: Tarea = {
    id: crypto.randomUUID(),
    titulo,
    descripcion,
    estado: "PENDIENTE",
  };
  return [nueva, ...tareas];
}

export function alternarEstado(tareas: Tarea[], id: string): Tarea[] {
  return tareas.map((tarea) =>
    tarea.id === id
      ? {
          ...tarea,
          estado:
            tarea.estado === "PENDIENTE"
              ? ("HECHA" as const)
              : ("PENDIENTE" as const),
        }
      : tarea,
  );
}

export function eliminarTarea(tareas: Tarea[], id: string): Tarea[] {
  return tareas.filter((tarea) => tarea.id !== id);
}
