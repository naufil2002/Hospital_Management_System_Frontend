import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function EditBill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [bill, setBill] = useState({
    amount: "",
    status: "",
  });

  // ✅ Get query parameters for return navigation
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page") || 0;
  const search = queryParams.get("search") || "";

  useEffect(() => {
  axios.get(`https://hospital-management-system-backend-0gg8.onrender.com/api/v1/bills/${id}`).then((res) => {
    setBill({
      amount: res.data.amount || "",
      status: res.data.status || "",
      appointment: res.data.appointment || null, // ✅ preserve this
    });
  });
}, [id]);


  const handleChange = (e) => {
    setBill({ ...bill, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.put(`https://hospital-management-system-backend-0gg8.onrender.com/api/v1/bills/${id}`, {
      amount: bill.amount,
      status: bill.status,
      appointment: bill.appointment,
    });

    toast.success("✅ Bill updated successfully!", { autoClose: 2000 });
    navigate(`/bills?page=${page}&search=${search}`);
  } catch (err) {
    console.error("Update failed", err);
    toast.error("❌ Failed to update bill.");
  }
};




  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Edit Bill
        </h2>

        <input
          type="number"
          name="amount"
          value={bill.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
          required
        />

        <select
          name="status"
          value={bill.status}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Select Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default EditBill;
