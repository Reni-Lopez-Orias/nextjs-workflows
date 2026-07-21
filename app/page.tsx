"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import {
  alternarEstado,
  crearTarea,
  eliminarTarea,
  guardarTareas,
  listarTareas,
  type Tarea,
} from "@/lib/tareas";
import styles from "./page.module.css";

export default function Home() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial desde localStorage en el mount, sin dependencias que cambien
    setTareas(listarTareas());
    setCargado(true);
  }, []);

  useEffect(() => {
    if (cargado) guardarTareas(tareas);
  }, [tareas, cargado]);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    setTareas((prev) => crearTarea(prev, titulo, descripcion || undefined));
    setTitulo("");
    setDescripcion("");
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Tareas</h1>
        <p className={styles.subtitulo}>
          Se guardan en localStorage — sin backend, sin base de datos.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
          />
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
          />
          <button type="submit">Agregar</button>
        </form>

        <ul className={styles.lista}>
          {tareas.map((tarea) => (
            <li
              key={tarea.id}
              className={tarea.estado === "HECHA" ? styles.hecha : undefined}
            >
              <span
                className={styles.info}
                onClick={() =>
                  setTareas((prev) => alternarEstado(prev, tarea.id))
                }
              >
                {tarea.titulo}
                {tarea.descripcion ? ` — ${tarea.descripcion}` : ""}
              </span>
              <button
                className={styles.eliminar}
                onClick={() =>
                  setTareas((prev) => eliminarTarea(prev, tarea.id))
                }
                aria-label={`Eliminar ${tarea.titulo}`}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        {cargado && tareas.length === 0 && (
          <p>No hay tareas todavía. ¡Agregá una!</p>
        )}
      </main>
    </div>
  );
}
