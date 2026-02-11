import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import TaskForm from "../pages/TaskForm";
import EmployeeForm from "../pages/EmployeeForm";
// import OrbitAnimation from "../components/OrbitAnimation";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />,
      <Route path="/tasks" element={<Dashboard />} />,
      <Route path="/create" element={<TaskForm />} />,
      <Route path="/edit/:id" element={<TaskForm />} />,
      <Route path="/add-employee" element={<EmployeeForm />} />
      <Route path="/edit-employee/:id" element={<EmployeeForm />} />

      {/* <Route path="/orbit" element={<OrbitAnimation />} /> */}
    </Routes>
  );
}

export default AppRoutes;
