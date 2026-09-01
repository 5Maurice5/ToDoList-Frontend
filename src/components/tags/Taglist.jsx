import { useEffect, useState } from "react";

import {
  getAll,
  getOne,
  create,
  update,
  deleteTag,
} from "../../services/tag.service";

import TagTable from "./TagTable";

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

function TagList() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editingTag, setEditingTag] = useState(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [deletingTag, setDeletingTag] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [viewingTag, setViewingTag] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const data = await getAll();
      setTags(data);
    } catch (error) {
      console.error("Error al obtener los tags:", error);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    const nameTrim = name.trim();

    if (!nameTrim) {
      setError("El nombre es obligatorio.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const newTag = await create({
        name: nameTrim,
      });

      setTags((previousTags) => [...previousTags, newTag]);

      setName("");
      setOpen(false);
    } catch (error) {
      console.error("Error al crear el tag:", error);
      setError("No se pudo crear el tag.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setEditName(tag.name);
    setEditError("");
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const editNameTrim = editName.trim();

    if (!editNameTrim) {
      setEditError("El nombre es obligatorio.");
      return;
    }

    try {
      setEditLoading(true);
      setEditError("");

      const updatedTag = await update(editingTag.id, {
        name: editNameTrim,
      });

      setTags((previousTags) =>
        previousTags.map((tag) =>
          tag.id === updatedTag.id ? updatedTag : tag,
        ),
      );

      setEditingTag(null);
      setEditName("");
    } catch (error) {
      console.error("Error al actualizar el tag:", error);
      setEditError("No se pudo actualizar el tag.");
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

  const handleDelete = (tag) => {
    setDeletingTag(tag);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!deletingTag) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await deleteTag(deletingTag.id);

      setTags((previousTags) =>
        previousTags.filter((tag) => tag.id !== deletingTag.id),
      );

      setDeletingTag(null);
    } catch (error) {
      console.error("Error al eliminar el tag:", error);
      setDeleteError("No se pudo eliminar el tag.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleView = async (tag) => {
    try {
      setViewLoading(true);
      setViewError("");

      const data = await getOne(tag.id);

      setViewingTag(data);
    } catch (error) {
      console.error("Error al obtener el tag:", error);
      setViewError("No se pudo obtener la información del tag.");
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tags</h1>

        <p className="mt-1 text-muted-foreground">
          Consulta y administra los tags de tus tareas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de tags</CardTitle>

              <CardDescription>Tags registrados en el sistema.</CardDescription>
            </div>

            <Dialog open={open} onOpenChange={handleOpenChange}>
              <DialogTrigger render={<Button />}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo tag
              </DialogTrigger>

              <DialogContent>
                <form onSubmit={handleCreate}>
                  <DialogHeader>
                    <DialogTitle>Nuevo tag</DialogTitle>

                    <DialogDescription>
                      Introduce el nombre del nuevo tag.
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
                      placeholder="Ej. Urgente"
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
          </div>
        </CardHeader>

        <CardContent>
          <TagTable
            tags={tags}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* EDITAR */}
      <Dialog
        open={!!editingTag}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTag(null);
            setEditName("");
            setEditError("");
          }
        }}
      >
        <DialogContent>
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Editar tag</DialogTitle>

              <DialogDescription>Modifica el nombre del tag.</DialogDescription>
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
                placeholder="Ej. Urgente"
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
                onClick={() => setEditingTag(null)}
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

      {/* ELIMINAR */}
      <AlertDialog
        open={!!deletingTag}
        onOpenChange={(open) => {
          if (!open && !deleteLoading) {
            setDeletingTag(null);
            setDeleteError("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tag?</AlertDialogTitle>

            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el tag{" "}
              <strong>{deletingTag?.name}</strong>? Esta acción no se puede
              deshacer.
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

      {/* VER */}
      <Dialog
        open={!!viewingTag || viewLoading}
        onOpenChange={(open) => {
          if (!open && !viewLoading) {
            setViewingTag(null);
            setViewError("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle del tag</DialogTitle>

            <DialogDescription>
              Información del tag seleccionado.
            </DialogDescription>
          </DialogHeader>

          {viewLoading && (
            <div className="py-8 text-center text-muted-foreground">
              Cargando información...
            </div>
          )}

          {viewError && (
            <div className="py-4 text-sm text-destructive">{viewError}</div>
          )}

          {viewingTag && !viewLoading && (
            <div className="space-y-5 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Nombre
                </p>

                <p className="text-base font-semibold">{viewingTag.name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Creado
                </p>

                <p className="text-sm">
                  {new Date(viewingTag.created_at).toLocaleString("es-ES")}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Actualizado
                </p>

                <p className="text-sm">
                  {new Date(viewingTag.updated_at).toLocaleString("es-ES")}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingTag(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TagList;
