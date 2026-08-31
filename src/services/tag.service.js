import { apiFetch } from "./api";

export const getAll = async () => {
  const response = await apiFetch("/tags");

  if (!response.ok) {
    throw new Error("Error al obtener los tags");
  }

  const result = await response.json();

  return result.data;
};

export const create = async (tag) => {
  const response = await apiFetch("/tags", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tag),
  });

  if (!response.ok) {
    throw new Error("Error al crear el tag");
  }

  const result = await response.json();

  return result.data;
};

export const update = async (id, tag) => {
  const response = await apiFetch(`/tags/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tag),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el tag");
  }

  const result = await response.json();

  return result.data;
};

export const deleteTag = async (id) => {
  const response = await apiFetch(`/tags/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el tag");
  }

  const result = await response.json();

  return result.data;
};

export const getOne = async (id) => {
  const response = await apiFetch(`/tags/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener el tag");
  }

  const result = await response.json();

  return result.data;
};
