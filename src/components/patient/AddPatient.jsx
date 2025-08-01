import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddPatient() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://hospital-management-system-backend-0gg8.onrender.com/api/v1/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("✅ Patient added successfully!", { autoClose: 2000 });
        setFormData({ name: "", age: "", gender: "" });
        navigate("/patients");
      } else {
        toast.error("❌ Failed to add patient.");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Server error.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Patient</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      <button
        onClick={() => navigate("/")}
        className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded"
      >
        ⬅ Go Back Home
      </button>
    </div>
  );
}
