import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [doctor, setDoctor] = useState({
    name: "",
    speciality: "",
  });

  // ✅ Get query params to stay on same page after update
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page") || 0;
  const letter = queryParams.get("letter") || "";

  useEffect(() => {
    axios.get(`http://localhost:8080/api/v1/doctors/${id}`).then((res) => {
      setDoctor(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/api/v1/doctors/${id}`, doctor).then(() => {
      // ✅ Return to same page and letter filter
      navigate(`/doctors?page=${page}&letter=${letter}`);
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Edit Doctor
        </h2>

        <input
          type="text"
          name="name"
          value={doctor.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />

        <input
          type="text"
          name="speciality"
          value={doctor.speciality}
          onChange={handleChange}
          placeholder="Speciality"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />

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

export default EditDoctor;
