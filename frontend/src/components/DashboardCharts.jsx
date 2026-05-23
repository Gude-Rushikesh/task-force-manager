import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b"]; // blue, green, amber

function DashboardCharts({ tasks, employees }) {

  /* ===== 1. STATUS PIE ===== */
  const statusData = ["Assigned", "In Progress", "Completed"].map(status => ({
    name: status,
    value: tasks.filter(t => t.status === status).length
  }));

  /* ===== 2. DEPARTMENT BAR ===== */
  const departments = ["Billing", "Stock", "Entry", "Warehouse"];
  const departmentData = departments.map(dep => ({
    department: dep,
    tasks: tasks.filter(
      t => t.department === dep && t.status !== "Completed"
    ).length
  }));

  /* ===== 3. PRIORITY BAR ===== */
  const priorities = ["High", "Medium", "Low"];
  const priorityData = priorities.map(p => ({
    priority: p,
    count: tasks.filter(t => t.priority === p).length
  }));

  const employeeStatusData = [
        {
            name: "Active",
            value: employees.filter(e => e.status === "Active").length
        },
        {
            name: "Inactive",
            value: employees.filter(e => e.status === "Inactive").length
        }
        ];
  return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 my-6 px-2 md:px-0">

    {/* STATUS PIE */}
    <div className="bg-white text-black p-3 md:p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2 text-sm md:text-base">Task Status</h3>
      <ResponsiveContainer width="100%" height={200} className="md:h-55">
        <PieChart>
          <Pie
            data={statusData}
            dataKey="value"
            nameKey="name"
            outerRadius={window.innerWidth < 768 ? 70 : 100}
          >
            {statusData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* DEPARTMENT BAR */}
    <div className="bg-white text-black p-3 md:p-4 rounded shadow">
      <h3 className="font-semibold mb-2 text-sm md:text-base">
        Active Tasks by Department
      </h3>
      <ResponsiveContainer width="100%" height={220} className="md:h-65">
        <BarChart
          data={departmentData}
          margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
        >
          <XAxis
            dataKey="department"
            interval={0}
            tick={{ fontSize: 10 }}
          />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="tasks"
            fill="#0ea5e9"
            radius={[6, 6, 0, 0]}
            barSize={window.innerWidth < 768 ? 18 : 30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* PRIORITY BAR */}
    <div className="bg-white p-3 md:p-4 rounded shadow">
      <h3 className="font-semibold mb-2 text-sm md:text-base">
        Task Priority Split
      </h3>
      <ResponsiveContainer width="100%" height={220} className="md:h-65">
        <BarChart
          data={priorityData}
          margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
        >
          <XAxis
            dataKey="priority"
            interval={0}
            tick={{ fontSize: 10 }}
          />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#22c55e"
            radius={[6, 6, 0, 0]}
            barSize={window.innerWidth < 768 ? 18 : 30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* EMPLOYEE STATUS */}
    <div className="bg-white p-3 md:p-4 rounded shadow">
      <h3 className="font-semibold mb-2 text-sm md:text-base">
        Employee Status
      </h3>
      <ResponsiveContainer width="100%" height={200} className="md:h-55">
        <PieChart>
          <Pie
            data={employeeStatusData}
            dataKey="value"
            outerRadius={window.innerWidth < 768 ? 60 : 80}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

  </div>
);

}

export default DashboardCharts;
