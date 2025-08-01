import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddDoctor() {
  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("https://hospital-management-system-backend-0gg8.onrender.com/api/v1/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("✅ Doctor added successfully!");
      navigate("/doctors"); // 👈 redirect after success
    } else {
      alert("❌ Failed to add doctor.");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Server error.");
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Doctor</h2>
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
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
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
