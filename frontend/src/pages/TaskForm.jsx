
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getEmployees } from "../services/employeeService";
import {
  createTask,
  updateTask,
  getTaskById,
} from "../services/taskService";

function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    staff: "",
    department: "",
    priority: "",
    status: "",
  });

  useEffect(() => {
    getEmployees().then(res => setEmployees(res.data));
  }, []);

  // PRE-FILL FORM FOR EDIT MODE
  useEffect(() => {
    if (isEditMode) {
      getTaskById(id)
        .then((res) => {
          setFormData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching task:", err);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      updateTask(id, formData)
        .then(() => {
          navigate("/tasks", {
            state: { message: "Task updated successfully" },
          });
        })
        .catch((err) => {
          console.error("Error updating task:", err);
        });
    } else {
      createTask(formData)
        .then(() => {
          navigate("/tasks", {
            state: { message: "Task created successfully" },
          });
        })
        .catch((err) => {
          console.error("Error creating task:", err);
        });
    }
  };

  // return (
  //   <div className="min-h-screen bg-black">
  //     {/* Navbar */}
  //     <nav className="bg-emerald-700 text-white px-6 py-4">
  //       <h1 className="text-xl font-semibold">Task Force Management</h1>
  //     </nav>

  //     <div className="p-6 mt-20 flex justify-center">
  //       <div className="bg-white w-full max-w-xl rounded-lg shadow p-6">
  //         <h2 className="text-2xl font-bold mb-6">
  //           {isEditMode ? "Edit Task" : "Create Task"}
  //         </h2>

  //         <form onSubmit={handleSubmit} className="space-y-4">
  //           <input
  //             type="text"
  //             name="title"
  //             placeholder="Task Title"
  //             value={formData.title}
  //             onChange={handleChange}
  //             required
  //             className="w-full px-4 py-3 border rounded-lg"
  //           />

  //           {/* <input
  //             type="text"
  //             name="staff"
  //             placeholder="Staff Name"
  //             value={formData.staff}
  //             onChange={handleChange}
  //             required
  //             className="w-full px-4 py-3 border rounded-lg"
  //           /> */}


  //           <select
  //             name="staff"
  //             value={formData.staff}
  //             onChange={handleChange}
  //             required
  //             className="w-full px-4 py-3 border rounded-lg"
  //           >
  //             <option value="">Select Employee</option>
  //             {employees.map(emp => (
  //               <option key={emp.id} value={emp.name}>
  //                 {emp.name}
  //               </option>
  //             ))}
  //           </select>

  //           <select
  //             name="department"
  //             value={formData.department}
  //             onChange={handleChange}
  //             required
  //             className="w-full px-4 py-3 border rounded-lg"
  //           >
  //             <option value="">Select Department</option>
  //             <option value="Billing">Billing</option>
  //             <option value="Stock">Stock</option>
  //             <option value="Entry">Entry</option>
  //             <option value="Warehouse">Warehouse</option>
  //           </select>

  //           <select
  //             name="priority"
  //             value={formData.priority}
  //             onChange={handleChange}
  //             required
  //             className="w-full px-4 py-3 border rounded-lg"
  //           >
  //             <option value="">Select Priority</option>
  //             <option value="Low">Low</option>
  //             <option value="Medium">Medium</option>
  //             <option value="High">High</option>
  //           </select>

  //           <select
  //             name="status"
  //             value={formData.status}
  //             onChange={handleChange}
  //             required
  //             className="w-full px-4 py-3 border rounded-lg"
  //           >
  //             <option value="">Select Status</option>
  //             <option value="Assigned">Assigned</option>
  //             <option value="In Progress">In Progress</option>
  //             <option value="Completed">Completed</option>
  //           </select>

  //           <div className="flex justify-between items-center pt-4">
  //             <Link to="/tasks" className="text-gray-600 hover:underline">
  //               Cancel
  //             </Link>

  //             <button
  //               type="submit"
  //               className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
  //             >
  //               {isEditMode ? "Update Task" : "Create Task"}
  //             </button>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
  <div className="min-h-screen bg-black">
    
    {/* Navbar */}
    <nav className="bg-emerald-700 text-white px-4 md:px-6 py-4">
      <h1 className="text-lg md:text-xl font-semibold">
        Task Force Management
      </h1>
    </nav>

    {/* Form Wrapper */}
    <div className="p-4 md:p-6 mt-10 md:mt-20 flex justify-center">
      <div className="bg-white w-full max-w-xl rounded-lg shadow p-5 md:p-6">
        
        <h2 className="text-xl md:text-2xl font-bold mb-5 md:mb-6">
          {isEditMode ? "Edit Task" : "Create Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 md:py-3 border rounded-lg"
          />

          <select
            name="staff"
            value={formData.staff}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 md:py-3 border rounded-lg"
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.name}>
                {emp.name}
              </option>
            ))}
          </select>

          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 md:py-3 border rounded-lg"
          >
            <option value="">Select Department</option>
            <option value="Billing">Billing</option>
            <option value="Stock">Stock</option>
            <option value="Entry">Entry</option>
            <option value="Warehouse">Warehouse</option>
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 md:py-3 border rounded-lg"
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 md:py-3 border rounded-lg"
          >
            <option value="">Select Status</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 pt-4">
            
            <Link
              to="/tasks"
              className="text-gray-600 hover:underline text-center md:text-left"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="bg-black text-white px-6 py-2 md:py-3 rounded-lg hover:bg-gray-800 w-full md:w-auto"
            >
              {isEditMode ? "Update Task" : "Create Task"}
            </button>

          </div>

        </form>
      </div>
    </div>
  </div>
);

}

export default TaskForm;
