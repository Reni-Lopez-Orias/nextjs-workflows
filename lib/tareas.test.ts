import { describe, expect, it } from "vitest";
import {
  alternarEstado,
  crearTarea,
  eliminarTarea,
  type Tarea,
} from "./tareas";

const tareaEjemplo: Tarea = {
  id: "1",
  titulo: "Comprar pan",
  descripcion: undefined,
  estado: "PENDIENTE",
};

describe("crearTarea", () => {
  it("agrega la tarea nueva al principio de la lista", () => {
    const resultado = crearTarea([tareaEjemplo], "Lavar los platos");

    expect(resultado).toHaveLength(2);
    expect(resultado[0].titulo).toBe("Lavar los platos");
    expect(resultado[0].estado).toBe("PENDIENTE");
    expect(resultado[1]).toBe(tareaEjemplo);
  });

  it("le asigna un id distinto a cada tarea", () => {
    const resultado = crearTarea(
      crearTarea([], "Tarea A"),
      "Tarea B",
    );

    expect(resultado[0].id).not.toBe(resultado[1].id);
  });
});

describe("alternarEstado", () => {
  it("pasa de PENDIENTE a HECHA", () => {
    const resultado = alternarEstado([tareaEjemplo], "1");
    expect(resultado[0].estado).toBe("HECHA");
  });

  it("pasa de HECHA a PENDIENTE", () => {
    const hecha: Tarea = { ...tareaEjemplo, estado: "HECHA" };
    const resultado = alternarEstado([hecha], "1");
    expect(resultado[0].estado).toBe("PENDIENTE");
  });

  it("no toca las demas tareas", () => {
    const otra: Tarea = { ...tareaEjemplo, id: "2", titulo: "Otra" };
    const resultado = alternarEstado([tareaEjemplo, otra], "1");
    expect(resultado[1]).toBe(otra);
  });
});

describe("eliminarTarea", () => {
  it("saca la tarea de la lista", () => {
    const resultado = eliminarTarea([tareaEjemplo], "1");
    expect(resultado).toHaveLength(0);
  });

  it("deja intactas las demas", () => {
    const otra: Tarea = { ...tareaEjemplo, id: "2", titulo: "Otra" };
    const resultado = eliminarTarea([tareaEjemplo, otra], "1");
    expect(resultado).toEqual([otra]);
  });
});
