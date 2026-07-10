import { useState } from "react";
import axiosClient from "../api/axiosClient";

const STATUS_STYLES = {
  waiting: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
};

const STATUS_LABELS = {
  waiting: "Waiting",
  in_progress: "In Progress",
  completed: "Completed",
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-slate-100 text-slate-700";
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  );
}

function PatientList({ patients, onPatientChanged }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const startEditing = (patient) => {
    setEditingId(patient.id);
    setEditForm({
      full_name: patient.full_name,
      age: patient.age,
      symptoms: patient.symptoms,
      severity: patient.severity,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (event, id) => {
    event.preventDefault();

    const payload = {
      ...editForm,
      age: Number(editForm.age),
      severity: Number(editForm.severity),
    };

    axiosClient
      .put(`/patients/${id}`, payload)
      .then(() => {
        cancelEditing();
        onPatientChanged();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );
    if (!confirmed) return;

    axiosClient
      .delete(`/patients/${id}`)
      .then(() => {
        onPatientChanged();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div key={patient.id} className="bg-white p-4 rounded-lg shadow">
          {editingId === patient.id ? (
            <form
              onSubmit={(event) => handleEditSubmit(event, patient.id)}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={editForm.full_name}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={editForm.age}
                  onChange={handleEditChange}
                  required
                  min="0"
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Symptoms
                </label>
                <textarea
                  name="symptoms"
                  value={editForm.symptoms}
                  onChange={handleEditChange}
                  required
                  rows={3}
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Severity
                </label>
                <select
                  name="severity"
                  value={editForm.severity}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                >
                  <option value={1}>1 - Low</option>
                  <option value={2}>2 - Moderate</option>
                  <option value={3}>3 - High</option>
                  <option value={4}>4 - Very High</option>
                  <option value={5}>5 - Emergency</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white font-medium py-2 rounded-md hover:bg-emerald-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="flex-1 bg-slate-200 text-slate-700 font-medium py-2 rounded-md hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-slate-800">
                  {patient.full_name}
                </h2>
                <StatusBadge status={patient.status} />
              </div>
              <p>Age: {patient.age}</p>
              <p>Symptoms: {patient.symptoms}</p>
              <p>Severity: {patient.severity}</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => startEditing(patient)}
                  className="flex-1 bg-slate-200 text-slate-700 font-medium py-2 rounded-md hover:bg-slate-300 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(patient.id)}
                  className="flex-1 bg-red-100 text-red-700 font-medium py-2 rounded-md hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default PatientList;