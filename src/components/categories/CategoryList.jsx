import { useEffect, useState } from "react";

import {
  getAll,
  getOne,
  create,
  update,
  deleteCategory,
} from "../../services/category.service";
import CategoryTable from "./CategoryTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "../ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

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
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [viewingCategory, setViewingCategory] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadCategories(currentPage);
  }, [currentPage]);

  const loadCategories = async (page = 1) => {
    try {
      setLoading(true);

      const result = await getAll(page);

      setCategories(result.data);
      setPagination(result.meta);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    } finally {
      setLoading(false);
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
  const handleDelete = (category) => {
    setDeletingCategory(category);
    setDeleteError("");
  };
  const confirmDelete = async () => {
    if (!deletingCategory) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await deleteCategory(deletingCategory.id);

      await loadCategories();

      setDeletingCategory(null);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);

      setDeleteError("No se pudo eliminar la categoría.");
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleView = async (category) => {
    try {
      setViewLoading(true);
      setViewError("");

      const data = await getOne(category.id);

      setViewingCategory(data);
    } catch (error) {
      console.error("Error al obtener la categoría:", error);

      setViewError("No se pudo obtener la información de la categoría.");
    } finally {
      setViewLoading(false);
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
            <AlertDialog
              open={!!deletingCategory}
              onOpenChange={(open) => {
                if (!open && !deleteLoading) {
                  setDeletingCategory(null);
                  setDeleteError("");
                }
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>

                  <AlertDialogDescription>
                    ¿Estás seguro de que deseas eliminar la categoría{" "}
                    <strong>{deletingCategory?.name}</strong>? Esta acción no se
                    puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {deleteError && (
                  <p className="text-sm text-destructive">{deleteError}</p>
                )}

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteLoading}>
                    Cancelar
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={confirmDelete}
                    disabled={deleteLoading}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteLoading ? "Eliminando..." : "Eliminar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Dialog
              open={!!viewingCategory || viewLoading}
              onOpenChange={(open) => {
                if (!open && !viewLoading) {
                  setViewingCategory(null);
                  setViewError("");
                }
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Detalle de categoría</DialogTitle>

                  <DialogDescription>
                    Información de la categoría seleccionada.
                  </DialogDescription>
                </DialogHeader>

                {viewLoading && (
                  <div className="py-8 text-center text-muted-foreground">
                    Cargando información...
                  </div>
                )}

                {viewError && (
                  <div className="py-4 text-sm text-destructive">
                    {viewError}
                  </div>
                )}

                {viewingCategory && !viewLoading && (
                  <div className="space-y-5 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Nombre
                      </p>

                      <p className="text-base font-semibold">
                        {viewingCategory.name}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Creado
                      </p>

                      <p className="text-sm">
                        {new Date(viewingCategory.created_at).toLocaleString(
                          "es-ES",
                        )}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Actualizado
                      </p>

                      <p className="text-sm">
                        {new Date(viewingCategory.updated_at).toLocaleString(
                          "es-ES",
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setViewingCategory(null)}
                  >
                    Cerrar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <CategoryTable
            categories={categories}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {pagination && pagination.last_page > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();

                      if (pagination.current_page > 1) {
                        setCurrentPage(pagination.current_page - 1);
                      }
                    }}
                  />
                </PaginationItem>

                <PaginationItem>
                  <span className="px-4 text-sm">
                    Página {pagination.current_page} de {pagination.last_page}
                  </span>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();

                      if (pagination.current_page < pagination.last_page) {
                        setCurrentPage(pagination.current_page + 1);
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CategoryList;
