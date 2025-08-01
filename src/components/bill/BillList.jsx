import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const pageSize = 10;

  useEffect(() => {
    fetchBills();
  }, [page]);

  const fetchBills = async () => {
    try {
      const res = await axios.get(`https://hospital-management-system-backend-0gg8.onrender.com/api/v1/bills?page=${page}&size=${pageSize}`);
      if (Array.isArray(res.data)) {
        setBills(res.data);
        setTotalPages(1);
      } else {
        setBills(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    try {
      await axios.delete(`https://hospital-management-system-backend-0gg8.onrender.com/api/v1/bills/${id}`);
      fetchBills();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredBills = bills.filter((bill) => {
    const term = searchTerm.toLowerCase();
    return (
      bill.appointment?.patient?.name?.toLowerCase().includes(term) ||
      bill.appointment?.doctor?.name?.toLowerCase().includes(term) ||
      bill.appointment?.date?.includes(term)
    );
  });

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Bills</h2>

      <input
        type="text"
        placeholder="Search by patient or doctor..."
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
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Date</th>
              {isAdmin && <th className="py-2 px-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((b, idx) => (
              <tr key={b.id} className="border-b">
                <td className="py-2 px-4">{page * pageSize + idx + 1}</td>
                <td className="py-2 px-4">{b.appointment?.patient?.name}</td>
                <td className="py-2 px-4">{b.appointment?.doctor?.name}</td>
                <td className="py-2 px-4">{b.amount}</td>
                <td className="py-2 px-4">{b.status}</td>
                <td className="py-2 px-4">{b.appointment?.date}</td>
                {isAdmin && (
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => navigate(`/edit-bill/${b.id}?page=${page}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
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

        {filteredBills.length === 0 && (
          <p className="mt-4 text-gray-500">No bills found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
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

      <div className="mt-6 text-center">
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

export default BillList;
