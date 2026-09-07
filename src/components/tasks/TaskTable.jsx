import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Button } from "../ui/button";

import { Pencil, Trash2, Eye } from "lucide-react";

function TaskTable({ tasks, onEdit, onDelete, onView }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-[180px] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.id}</TableCell>

                <TableCell>{task.title}</TableCell>

                <TableCell>{task.description}</TableCell>

                <TableCell>
                  {task.status ? "Completada" : "Pendiente"}
                </TableCell>

                <TableCell>{task.category?.name ?? "Sin categoría"}</TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {task.tags?.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-md border px-2 py-1 text-xs"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(task)}
                      title="Ver tarea"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(task)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(task)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No hay tareas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default TaskTable;
