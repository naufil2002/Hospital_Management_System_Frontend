import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddPatient from "./components/patient/AddPatient";
import PatientList from "./components/patient/PatientList";
import AddDoctor from "./components/doctor/AddDoctor";
import DoctorList from "./components/doctor/DoctorList";
import AddAppointment from "./components/appointment/AddAppointment";
import AppointmentList from "./components/appointment/AppointmentList";
import AddBill from "./components/bill/AddBill";
import BillList from "./components/bill/BillList";
import Admin from "./components/Admin";
import Logout from "./components/Logout"; // ✅ Added
import EditPatient from "./components/patient/EditPatient";
import EditDoctor from "./components/doctor/EditDoctor";
import EditBill from "./components/bill/EditBill";
import { ToastContainer } from 'react-toastify';

function HomePage({ openPatientModal, openDoctorModal, openAppointmentModal, openBillModal }) {
  return (
    <div className="flex flex-col items-center mt-10 space-y-6 px-4">
      <h2 className="text-xl font-semibold mb-2">Select a Module</h2>

      <button
        onClick={openPatientModal}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow w-full max-w-xs"
      >
        Patient Section
      </button>

      <button
        onClick={openDoctorModal}
        className="bg-green-600 text-white px-6 py-3 rounded-xl shadow w-full max-w-xs"
      >
        Doctor Section
      </button>

      <button
        onClick={openAppointmentModal}
        className="bg-yellow-600 text-white px-6 py-3 rounded-xl shadow w-full max-w-xs"
      >
        Appointment Section
      </button>

      <button
        onClick={openBillModal}
        className="bg-red-600 text-white px-6 py-3 rounded-xl shadow w-full max-w-xs"
      >
        Bill Section
      </button>
    </div>
  );
}

function App() {
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);

  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between">
  <h1 className="text-xl font-bold">🏥 Hospital Management System</h1>
  {isAdmin && (
    <Link to="/logout" className="text-white underline text-sm">
      Logout
    </Link>
  )}
</nav>


        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                openPatientModal={() => setShowPatientModal(true)}
                openDoctorModal={() => setShowDoctorModal(true)}
                openAppointmentModal={() => setShowAppointmentModal(true)}
                openBillModal={() => setShowBillModal(true)}
              />
            }
          />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/add-appointment" element={<AddAppointment />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/add-bill" element={<AddBill />} />
          <Route path="/edit-bill/:id" element={<EditBill />} />
          <Route path="/bills" element={<BillList />} />
          <Route path="/admin-login" element={<Admin setIsAdmin={setIsAdmin} />} />
          <Route path="/logout" element={<Logout setIsAdmin={setIsAdmin} />} />
          <Route path="/edit-patient/:id" element={<EditPatient />} />
          <Route path="/edit-doctor/:id" element={<EditDoctor />} />
        </Routes>
         <ToastContainer />

        {/* Patient Modal */}
        {showPatientModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4 w-full max-w-md">
              <h2 className="text-xl font-semibold">👤 Patient Module</h2>
              <p className="text-sm text-gray-600">Click below to manage patients.</p>
              <div className="flex flex-col md:flex-row gap-4">
                <Link
                  to="/add-patient"
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full text-center"
                  onClick={() => setShowPatientModal(false)}
                >
                  ➕ Add Patient
                </Link>
                <Link
                  to="/patients"
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full text-center"
                  onClick={() => setShowPatientModal(false)}
                >
                  📄 View Patients
                </Link>
              </div>
              <button
                className="mt-4 text-sm text-gray-500 hover:underline"
                onClick={() => setShowPatientModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Doctor Modal */}
        {showDoctorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4 w-full max-w-md">
              <h2 className="text-xl font-semibold">🩺 Doctor Module</h2>
              <p className="text-sm text-gray-600">Manage doctors below.</p>
              <div className="flex flex-col md:flex-row gap-4">
                <Link
                  to="/add-doctor"
                  className="bg-green-600 text-white px-4 py-2 rounded w-full text-center"
                  onClick={() => setShowDoctorModal(false)}
                >
                  ➕ Add Doctor
                </Link>
                <Link
                  to="/doctors"
                  className="bg-green-600 text-white px-4 py-2 rounded w-full text-center"
                  onClick={() => setShowDoctorModal(false)}
                >
                  📄 View Doctors
                </Link>
              </div>
              <button
                className="mt-4 text-sm text-gray-500 hover:underline"
                onClick={() => setShowDoctorModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Appointment Modal */}
        {showAppointmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4 w-full max-w-md">
              <h2 className="text-xl font-semibold">📅 Appointment Module</h2>
              <p className="text-sm text-gray-600">Manage appointments below.</p>
              <div className="flex flex-col md:flex-row gap-4">
                <Link
                  to="/add-appointment"
                  className="bg-yellow-600 text-white px-4 py-2 rounded w-full text-center"
                  onClick={() => setShowAppointmentModal(false)}
                >
                  ➕ Add Appointment
                </Link>
                <Link
                  to="/appointments"
                  className="bg-yellow-600 text-white px-4 py-2 rounded w-full text-center"
                  onClick={() => setShowAppointmentModal(false)}
                >
                  📄 View Appointments
                </Link>
              </div>
              <button
                className="mt-4 text-sm text-gray-500 hover:underline"
                onClick={() => setShowAppointmentModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Bill Modal */}
        {showBillModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4 w-full max-w-md">
              <h2 className="text-xl font-semibold">💳 Billing Module</h2>
              <p className="text-sm text-gray-600">
                {isAdmin ? "Manage billing below." : "View your billing records."}
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                {isAdmin && (
                  <Link
                    to="/add-bill"
                    className="bg-red-600 text-white px-4 py-2 rounded w-full text-center"
                    onClick={() => setShowBillModal(false)}
                  >
                    ➕ Add Bill
                  </Link>
                )}
                <Link
                  to="/bills"
                  className="bg-red-600 text-white px-4 py-2 rounded w-full text-center"
                  onClick={() => setShowBillModal(false)}
                >
                  📄 View Bills
                </Link>
              </div>
              <button
                className="mt-4 text-sm text-gray-500 hover:underline"
                onClick={() => setShowBillModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
