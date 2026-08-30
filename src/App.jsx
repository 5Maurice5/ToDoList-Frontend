import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";

import TaskList from "./components/tasks/TaskList";
import UserList from "./components/users/UserList";
import CategoryList from "./components/categories/CategoryList";
import TagList from "./components/tags/TagList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/tasks" replace />} />

          <Route path="tasks" element={<TaskList />} />
          <Route path="users" element={<UserList />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="tags" element={<TagList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
