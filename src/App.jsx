import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/auth/Login";

import TaskList from "./components/tasks/TaskList";
import UserList from "./components/users/UserList";
import CategoryList from "./components/categories/CategoryList";
import TagList from "./components/tags/TagList";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={token ? <Navigate to="/tasks" replace /> : <Login />}
        />

        {/* RUTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/tasks" replace />} />

            <Route path="tasks" element={<TaskList />} />

            <Route path="users" element={<UserList />} />

            <Route path="categories" element={<CategoryList />} />

            <Route path="tags" element={<TagList />} />
          </Route>
        </Route>

        {/* CUALQUIER RUTA DESCONOCIDA */}
        <Route
          path="*"
          element={<Navigate to={token ? "/tasks" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
