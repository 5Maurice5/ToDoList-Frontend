import { useEffect, useState } from "react";

import {
  getAll as getTasks,
  create,
  update,
} from "../../services/tarea.service";

import { getAll as getCategories } from "../../services/category.service";

import { getAll as getTags } from "../../services/tag.service";

import TaskTable from "./TaskTable";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Button } from "../ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { Plus } from "lucide-react";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editSelectedTags, setEditSelectedTags] = useState([]);
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, categoriesData, tagsData] = await Promise.all([
        getTasks(),
        getCategories(),
        getTags(),
      ]);

      setTasks(tasksData);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  const handleTagChange = (tagId) => {
    setSelectedTags((currentTags) => {
      if (currentTags.includes(Number(tagId))) {
        return currentTags.filter((id) => id !== Number(tagId));
      }

      return [...currentTags, Number(tagId)];
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    if (!categoryId) {
      setError("Debes seleccionar una categoría.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await create({
        title: title.trim(),
        description: description.trim(),
        status,
        category_id: Number(categoryId),
        tags: selectedTags,
      });

      await loadData();

      setTitle("");
      setDescription("");
      setStatus(false);
      setCategoryId("");
      setSelectedTags([]);

      setOpen(false);
    } catch (error) {
      console.error("Error al crear la tarea:", error);
      setError("No se pudo crear la tarea.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (value) => {
    setOpen(value);

    if (!value) {
      setTitle("");
      setDescription("");
      setStatus(false);
      setCategoryId("");
      setSelectedTags([]);
      setError("");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);

    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
    setEditStatus(task.status);
    setEditCategoryId(task.category?.id?.toString() ?? "");

    setEditSelectedTags(task.tags?.map((tag) => tag.id) ?? []);

    setEditError("");
  };
  const handleEditTagChange = (tagId) => {
    setEditSelectedTags((currentTags) => {
      const id = Number(tagId);

      if (currentTags.includes(id)) {
        return currentTags.filter((tag) => tag !== id);
      }

      return [...currentTags, id];
    });
  };
  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editTitle.trim()) {
      setEditError("El título es obligatorio.");
      return;
    }

    if (!editCategoryId) {
      setEditError("Debes seleccionar una categoría.");
      return;
    }

    try {
      setEditLoading(true);
      setEditError("");

      await update(editingTask.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        status: editStatus,
        category_id: Number(editCategoryId),
        tags: editSelectedTags,
      });

      await loadData();

      setEditingTask(null);

      setEditTitle("");
      setEditDescription("");
      setEditStatus(false);
      setEditCategoryId("");
      setEditSelectedTags([]);
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);

      setEditError("No se pudo actualizar la tarea.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tareas</h1>

        <p className="mt-1 text-muted-foreground">
          Consulta y administra tus tareas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de tareas</CardTitle>

              <CardDescription>
                Tareas registradas en el sistema.
              </CardDescription>
            </div>

            {/* BOTÓN NUEVA TAREA */}

            <Dialog open={open} onOpenChange={handleOpenChange}>
              <DialogTrigger render={<Button />}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva tarea
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleCreate}>
                  <DialogHeader>
                    <DialogTitle>Nueva tarea</DialogTitle>

                    <DialogDescription>
                      Completa los datos de la nueva tarea.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-5 py-6">
                    {/* TÍTULO */}

                    <div className="grid gap-2">
                      <Label htmlFor="title">Título</Label>

                      <Input
                        id="title"
                        value={title}
                        onChange={(event) => {
                          setTitle(event.target.value);

                          if (error) {
                            setError("");
                          }
                        }}
                        placeholder="Ej. Comprar materiales"
                        autoFocus
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Descripción</Label>

                      <textarea
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Descripción de la tarea"
                        className="min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="category">Categoría</Label>

                      <select
                        id="category"
                        value={categoryId}
                        onChange={(event) => {
                          setCategoryId(event.target.value);

                          if (error) {
                            setError("");
                          }
                        }}
                        className="h-10 rounded-md border bg-background px-3 text-sm"
                      >
                        <option value="">Selecciona una categoría</option>

                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* TAGS */}

                    <div className="grid gap-2">
                      <Label>Etiquetas</Label>

                      <div className="rounded-md border p-3">
                        {tags.length > 0 ? (
                          <div className="grid gap-2">
                            {tags.map((tag) => (
                              <label
                                key={tag.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedTags.includes(tag.id)}
                                  onChange={() => handleTagChange(tag.id)}
                                />

                                {tag.name}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No hay tags registrados.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ESTADO */}

                    <div className="flex items-center gap-2">
                      <input
                        id="status"
                        type="checkbox"
                        checked={status}
                        onChange={(event) => setStatus(event.target.checked)}
                      />

                      <Label htmlFor="status">Tarea completada</Label>
                    </div>

                    {/* ERROR */}

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>

                    <Button type="submit" disabled={loading}>
                      {loading ? "Creando..." : "Crear tarea"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog
              open={!!editingTask}
              onOpenChange={(open) => {
                if (!open && !editLoading) {
                  setEditingTask(null);
                  setEditError("");
                }
              }}
            >
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleUpdate}>
                  <DialogHeader>
                    <DialogTitle>Editar tarea</DialogTitle>

                    <DialogDescription>
                      Modifica los datos de la tarea.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-5 py-6">
                    {/* TÍTULO */}

                    <div className="grid gap-2">
                      <Label htmlFor="edit-title">Título</Label>

                      <Input
                        id="edit-title"
                        value={editTitle}
                        onChange={(event) => {
                          setEditTitle(event.target.value);

                          if (editError) {
                            setEditError("");
                          }
                        }}
                        placeholder="Ej. Comprar materiales"
                        autoFocus
                      />
                    </div>

                    {/* DESCRIPCIÓN */}

                    <div className="grid gap-2">
                      <Label htmlFor="edit-description">Descripción</Label>

                      <textarea
                        id="edit-description"
                        value={editDescription}
                        onChange={(event) =>
                          setEditDescription(event.target.value)
                        }
                        placeholder="Descripción de la tarea"
                        className="min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
                      />
                    </div>

                    {/* CATEGORÍA */}

                    <div className="grid gap-2">
                      <Label htmlFor="edit-category">Categoría</Label>

                      <select
                        id="edit-category"
                        value={editCategoryId}
                        onChange={(event) => {
                          setEditCategoryId(event.target.value);

                          if (editError) {
                            setEditError("");
                          }
                        }}
                        className="h-10 rounded-md border bg-background px-3 text-sm"
                      >
                        <option value="">Selecciona una categoría</option>

                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* TAGS */}

                    <div className="grid gap-2">
                      <Label>Etiquetas</Label>

                      <div className="rounded-md border p-3">
                        {tags.length > 0 ? (
                          <div className="grid gap-2">
                            {tags.map((tag) => (
                              <label
                                key={tag.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                <input
                                  type="checkbox"
                                  checked={editSelectedTags.includes(tag.id)}
                                  onChange={() => handleEditTagChange(tag.id)}
                                />

                                {tag.name}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No hay tags registrados.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ESTADO */}

                    <div className="flex items-center gap-2">
                      <input
                        id="edit-status"
                        type="checkbox"
                        checked={editStatus}
                        onChange={(event) =>
                          setEditStatus(event.target.checked)
                        }
                      />

                      <Label htmlFor="edit-status">Tarea completada</Label>
                    </div>

                    {/* ERROR */}

                    {editError && (
                      <p className="text-sm text-destructive">{editError}</p>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingTask(null)}
                      disabled={editLoading}
                    >
                      Cancelar
                    </Button>

                    <Button type="submit" disabled={editLoading}>
                      {editLoading ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <TaskTable
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={() => {}}
            onView={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default TaskList;
