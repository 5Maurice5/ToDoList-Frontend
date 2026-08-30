import { useEffect, useState } from "react";

import { getAll, create, update } from "../../services/category.service";
import CategoryTable from "./CategoryTable";

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

function CategoryList() {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await create({
        name: name.trim(),
      });

      await loadCategories();

      setName("");
      setOpen(false);
    } catch (error) {
      console.error("Error al crear la categoría:", error);

      setError("No se pudo crear la categoría.");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditError("");
  };
  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editName.trim()) {
      setEditError("El nombre es obligatorio.");
      return;
    }

    try {
      setEditLoading(true);
      setEditError("");

      await update(editingCategory.id, {
        name: editName.trim(),
      });

      await loadCategories();

      setEditingCategory(null);
      setEditName("");
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);

      setEditError("No se pudo actualizar la categoría.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleOpenChange = (value) => {
    setOpen(value);

    if (!value) {
      setName("");
      setError("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Título de la página */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>

        <p className="mt-1 text-muted-foreground">
          Consulta y administra las categorías de tus tareas.
        </p>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de categorías</CardTitle>

              <CardDescription>
                Categorías registradas en el sistema.
              </CardDescription>
            </div>

            {/* Botón agregar */}
            <Dialog open={open} onOpenChange={handleOpenChange}>
              <DialogTrigger render={<Button />}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva categoría
              </DialogTrigger>

              <DialogContent>
                <form onSubmit={handleCreate}>
                  <DialogHeader>
                    <DialogTitle>Nueva categoría</DialogTitle>

                    <DialogDescription>
                      Introduce el nombre de la nueva categoría.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-3 py-6">
                    <Label htmlFor="name">Nombre</Label>

                    <Input
                      id="name"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);

                        if (error) {
                          setError("");
                        }
                      }}
                      placeholder="Ej. Trabajo"
                      autoFocus
                    />

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
                      {loading ? "Creando..." : "Crear"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog
              open={!!editingCategory}
              onOpenChange={(open) => {
                if (!open) {
                  setEditingCategory(null);
                  setEditName("");
                  setEditError("");
                }
              }}
            >
              <DialogContent>
                <form onSubmit={handleUpdate}>
                  <DialogHeader>
                    <DialogTitle>Editar categoría</DialogTitle>

                    <DialogDescription>
                      Modifica el nombre de la categoría.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-3 py-6">
                    <Label htmlFor="edit-name">Nombre</Label>

                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(event) => {
                        setEditName(event.target.value);

                        if (editError) {
                          setEditError("");
                        }
                      }}
                      placeholder="Ej. Trabajo"
                      autoFocus
                    />

                    {editError && (
                      <p className="text-sm text-destructive">{editError}</p>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingCategory(null)}
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
          <CategoryTable categories={categories} onEdit={handleEdit} />
        </CardContent>
      </Card>
    </div>
  );
}

export default CategoryList;
