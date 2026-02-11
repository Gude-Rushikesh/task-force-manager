import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
  createEmployee,
  updateEmployee,
  getEmployeeById
} from "../services/employeeService";

function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    status: ""
  });

  useEffect(() => {
    if (isEditMode) {
      getEmployeeById(id)
        .then(res => setFormData(res.data))
        .catch(err => console.error(err));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      updateEmployee(id, formData).then(() => {
        navigate("/tasks", {
          state: { message: "Employee updated successfully" }
        });
      });
    } else {
      createEmployee(formData).then(() => {
        navigate("/tasks", {
          state: { message: "Employee added successfully" }
        });
      });
    }
  };

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
              {isEditMode ? "Edit Employee" : "Add Employee"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Employee Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 md:py-3 border rounded-lg"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 md:py-3 border rounded-lg"
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 md:py-3 border rounded-lg"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 md:py-3 border rounded-lg"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Leave">Leave</option>
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
                  {isEditMode ? "Update Employee" : "Add Employee"}
                </button>

              </div>

            </form>
          </div>
        </div>
      </div>
    );

}

export default EmployeeForm;
