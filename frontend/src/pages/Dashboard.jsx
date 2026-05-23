import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Edit3,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getOverview, getActivity } from "../services/analyticsService";
import { deleteTask, getTasks, updateTask } from "../services/taskService";
import { deleteEmployee, getEmployees } from "../services/employeeService";
import { apiError } from "../services/api";
import { useAuth } from "../context/AuthContext";

const statusOptions = ["All", "Backlog", "Assigned", "In Progress", "Review", "Completed", "Blocked"];
const priorityOptions = ["All", "Low", "Medium", "High", "Critical"];
const chartColors = ["#0f172a", "#0f766e", "#d97706", "#dc2626", "#2563eb", "#7c3aed"];

function StatCard({ icon, label, value, tone }) {
  const IconComponent = icon;
  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded ${tone}`}>
          <IconComponent size={20} />
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700",
    "In Progress": "bg-blue-50 text-blue-700",
    Review: "bg-violet-50 text-violet-700",
    Blocked: "bg-red-50 text-red-700",
    Assigned: "bg-amber-50 text-amber-700",
    Backlog: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`rounded px-2 py-1 text-xs font-semibold ${styles[status] || styles.Backlog}`}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  const { canManage, isAdmin } = useAuth();
  const [overview, setOverview] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activity, setActivity] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "All", priority: "All" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [overviewRes, tasksRes, employeesRes, activityRes] = await Promise.all([
        getOverview(),
        getTasks(),
        getEmployees(),
        canManage ? getActivity() : Promise.resolve({ data: { items: [] } }),
      ]);
      setOverview(overviewRes.data);
      setTasks(tasksRes.data.items);
      setEmployees(employeesRes.data.items);
      setActivity(activityRes.data.items);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [canManage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const assignee = task.assignedTo?.name || "";
      const matchesSearch =
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        assignee.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === "All" || task.status === filters.status;
      const matchesPriority = filters.priority === "All" || task.priority === filters.priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, filters]);

  const handleStatusChange = async (task, status) => {
    try {
      const { data } = await updateTask(task._id, { status });
      setTasks((current) => current.map((item) => (item._id === data._id ? data : item)));
      const overviewRes = await getOverview();
      setOverview(overviewRes.data);
    } catch (err) {
      setError(apiError(err));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    await deleteTask(taskId);
    setTasks((current) => current.filter((task) => task._id !== taskId));
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(employeeId);
      setEmployees((current) => current.filter((employee) => employee._id !== employeeId));
    } catch (err) {
      setError(apiError(err));
    }
  };

  if (loading) {
    return <div className="rounded border border-slate-200 bg-white p-6">Loading command center...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Command Center
          </p>
          <h2 className="mt-1 text-3xl font-black text-slate-950">Operations dashboard</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Track assignments, risk, employee capacity, and department throughput from live API data.
          </p>
        </div>
        {canManage && (
          <div className="flex gap-3">
            <Link to="/add-employee" className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">
              Add employee
            </Link>
            <Link to="/create" className="rounded bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Create task
            </Link>
          </div>
        )}
      </div>

      {error && <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={ClipboardList} label="Total tasks" value={overview?.totals.totalTasks || 0} tone="bg-slate-100 text-slate-950" />
        <StatCard icon={CheckCircle2} label="Completed" value={overview?.totals.completedTasks || 0} tone="bg-emerald-50 text-emerald-700" />
        <StatCard icon={AlertTriangle} label="Overdue" value={overview?.totals.overdueTasks || 0} tone="bg-red-50 text-red-700" />
        <StatCard icon={Users} label="Active employees" value={overview?.totals.activeEmployees || 0} tone="bg-blue-50 text-blue-700" />
        <StatCard icon={CheckCircle2} label="Completion rate" value={`${overview?.totals.completionRate || 0}%`} tone="bg-amber-50 text-amber-700" />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-slate-950">Task status</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={overview?.byStatus || []} dataKey="count" nameKey="_id" innerRadius={58} outerRadius={90}>
                  {(overview?.byStatus || []).map((_, index) => (
                    <Cell key={index} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-slate-950">Department workload</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={overview?.byDepartment || []}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-4 lg:grid-cols-[1fr_180px_180px]">
          <label className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search task or assignee"
              className="w-full rounded border border-slate-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-slate-950"
            />
          </label>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="rounded border border-slate-300 px-3 py-2 text-sm">
            {statusOptions.map((status) => <option key={status}>{status}</option>)}
          </select>
          <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="rounded border border-slate-300 px-3 py-2 text-sm">
            {priorityOptions.map((priority) => <option key={priority}>{priority}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr key={task._id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-950">{task.title}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">{task.description}</p>
                  </td>
                  <td className="px-4 py-4">{task.assignedTo?.name}</td>
                  <td className="px-4 py-4">{task.department?.name}</td>
                  <td className="px-4 py-4 font-semibold">{task.priority}</td>
                  <td className="px-4 py-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    {canManage ? (
                      <select value={task.status} onChange={(e) => handleStatusChange(task, e.target.value)} className="rounded border border-slate-300 px-2 py-1 text-xs font-semibold">
                        {statusOptions.filter((status) => status !== "All").map((status) => <option key={status}>{status}</option>)}
                      </select>
                    ) : (
                      <StatusBadge status={task.status} />
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Link to={`/edit/${task._id}`} className="rounded border border-slate-200 p-2 text-slate-600 hover:bg-slate-100" title="Edit task">
                        <Edit3 size={16} />
                      </Link>
                      {canManage && (
                        <button onClick={() => handleDeleteTask(task._id)} className="rounded border border-red-200 p-2 text-red-600 hover:bg-red-50" title="Delete task">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {canManage && (
        <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <div className="rounded border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <h3 className="text-sm font-bold">Employee directory</h3>
              <Link to="/add-employee" className="text-sm font-semibold text-slate-700 hover:text-slate-950">Add</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td className="px-4 py-3 font-semibold">{employee.name}</td>
                      <td className="px-4 py-3 text-slate-500">{employee.employeeCode}</td>
                      <td className="px-4 py-3">{employee.department?.name}</td>
                      <td className="px-4 py-3"><StatusBadge status={employee.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/edit-employee/${employee._id}`} className="mr-3 font-semibold text-slate-700 hover:text-slate-950">Edit</Link>
                        {isAdmin && <button onClick={() => handleDeleteEmployee(employee._id)} className="font-semibold text-red-600">Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-sm font-bold">Recent activity</h3>
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item._id} className="rounded border border-slate-100 bg-slate-50 p-3">
                  <p className="text-sm font-semibold">{item.actor?.name || "System"} {item.action}</p>
                  <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))}
              {activity.length === 0 && <p className="text-sm text-slate-500">No activity yet.</p>}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
