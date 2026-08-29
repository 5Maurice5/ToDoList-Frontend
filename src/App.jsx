import { useEffect } from "react"
import { getAllTask } from "./services/tarea.service"

function App() {

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await getAllTask();
        console.log(tasks);
        
      } catch (error) {
        console.error("Error al obtener las tareas: ", error);
      }
    }
    loadTasks();
  }, [])

  return (
    <div>Ticket 6 - Consumo de API</div>
  )
}
export default App