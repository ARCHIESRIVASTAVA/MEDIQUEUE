import { useEffect, useState } from "react";
import axiosClient from "./api/axiosClient";
import AddPatientForm from "./components/AddPatientForm";
import PatientList from "./components/PatientList";

function App() {
  const [patients, setPatients] = useState([]);

  // Search text
  const [searchTerm, setSearchTerm] = useState("");

  // Selected status filter
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all patients from backend
  const fetchPatients = () => {
    axiosClient
      .get("/patients")
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(
          "Error fetching patients:",
          error
        );
      });
  };

  // Fetch patients when application loads
  useEffect(() => {
    fetchPatients();
  }, []);

  // DASHBOARD STATISTICS

  const totalPatients = patients.length;

  const waitingPatients = patients.filter(
    (patient) =>
      patient.status === "waiting"
  ).length;

  const inProgressPatients = patients.filter(
    (patient) =>
      patient.status === "in_progress"
  ).length;

  const completedPatients = patients.filter(
    (patient) =>
      patient.status === "completed"
  ).length;

  // SEARCH AND FILTER LOGIC

  const filteredPatients = patients.filter(
    (patient) => {
      // Search patient using name
      const matchesSearch =
        patient.full_name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      // Filter patient using status
      const matchesStatus =
        statusFilter === "all" ||
        patient.status === statusFilter;

      // Patient must match both conditions
      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8 md:px-10">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-emerald-600">
          MediQueue 🚑
        </h1>

        <p className="mt-2 text-slate-600">
          Smart Patient Queue Management
          System
        </p>
      </div>

      {/* DASHBOARD STATISTICS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* TOTAL PATIENTS */}

        <div className="bg-white border-l-4 border-slate-500 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Patients
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {totalPatients}
          </h2>
        </div>

        {/* WAITING PATIENTS */}

        <div className="bg-white border-l-4 border-amber-500 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-amber-600">
            Waiting
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {waitingPatients}
          </h2>
        </div>

        {/* IN-PROGRESS PATIENTS */}

        <div className="bg-white border-l-4 border-blue-500 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-blue-600">
            In Progress
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {inProgressPatients}
          </h2>
        </div>

        {/* COMPLETED PATIENTS */}

        <div className="bg-white border-l-4 border-emerald-500 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-600">
            Completed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {completedPatients}
          </h2>
        </div>
      </div>

      {/* SEARCH AND FILTER SECTION */}

      <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Search & Filter Patients
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SEARCH INPUT */}

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Search Patient
            </label>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Enter patient name..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* STATUS FILTER */}

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Filter by Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">
                All Patients
              </option>

              <option value="waiting">
                Waiting
              </option>

              <option value="in_progress">
                In Progress
              </option>

              <option value="completed">
                Completed
              </option>
            </select>
          </div>
        </div>

        {/* FILTER RESULT COUNT */}

        <p className="mt-4 text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-emerald-600">
            {filteredPatients.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold">
            {patients.length}
          </span>{" "}
          patients
        </p>
      </div>

      {/* PATIENT FORM AND PATIENT QUEUE */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <AddPatientForm
          onPatientAdded={
            fetchPatients
          }
        />

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Patient Queue
          </h2>

          {filteredPatients.length >
          0 ? (
            <PatientList
              patients={
                filteredPatients
              }
              onPatientChanged={
                fetchPatients
              }
            />
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-700">
                No patients found
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Try another patient name
                or status filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
