import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { createEmployee, getEmployeeById, updateEmployee } from "../services/employeeService";
import { getDepartments } from "../services/departmentService";
import { apiError } from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyEmployee = {
  employeeCode: "",
  name: "",
  email: "",
  phone: "",
  location: "",
  department: "",
  designation: "Associate",
  capacityHoursPerWeek: 40,
  status: "Active",
};

export default function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { canManage } = useAuth();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(emptyEmployee);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [departmentRes, employeeRes] = await Promise.all([
          getDepartments(),
          isEditMode ? getEmployeeById(id) : Promise.resolve({ data: null }),
        ]);
        setDepartments(departmentRes.data.items.filter((department) => department.status === "Active"));
        if (employeeRes.data) {
          setFormData({
            employeeCode: employeeRes.data.employeeCode || "",
            name: employeeRes.data.name || "",
            email: employeeRes.data.email || "",
            phone: employeeRes.data.phone || "",
            location: employeeRes.data.location || "",
            department: employeeRes.data.department?._id || "",
            designation: employeeRes.data.designation || "Associate",
            capacityHoursPerWeek: employeeRes.data.capacityHoursPerWeek || 40,
            status: employeeRes.data.status || "Active",
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
        capacityHoursPerWeek: Number(formData.capacityHoursPerWeek),
      };
      if (isEditMode) {
        await updateEmployee(id, payload);
      } else {
        await createEmployee(payload);
      }
      navigate("/tasks");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded border border-slate-200 bg-white p-6">Loading employee form...</div>;

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/tasks" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <div className="rounded border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Workforce directory
          </p>
          <h2 className="mt-1 text-2xl font-bold">{isEditMode ? "Edit employee" : "Add employee"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 p-5 md:grid-cols-2">
          {[
            ["employeeCode", "Employee code", "text"],
            ["name", "Full name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "text"],
            ["location", "Location", "text"],
            ["designation", "Designation", "text"],
          ].map(([name, label, type]) => (
            <label key={name}>
              <span className="mb-1 block text-sm font-semibold">{label}</span>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={["employeeCode", "name"].includes(name)}
                className="w-full rounded border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
              />
            </label>
          ))}

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
            <span className="mb-1 block text-sm font-semibold">Status</span>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded border border-slate-300 px-4 py-3">
              {["Active", "Inactive", "Leave"].map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Weekly capacity</span>
            <input type="number" min="1" max="80" name="capacityHoursPerWeek" value={formData.capacityHoursPerWeek} onChange={handleChange} className="w-full rounded border border-slate-300 px-4 py-3" />
          </label>

          {error && <div className="md:col-span-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 md:col-span-2 md:flex-row md:justify-end">
            <Link to="/tasks" className="rounded border border-slate-300 px-5 py-3 text-center text-sm font-semibold hover:bg-slate-50">
              Cancel
            </Link>
            <button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400">
              <Save size={16} />
              {saving ? "Saving..." : isEditMode ? "Update employee" : "Add employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
