

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation} from "react-router-dom";
import { getTasks, deleteTask } from "../services/taskService";
import { getEmployees, deleteEmployee } from "../services/employeeService";
import DashboardCharts from "../components/DashboardCharts";


function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [employees, setEmployees] = useState([]);


  useEffect(() => {
    getTasks()
        .then((res) => {
        setTasks(res.data);
        })
        .catch((err) => {
        console.error("Error fetching tasks:", err);
        });
    }, [location.key]);


  useEffect(() => {
    if (location.state?.message) {
        setSuccessMessage(location.state.message);

        const timer = setTimeout(() => {
        setSuccessMessage("");
        }, 3000);

        window.history.replaceState({}, document.title);

        return () => clearTimeout(timer);
    }
  }, [location.state]);


    useEffect(() => {
    getEmployees()
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
      });
  }, [location.key]);



  //filtering logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
  (task.title || "").toLowerCase().includes(search.toLowerCase()) ||
  (task.staff || "").toLowerCase().includes(search.toLowerCase());


    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-black text-white px-4 md:px-6 py-4 flex justify-between items-center">

        <h1 className="text-xl font-semibold">Task Force Manager</h1>
        <Link to="/" className="text-gray-300 hover:text-white">
          Home
        </Link>
      </nav>

      {successMessage && (
        <div className="mx-6 mt-4 bg-green-400 text-black px-4 py-3 rounded-lg">
            {successMessage}
        </div>
        )}


      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

              <h2 className="text-3xl font-bold">Dashboard</h2>

              <Link
                to="/create"
                className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 shadow w-full md:w-auto text-center"
 
              >
                + Create Task
              </Link>
            </div>


          <div className="mb-6">

              <DashboardCharts 
                  tasks={tasks} 
                  employees={employees}
                />


              {/* <div className="flex gap-4">
                <Link
                  to="/create"
                  className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800"
                >
                  + Create Task
                </Link>

                <Link
                  to="/add-employee"
                  className="bg-gray-800 text-white px-5 py-3 rounded-lg hover:bg-black"
                >
                  + Add Employee
                </Link>
              </div> */}

            </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by task or staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-2/3 px-4 py-2 md:py-3 border rounded-lg"

          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-2/3 px-4 py-2 md:py-3 border rounded-lg"

          >
            <option value="All">All Status</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Table */}
        {/* <div className="bg-white rounded-lg shadow overflow-x-auto"> */}
        <div className="bg-white rounded-lg shadow overflow-x-auto max-h-90 overflow-y-auto">

          <table className="min-w-[700px] md:min-w-full">

            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Task</th>
                <th className="px-4 py-3 text-left">Staff</th>
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{task.title}</td>
                  <td className="px-4 py-3">{task.staff}</td>
                  <td className="px-4 py-3">{task.department}</td>
                  <td className="px-4 py-3">{task.priority}</td>
                  <td className="px-4 py-3">{task.status}</td>
                  <td className="px-4 py-3 text-center space-x-3">
                    <Link
                      to={`/edit/${task.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setTaskToDelete(task);
                        setShowModal(true);
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* EMPLOYEE SECTION */}
                <div className="mt-12">

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">

                    <h3 className="text-2xl font-semibold">Employees</h3>

                    <Link
                      to="/add-employee"
                     className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 w-full md:w-auto text-center"

                    >
                      + Add Employee
                    </Link>
                  </div>

                  <div className="bg-white rounded-lg shadow max-h-75 overflow-y-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left">Name</th>
                          <th className="px-4 py-3 text-left">ID</th>
                          <th className="px-4 py-3 text-left">Phone</th>
                          <th className="px-4 py-3 text-left">Location</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {employees.map(emp => (
                          <tr key={emp.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">{emp.name}</td>
                            <td className="px-4 py-3">{emp.id}</td>
                            <td className="px-4 py-3">{emp.phone}</td>
                            <td className="px-4 py-3">{emp.location}</td>
                            <td className="px-4 py-3">
                              <span className={
                                emp.status === "Active"
                                ? "text-green-600 font-medium"
                                : emp.status === "Leave"
                                ? "text-yellow-600 font-medium"
                                : "text-red-600 font-medium"
                              }>
                                {emp.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 space-x-3">
                                    <Link
                                      to={`/edit-employee/${emp.id}`}
                                      className="text-blue-600 hover:underline"
                                    >
                                      Edit
                                    </Link>

                                    <button
                                      onClick={() => {
                                        deleteEmployee(emp.id).then(() => {
                                          setEmployees(
                                            employees.filter(e => e.id !== emp.id)
                                          );
                                        });
                                      }}
                                      className="text-red-600 hover:underline"
                                    >
                                      Delete
                                    </button>
                                  </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
      </div>
              
      {showModal && (
        // <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
                Delete Task
            </h3>

            <p className="text-gray-600 mb-6">
                Are you sure you want to delete
                <span className="font-semibold">
                {" "}
                {taskToDelete?.title}
                </span>
                ?
            </p>

            <div className="flex justify-end gap-3">
                <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
                >
                Cancel
                </button>

                <button
                onClick={() => {
                    deleteTask(taskToDelete.id)
                        .then(() => {
                            setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
                            setShowModal(false);
                        })
                        .catch((err) => {
                            console.error("Error deleting task:", err);
                        });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                Delete
                </button>
            </div>
            </div>
            </div>
        )}
    </div>
  );
}

export default Dashboard;
