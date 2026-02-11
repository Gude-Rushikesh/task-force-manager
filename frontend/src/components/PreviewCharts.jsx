import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b"];

function PreviewCharts() {

  const [priorityData, setPriorityData] = useState(generatePriority());
  const [departmentData, setDepartmentData] = useState(generateDepartment());
  const [statusData, setStatusData] = useState(generateStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setPriorityData(generatePriority());
      setDepartmentData(generateDepartment());
      setStatusData(generateStatus());
    }, 2500); // updates every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

    {/* STATUS PIE */}
    <div className="bg-black p-4 md:p-6 rounded-xl border border-black shadow-lg">
      <h3 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">
        Task Status
      </h3>

      {/* Mobile smaller height */}
      <div className="h-[200px] md:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              outerRadius={90}
              isAnimationActive={true}
              label={({ value, percent }) =>
                `${value} (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {statusData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* DEPARTMENT BAR */}
    <div className="bg-black p-4 md:p-6 rounded-xl shadow-lg">
      <h3 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">
        Active Tasks
      </h3>

      <div className="h-[200px] md:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={departmentData}>
            <XAxis
              dataKey="department"
              stroke="#aaa"
              tick={{ fontSize: 10 }}   // smaller only visually, safe for desktop
            />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Bar
              dataKey="tasks"
              fill="#0ea5e9"
              radius={[6, 6, 0, 0]}
              barSize={28}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* PRIORITY BAR */}
    <div className="bg-black p-4 md:p-6 rounded-xl shadow-lg">
      <h3 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">
        Priority Split
      </h3>

      <div className="h-[200px] md:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priorityData}>
            <XAxis
              dataKey="priority"
              stroke="#aaa"
              tick={{ fontSize: 10 }}
            />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
              barSize={28}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

  </div>
);

}

/* ==== Random Data Generators ==== */

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generatePriority() {
  return [
    { priority: "High", count: random(6, 15) },
    { priority: "Medium", count: random(4, 12) },
    { priority: "Low", count: random(2, 10) },
  ];
}

function generateDepartment() {
  return [
    { department: "Billing", tasks: random(2, 10) },
    { department: "Stock", tasks: random(2, 10) },
    { department: "Entry", tasks: random(2, 10) },
    { department: "Warehouse", tasks: random(2, 10) },
  ];
}

function generateStatus() {
  return [
    { name: "Assigned", value: random(4, 12) },
    { name: "In Progress", value: random(4, 12) },
    { name: "Completed", value: random(4, 12) },
  ];
}

export default PreviewCharts;
