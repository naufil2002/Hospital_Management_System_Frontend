import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const pageSize = 10;
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    fetchPatients();
  }, [page]);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`https://hospital-management-system-backend-0gg8.onrender.com/api/v1/patients?page=${page}`);
      setPatients(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching patients:", err);
      toast.error("❌ Failed to fetch patients");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this patient?");
    if (!confirmed) return;

    try {
      await axios.delete(`https://hospital-management-system-backend-0gg8.onrender.com/api/v1/patients/${id}`);
      toast.success("✅ Patient deleted successfully!");
      fetchPatients();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("❌ Failed to delete patient");
    }
  };

  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.age.toString().includes(term) ||
      p.gender.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-2 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Patient List</h2>

      <input
        type="text"
        placeholder="Search by name, age, or gender..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Age</th>
              <th className="py-2 px-4">Gender</th>
              {isAdmin && <th className="py-2 px-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient, idx) => (
              <tr key={patient.id} className="border-b">
                <td className="py-2 px-4">{page * pageSize + idx + 1}</td>
                <td className="py-2 px-4">{patient.name}</td>
                <td className="py-2 px-4">{patient.age}</td>
                <td className="py-2 px-4">{patient.gender}</td>
                {isAdmin && (
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/edit-patient/${patient.id}?page=${page}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 && (
          <p className="mt-4 text-gray-500">No patients found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Back to Home */}
      <div className="mt-4 text-center">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded"
        >
          ⬅ Go Back Home
        </button>
      </div>
    </div>
  );
};

export default PatientList;
