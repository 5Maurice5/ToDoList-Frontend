import { useEffect } from "react";
import { getAllTask } from "./services/tarea.service";

function App() {
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasks = await getAllTask();
    } catch (error) {
      console.error("Error al obtener las tareas: ", error);
    }
  };
  return <div>Ticket 6 - Consumo de API</div>;
}
export default App;
