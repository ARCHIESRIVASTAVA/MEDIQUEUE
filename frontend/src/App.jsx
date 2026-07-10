import { useEffect, useState } from "react";
import axiosClient from "./api/axiosClient";
import AddPatientForm from "./components/AddPatientForm";
import PatientList from "./components/PatientList";

function App() {
  const [patients, setPatients] = useState([]);

  const fetchPatients = () => {
    axiosClient
      .get("/patients")
      .then((response) => {
        console.log(response.data);
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-4xl font-bold text-emerald-600 mb-8">
        MediQueue 🚑
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddPatientForm onPatientAdded={fetchPatients} />
        <PatientList patients={patients} onPatientChanged={fetchPatients} />
      </div>
    </div>
  );
}

export default App;
