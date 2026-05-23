import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import TaskForm from "../pages/TaskForm";
import EmployeeForm from "../pages/EmployeeForm";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import AppShell from "../components/AppShell";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Dashboard />} />
          <Route path="/create" element={<TaskForm />} />
          <Route path="/edit/:id" element={<TaskForm />} />
          <Route path="/add-employee" element={<EmployeeForm />} />
          <Route path="/edit-employee/:id" element={<EmployeeForm />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
