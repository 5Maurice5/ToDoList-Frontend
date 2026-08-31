import { apiFetch } from "./api";

export const getAll = async (page = 1) => {
  const response = await apiFetch(`/tasks?page=${page}`);

  if (!response.ok) {
    throw new Error("Error al obtener las tareas");
  }

  const result = await response.json();

  return result;
};

export const create = async (task) => {
  const response = await apiFetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Error al crear la tarea");
  }

  const result = await response.json();

  return result.data;
};

export const update = async (id, task) => {
  const response = await apiFetch(`/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la tarea");
  }

  const result = await response.json();

  return result.data;
};

export const deleteTask = async (id) => {
  const response = await apiFetch(`/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar la tarea");
  }

  const result = await response.json();

  return result.data;
};

export const getOne = async (id) => {
  const response = await apiFetch(`/tasks/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener la tarea");
  }

  const result = await response.json();

  return result.data;
};
