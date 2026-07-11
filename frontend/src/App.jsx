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

  const fetchPatients = () => {
    setLoading(true);

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
      })
      .finally(() => {
        setLoading(false);
      });
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
      const patientName =
        patient.full_name || "";

      const matchesSearch = patientName
        .toLowerCase()
        .includes(
          searchTerm
            .trim()
            .toLowerCase()
        );

      const matchesStatus =
        statusFilter === "all" ||
        patient.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

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
          {/* LOGO */}

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

          {/* LIVE SYSTEM INDICATOR */}

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
            Register patients, prioritize
            cases and track treatment
            progress from one smart
            dashboard.
          </p>
        </section>

        {/* STATISTICS CARDS */}

        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* TOTAL PATIENTS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
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

          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
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

          <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
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

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
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

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Find a Patient
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search using a patient name
              or filter the queue by status.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* SEARCH INPUT */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                placeholder="Search by patient name..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* STATUS FILTER */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Patient Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
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

          {/* RESULT INFORMATION */}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-emerald-600">
                {filteredPatients.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {patients.length}
              </span>{" "}
              patients
            </p>

            {(searchTerm ||
              statusFilter !== "all") && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        </section>

        {/* ADD PATIENT AND QUEUE */}

        <section className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[0.85fr_1.15fr]">
          {/* ADD PATIENT FORM */}

          <div className="lg:sticky lg:top-28">
            <AddPatientForm
              onPatientAdded={
                fetchPatients
              }
            />
          </div>

          {/* PATIENT QUEUE */}

          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Patient Queue
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Patients are ordered by
                  status and medical severity.
                </p>
              </div>

              <span className="whitespace-nowrap rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                {filteredPatients.length}{" "}
                {filteredPatients.length === 1
                  ? "Patient"
                  : "Patients"}
              </span>
            </div>

            {/* LOADING */}

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

                <p className="font-semibold text-slate-700">
                  Loading patients...
                </p>
              </div>
            ) : filteredPatients.length >
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
              /* EMPTY RESULT */

              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <div className="mb-4 text-5xl">
                  🔍
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  No patients found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing the patient
                  name or selected status.
                </p>

                {(searchTerm ||
                  statusFilter !==
                    "all") && (
                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}

      <footer className="mt-14 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p>
            © 2026 MediQueue
          </p>

          <p>
            Smart healthcare queue
            management system
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
