import { useEffect, useState } from "react";
import axiosClient from "./api/axiosClient";
import AddPatientForm from "./components/AddPatientForm";
import PatientList from "./components/PatientList";

function App() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // FETCH ALL PATIENTS
  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await axiosClient.get("/patients");

      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  // LOAD PATIENTS WHEN APP STARTS
  useEffect(() => {
    fetchPatients();
  }, []);

  // DASHBOARD STATISTICS
  const totalPatients = patients.length;

  const waitingPatients = patients.filter(
    (patient) => patient.status === "waiting"
  ).length;

  const inProgressPatients = patients.filter(
    (patient) => patient.status === "in_progress"
  ).length;

  const completedPatients = patients.filter(
    (patient) => patient.status === "completed"
  ).length;

  // SEARCH AND FILTER
  const filteredPatients = patients.filter((patient) => {
    const patientName = patient.full_name || "";

    const matchesSearch = patientName
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // CLEAR SEARCH AND FILTER
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-2xl shadow-sm">
              🏥
            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Medi
                <span className="text-emerald-600">
                  Queue
                </span>
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Smart Patient Queue Management
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">

            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />

            <span className="text-sm font-semibold text-emerald-700">
              System Live
            </span>

          </div>

        </div>
      </header>

      {/* MAIN CONTENT */}

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">

        {/* PAGE HEADING */}

        <section className="mb-8">

          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-emerald-600">
            Hospital Dashboard
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Patient Queue Overview
          </h2>

          <p className="mt-3 max-w-2xl text-slate-500">
            Register patients, prioritize cases and track
            treatment progress from one smart dashboard.
          </p>

        </section>

        {/* STATISTICS */}

        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                👥
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                All
              </span>

            </div>

            <p className="text-sm font-medium text-slate-500">
              Total Patients
            </p>

            <h3 className="mt-1 text-3xl font-bold text-slate-900">
              {totalPatients}
            </h3>

          </div>

          {/* WAITING */}

          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl">
                ⏳
              </div>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                Queue
              </span>

            </div>

            <p className="text-sm font-medium text-slate-500">
              Waiting
            </p>

            <h3 className="mt-1 text-3xl font-bold text-slate-900">
              {waitingPatients}
            </h3>

          </div>

          {/* IN PROGRESS */}

          <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🩺
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                Active
              </span>

            </div>

            <p className="text-sm font-medium text-slate-500">
              In Progress
            </p>

            <h3 className="mt-1 text-3xl font-bold text-slate-900">
              {inProgressPatients}
            </h3>

          </div>

          {/* COMPLETED */}

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl font-bold text-emerald-600">
                ✓
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                Done
              </span>

            </div>

            <p className="text-sm font-medium text-slate-500">
              Completed
            </p>

            <h3 className="mt-1 text-3xl font-bold text-slate-900">
              {completedPatients}
            </h3>

          </div>

        </section>

        {/* SEARCH AND FILTER */}

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900">
            Find a Patient
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search using patient name or filter by status.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Search Patient
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search by patient name..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Patient Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
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

          <div className="mt-5 flex items-center justify-between border-t pt-4">

            <p className="text-sm text-slate-500">

              Showing{" "}

              <span className="font-bold text-emerald-600">
                {filteredPatients.length}
              </span>

              {" "}of{" "}

              <span className="font-semibold">
                {patients.length}
              </span>

              {" "}patients

            </p>

            {(searchTerm || statusFilter !== "all") && (

              <button
                onClick={clearFilters}
                className="font-semibold text-emerald-600"
              >
                Clear Filters
              </button>

            )}

          </div>

        </section>

        {/* PATIENT FORM AND QUEUE */}

        <section className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[0.85fr_1.15fr]">

          <div className="lg:sticky lg:top-28">

            <AddPatientForm
              onPatientAdded={fetchPatients}
            />

          </div>

          <div>

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold">
                  Patient Queue
                </h2>

                <p className="text-sm text-slate-500">
                  Patients are ordered by status and severity.
                </p>

              </div>

              <span className="rounded-full bg-emerald-100 px-4 py-2 font-bold text-emerald-700">

                {filteredPatients.length}

                {" "}

                {filteredPatients.length === 1
                  ? "Patient"
                  : "Patients"}

              </span>

            </div>

            {loading ? (

              <div className="rounded-2xl bg-white p-12 text-center">

                <p>
                  Loading patients...
                </p>

              </div>

            ) : filteredPatients.length > 0 ? (

              <PatientList
                patients={filteredPatients}
                onPatientChanged={fetchPatients}
              />

            ) : (

              <div className="rounded-2xl border bg-white p-12 text-center">

                <div className="text-5xl">
                  🔍
                </div>

                <h3 className="mt-4 text-lg font-bold">
                  No patients found
                </h3>

                <p className="mt-2 text-slate-500">
                  Try changing search or status.
                </p>

              </div>

            )}

          </div>

        </section>

      </main>

      {/* FOOTER */}

      <footer className="mt-14 border-t bg-white">

        <div className="mx-auto flex max-w-7xl justify-between px-5 py-7 text-sm text-slate-500">

          <p>
            © 2026 MediQueue
          </p>

          <p>
            Smart healthcare queue management system
          </p>

        </div>

      </footer>

    </div>
  );
}

export default App;
