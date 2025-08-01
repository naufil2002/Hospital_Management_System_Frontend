import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
  });

  // ✅ Extract query params from URL
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page") || 0;
  const letter = queryParams.get("letter") || "";

  useEffect(() => {
    axios.get(`https://hospital-management-system-backend-0gg8.onrender.com/api/v1/patients/${id}`).then((res) => {
      setPatient(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://hospital-management-system-backend-0gg8.onrender.com/api/v1/patients/${id}`, patient).then(() => {
      // ✅ Navigate back to previous page & section
      navigate(`/patients?page=${page}&letter=${letter}`);
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Edit Patient
        </h2>

        <input
          type="text"
          name="name"
          value={patient.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />
        <input
          type="number"
          name="age"
          value={patient.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />

        <select
          name="gender"
          value={patient.gender}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
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

export default EditPatient;
