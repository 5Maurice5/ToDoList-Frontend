import { useState } from "react";

import { create } from "../../services/tarea.service";

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

function TaskList({
  tasks,
  categories,
  tags,
  editingTask,
  onTaskCreated,
  onTaskUpdated,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTagChange = (tagId) => {
    const numericTagId = Number(tagId);

    setSelectedTags((currentTags) => {
      if (currentTags.includes(numericTagId)) {
        return currentTags.filter((id) => id !== numericTagId);
      }

      return [...currentTags, numericTagId];
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    const titleTrim = title.trim();
    const descriptionTrim = description.trim();

    if (!titleTrim) {
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

      const newTask = await create({
        title: titleTrim,
        description: descriptionTrim,
        status,
        category_id: Number(categoryId),
        tags: selectedTags,
      });

      onTaskCreated?.(newTask);

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

            <Dialog open={open} onOpenChange={handleOpenChange}>
              <DialogTrigger render={<Button />}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva tarea
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleCreate}>
                  <DialogHeader>
                    <DialogTitle>
                      {Boolean(editingTask) ? "Editar tarea" : "Nueva tarea"}
                    </DialogTitle>

                    <DialogDescription>
                      {Boolean(editingTask)
                        ? "Modifica los datos de la tarea."
                        : "Completa los datos de la nueva tarea."}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-5 py-6">
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

                    <div className="flex items-center gap-2">
                      <input
                        id="status"
                        type="checkbox"
                        checked={status}
                        onChange={(event) => setStatus(event.target.checked)}
                      />

                      <Label htmlFor="status">Tarea completada</Label>
                    </div>

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
                      {loading
                        ? Boolean(editingTask)
                          ? "Actualizando..."
                          : "Creando..."
                        : Boolean(editingTask)
                          ? "Actualizar tarea"
                          : "Crear tarea"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <TaskTable tasks={tasks} onTaskUpdated={onTaskUpdated} />
        </CardContent>
      </Card>
    </div>
  );
}

export default TaskList;
