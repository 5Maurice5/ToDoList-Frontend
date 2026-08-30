import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Button } from "../ui/button";

import { Pencil, Trash2 } from "lucide-react";

function CategoryTable({ categories }) {
  const handleEdit = (category) => {
    console.log("Editar categoría:", category);
  };

  const handleDelete = (category) => {
    console.log("Eliminar categoría:", category);
  };

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
                    {/* Editar */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>

                    {/* Eliminar */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category)}
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
