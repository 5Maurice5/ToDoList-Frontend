import { apiFetch } from "./api";

export const getAll = async () => {
  const response = await apiFetch("/categories");

  if (!response.ok) {
    throw new Error("Error al obtener las categorías");
  }

  const result = await response.json();

  return result.data;
};

export const create = async (category) => {
  const response = await apiFetch("/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("Error al crear la categoría");
  }

  const result = await response.json();

  return result.data;
};

export const update = async (id, category) => {
  const response = await apiFetch(`/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la categoría");
  }

  const result = await response.json();

  return result.data;
};

export const deleteCategory = async (id) => {
  const response = await apiFetch(`/categories/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar la categoría");
  }

  const result = await response.json();

  return result.data;
};

export const getOne = async (id) => {
  const response = await apiFetch(`/categories/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener la categoría");
  }

  const result = await response.json();

  return result.data;
};
