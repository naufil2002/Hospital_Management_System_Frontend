import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const pageSize = 10;
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    fetchAppointments();
  }, [page]);

  const fetchAppointments = async () => {
    try {
     const res = await axios.get(
  `https://hospital-management-system-backend-0gg8.onrender.com/api/v1/appointments?page=${page}&size=${pageSize}&sortBy=date`);
      console.log("🟡 appointments API response:", res.data);
      setAppointments(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("❌ Failed to fetch appointments.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await axios.delete(`/api/v1/appointments/${id}`);
      toast.success("✅ Appointment deleted successfully.");
      fetchAppointments();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("❌ Failed to delete appointment.");
    }
  };

  const filteredAppointments = (appointments || []).filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.patient?.name?.toLowerCase().includes(term) ||
      a.doctor?.name?.toLowerCase().includes(term) ||
      a.date?.includes(term)
    );
  });

  return (
    <div className="p-2 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Appointment List</h2>

      <input
        type="text"
        placeholder="Search by patient, doctor, or date..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Patient</th>
              <th className="py-2 px-4">Doctor</th>
              <th className="py-2 px-4">Speciality</th>
              <th className="py-2 px-4">Date</th>
              {isAdmin && <th className="py-2 px-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((a, idx) => (
              <tr key={a.id} className="border-b">
                <td className="py-2 px-4">{page * pageSize + idx + 1}</td>
                <td className="py-2 px-4">{a.patient?.name || "N/A"}</td>
                <td className="py-2 px-4">{a.doctor?.name || "N/A"}</td>
                <td className="py-2 px-4">{a.doctor?.speciality || "N/A"}</td>
                <td className="py-2 px-4">{a.date}</td>
                {isAdmin && (
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => handleDelete(a.id)}
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

        {filteredAppointments.length === 0 && (
          <p className="mt-4 text-gray-500">No appointments found.</p>
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
        <span className="px-4 py-2">{page + 1} / {totalPages}</span>
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

export default AppointmentList;
