import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBill = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    status: "",
    date: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/patients?page=0&size=1000").then((res) => {
      const data = res.data?.content || res.data;
      const options = Array.isArray(data)
        ? data.map((p) => ({
            value: p.id,
            label: `${p.name} (${p.gender}, Age ${p.age})`,
          }))
        : [];
      setPatients(options);
    });

    axios.get("http://localhost:8080/api/v1/doctors?page=0&size=1000").then((res) => {
      const data = res.data?.content || res.data;
      const options = Array.isArray(data)
        ? data.map((d) => ({
            value: d.id,
            label: `${d.name} (${d.speciality})`,
          }))
        : [];
      setDoctors(options);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedPatient || !selectedDoctor) {
    alert("Please select both patient and doctor.");
    return;
  }

  const billData = {
    patientName: selectedPatient.label.split(" (")[0],
    doctorName: selectedDoctor.label.split(" (")[0],
    amount: formData.amount,
    status: formData.status,
    date: formData.date,
  };

  try {
    await axios.post("http://localhost:8080/api/v1/bills", billData);
    alert("✅ Bill added successfully!");
    navigate("/bills");
  } catch (err) {
    console.error("Error adding bill", err);
    alert("❌ Failed to add bill!");
  }
};


  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Add Bill</h2>

      {successMessage && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-300 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Dropdown */}
        <div>
          <label className="block font-semibold mb-1">Patient</label>
          <Select
            options={patients}
            value={selectedPatient}
            onChange={setSelectedPatient}
            placeholder="Select Patient"
            isSearchable
          />
        </div>

        {/* Doctor Dropdown */}
        <div>
          <label className="block font-semibold mb-1">Doctor</label>
          <Select
            options={doctors}
            value={selectedDoctor}
            onChange={setSelectedDoctor}
            placeholder="Select Doctor"
            isSearchable
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block font-semibold mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-semibold mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="">Select Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Bill
        </button>
      </form>
    </div>
  );
};

export default AddBill;
