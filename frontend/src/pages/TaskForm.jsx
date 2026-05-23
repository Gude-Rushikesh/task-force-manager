import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { createTask, getTaskById, updateTask } from "../services/taskService";
import { getEmployees } from "../services/employeeService";
import { getDepartments } from "../services/departmentService";
import { apiError } from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyTask = {
  title: "",
  description: "",
  assignedTo: "",
  department: "",
  priority: "Medium",
  status: "Assigned",
  dueDate: "",
  estimatedHours: 4,
};

export default function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { canManage } = useAuth();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(emptyTask);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [employeeRes, departmentRes, taskRes] = await Promise.all([
          getEmployees(),
          getDepartments(),
          isEditMode ? getTaskById(id) : Promise.resolve({ data: null }),
        ]);
        setEmployees(employeeRes.data.items.filter((employee) => employee.status !== "Inactive"));
        setDepartments(departmentRes.data.items.filter((department) => department.status === "Active"));
        if (taskRes.data) {
          setFormData({
            title: taskRes.data.title || "",
            description: taskRes.data.description || "",
            assignedTo: taskRes.data.assignedTo?._id || "",
            department: taskRes.data.department?._id || "",
            priority: taskRes.data.priority || "Medium",
            status: taskRes.data.status || "Assigned",
            dueDate: taskRes.data.dueDate ? taskRes.data.dueDate.slice(0, 10) : "",
            estimatedHours: taskRes.data.estimatedHours || 0,
          });
        }
      } catch (err) {
        setError(apiError(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isEditMode]);

  if (!canManage) return <Navigate to="/tasks" replace />;

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...formData,
        estimatedHours: Number(formData.estimatedHours),
      };
      if (isEditMode) {
        await updateTask(id, payload);
      } else {
        await createTask(payload);
      }
      navigate("/tasks");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded border border-slate-200 bg-white p-6">Loading task form...</div>;

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/tasks" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <div className="rounded border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Task workflow
          </p>
          <h2 className="mt-1 text-2xl font-bold">{isEditMode ? "Edit task" : "Create task"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 p-5 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold">Title</span>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full rounded border border-slate-300 px-4 py-3 outline-none focus:border-slate-950" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold">Description</span>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full resize-none rounded border border-slate-300 px-4 py-3 outline-none focus:border-slate-950" />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Assignee</span>
            <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} required className="w-full rounded border border-slate-300 px-4 py-3">
              <option value="">Select employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} ({employee.employeeCode})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Department</span>
            <select name="department" value={formData.department} onChange={handleChange} required className="w-full rounded border border-slate-300 px-4 py-3">
              <option value="">Select department</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>{department.name}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Priority</span>
            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full rounded border border-slate-300 px-4 py-3">
              {["Low", "Medium", "High", "Critical"].map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Status</span>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded border border-slate-300 px-4 py-3">
              {["Backlog", "Assigned", "In Progress", "Review", "Completed", "Blocked"].map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Due date</span>
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="w-full rounded border border-slate-300 px-4 py-3" />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Estimated hours</span>
            <input type="number" min="0" name="estimatedHours" value={formData.estimatedHours} onChange={handleChange} className="w-full rounded border border-slate-300 px-4 py-3" />
          </label>

          {error && <div className="md:col-span-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 md:col-span-2 md:flex-row md:justify-end">
            <Link to="/tasks" className="rounded border border-slate-300 px-5 py-3 text-center text-sm font-semibold hover:bg-slate-50">
              Cancel
            </Link>
            <button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400">
              <Save size={16} />
              {saving ? "Saving..." : isEditMode ? "Update task" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
