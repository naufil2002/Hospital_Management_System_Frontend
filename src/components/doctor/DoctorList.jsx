import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const pageSize = 10;
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    fetchDoctors();
  }, [page]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`https://hospital-management-system-backend-0gg8.onrender.com/api/v1/doctors?page=${page}`);
      setDoctors(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`https://hospital-management-system-backend-0gg8.onrender.com/api/v1/doctors/${id}`);
      fetchDoctors(); // refresh list
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const term = searchTerm.toLowerCase();
    return (
      doc.name.toLowerCase().includes(term) ||
      doc.speciality.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-2 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Doctor List</h2>

      <input
        type="text"
        placeholder="Search by name or specialization..."
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
              <th className="py-2 px-4">Specialization</th>
              {isAdmin && <th className="py-2 px-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doc, idx) => (
              <tr key={doc.id} className="border-b">
                <td className="py-2 px-4">{page * pageSize + idx + 1}</td>
                <td className="py-2 px-4">{doc.name}</td>
                <td className="py-2 px-4">{doc.speciality}</td>
                {isAdmin && (
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/edit-doctor/${doc.id}?page=${page}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
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

        {filteredDoctors.length === 0 && (
          <p className="mt-4 text-gray-500">No doctors found.</p>
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

export default ViewDoctor;
