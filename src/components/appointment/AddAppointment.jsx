import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddAppointment = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [patientInput, setPatientInput] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientRes, doctorRes] = await Promise.all([
          fetch("https://hospital-management-system-backend-0gg8.onrender.com/api/v1/patients?page=0&size=1000"),
          fetch("https://hospital-management-system-backend-0gg8.onrender.com/api/v1/doctors?page=0&size=1000"),
        ]);

        if (!patientRes.ok || !doctorRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const patientData = await patientRes.json();
        const doctorData = await doctorRes.json();

        const patientList = Array.isArray(patientData?.content)
          ? patientData.content.map((p) => ({
              value: p.id,
              label: `${p.name} (${p.gender}, Age ${p.age})`,
            }))
          : [];

        const doctorList = Array.isArray(doctorData?.content)
          ? doctorData.content.map((d) => ({
              value: d.id,
              label: `${d.name} (${d.speciality})`,
            }))
          : [];

        setPatients(patientList);
        setDoctors(doctorList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("❌ Failed to fetch patient or doctor data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatient || !selectedDoctor) {
      toast.warning("⚠️ Please select both a patient and doctor.");
      return;
    }

    const appointmentData = {
      date: date,
      doctor: { name: selectedDoctor.label.split(" (")[0] },
      patient: { name: selectedPatient.label.split(" (")[0] },
    };

    try {
      const res = await fetch("https://hospital-management-system-backend-0gg8.onrender.com/api/v1/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (res.ok) {
        toast.success("✅ Appointment added successfully!");
        navigate("/appointments");
      } else {
        const errMsg = await res.text();
        console.error("Server responded with:", errMsg);
        toast.error("❌ Error adding appointment.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("❌ Error submitting appointment.");
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.label.toLowerCase().includes(patientInput.toLowerCase())
  );

  const noMatchingPatient = patientInput && filteredPatients.length === 0;

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Loading data...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Select Patient:</label>
          <Select
            options={filteredPatients}
            value={selectedPatient}
            onChange={setSelectedPatient}
            onInputChange={(input) => setPatientInput(input)}
            placeholder="Choose a patient..."
            isSearchable
            noOptionsMessage={() => "No matching patient found. Please add one from the Patient section."}
          />
          {noMatchingPatient && (
            <button
              type="button"
              onClick={() => navigate("/add-patient")}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              ➕ Add New Patient: "{patientInput}"
            </button>
          )}
        </div>

        {/* Doctor Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Select Doctor:</label>
          <Select
            options={doctors}
            value={selectedDoctor}
            onChange={setSelectedDoctor}
            placeholder="Choose a doctor..."
            isSearchable
            noOptionsMessage={() => "No matching doctor found."}
          />
        </div>

        {/* Appointment Date */}
        <div>
          <label className="block mb-1 font-medium">Appointment Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded font-semibold"
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
};

export default AddAppointment;
