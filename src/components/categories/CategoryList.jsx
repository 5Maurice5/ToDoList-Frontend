import { useEffect, useState } from "react";
import { getAll } from "../../services/category.service";
import CategoryTable from "./CategoryTable";

function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAll();

        setCategories(data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categorías</h1>

      <CategoryTable categories={categories} />
    </div>
  );
}

export default CategoryList;
