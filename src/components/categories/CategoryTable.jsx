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

function CategoryTable({ categories, onEdit, onDelete, onView }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>

            <TableHead>Nombre</TableHead>

            <TableHead className="w-[180px] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.id}</TableCell>

                <TableCell>{category.name}</TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    {/* Ver */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(category)}
                      title="Ver categoría"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* Editar */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(category)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>

                    {/* Eliminar */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(category)}
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
              <TableCell colSpan={3} className="h-24 text-center">
                No hay categorías registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default CategoryTable;
