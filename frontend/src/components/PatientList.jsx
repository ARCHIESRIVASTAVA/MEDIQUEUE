import { useState } from "react";
import axiosClient from "../api/axiosClient";

// STATUS COLORS

const STATUS_STYLES = {
  waiting: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
};

// STATUS NAMES

const STATUS_LABELS = {
  waiting: "Waiting",
  in_progress: "In Progress",
  completed: "Completed",
};

// SEVERITY COLORS

const SEVERITY_STYLES = {
  1: "bg-green-100 text-green-700",
  2: "bg-yellow-100 text-yellow-700",
  3: "bg-orange-100 text-orange-700",
  4: "bg-red-100 text-red-700",
  5: "bg-red-600 text-white",
};

// SEVERITY NAMES

const SEVERITY_LABELS = {
  1: "Low",
  2: "Moderate",
  3: "High",
  4: "Very High",
  5: "Emergency",
};

// STATUS BADGE

function StatusBadge({ status }) {
  const style =
    STATUS_STYLES[status] ||
    "bg-slate-100 text-slate-700";

  const label =
    STATUS_LABELS[status] || status;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  );
}

// SEVERITY BADGE

function SeverityBadge({ severity }) {
  const style =
    SEVERITY_STYLES[severity] ||
    "bg-slate-100 text-slate-700";

  const label =
    SEVERITY_LABELS[severity] ||
    "Unknown";

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${style}`}
    >
      Severity {severity} — {label}
    </span>
  );
}

function PatientList({
  patients,
  onPatientChanged,
}) {
  const [editingId, setEditingId] =
    useState(null);

  const [editForm, setEditForm] =
    useState(null);

  // START EDITING

  const startEditing = (patient) => {
    setEditingId(patient.id);

    setEditForm({
      full_name: patient.full_name,
      age: patient.age,
      symptoms: patient.symptoms,
      severity: patient.severity,
    });
  };

  // CANCEL EDITING

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  // CHANGE EDIT FORM

  const handleEditChange = (event) => {
    const { name, value } =
      event.target;

    setEditForm(
      (previousForm) => ({
        ...previousForm,

        [name]: value,
      })
    );
  };

  // UPDATE PATIENT DETAILS

  const handleEditSubmit = (
    event,
    id
  ) => {
    event.preventDefault();

    const payload = {
      ...editForm,

      age: Number(
        editForm.age
      ),

      severity: Number(
        editForm.severity
      ),
    };

    axiosClient
      .put(
        `/patients/${id}`,
        payload
      )

      .then(() => {
        cancelEditing();

        onPatientChanged();
      })

      .catch((error) => {
        console.error(
          "Error updating patient:",
          error
        );

        alert(
          "Patient details could not be updated."
        );
      });
  };

  // UPDATE PATIENT STATUS

  const handleStatusChange = (
    id,
    newStatus
  ) => {
    axiosClient
      .patch(
        `/patients/${id}/status`,

        {
          status: newStatus,
        }
      )

      .then(() => {
        onPatientChanged();
      })

      .catch((error) => {
        console.error(
          "Error updating patient status:",
          error
        );

        alert(
          "Patient status could not be updated."
        );
      });
  };

  // DELETE PATIENT

  const handleDelete = (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this patient?"
      );

    if (!confirmed) return;

    axiosClient
      .delete(
        `/patients/${id}`
      )

      .then(() => {
        onPatientChanged();
      })

      .catch((error) => {
        console.error(
          "Error deleting patient:",
          error
        );

        alert(
          "Patient could not be deleted."
        );
      });
  };

  return (
    <div className="space-y-5">

      {patients.map(
        (patient, index) => (

          <div
            key={patient.id}

            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >

            {/* TOKEN AND QUEUE */}

            <div className="flex justify-between items-center bg-slate-50 px-5 py-3 border-b">

              <div>

                <p className="text-xs text-slate-500">
                  Token Number
                </p>

                <p className="font-bold text-emerald-600">

                  MQ-
                  {String(
                    patient.token_number
                  ).padStart(
                    3,
                    "0"
                  )}

                </p>

              </div>

              {patient.status ===
                "waiting" && (

                <div className="text-right">

                  <p className="text-xs text-slate-500">

                    Queue Position

                  </p>

                  <p className="font-bold text-slate-800">

                    #{index + 1}

                  </p>

                </div>

              )}

            </div>

            <div className="p-5">

              {editingId ===
              patient.id ? (

                <form

                  onSubmit={(
                    event
                  ) =>

                    handleEditSubmit(

                      event,

                      patient.id

                    )

                  }

                  className="space-y-3"

                >

                  {/* NAME */}

                  <input

                    type="text"

                    name="full_name"

                    value={
                      editForm.full_name
                    }

                    onChange={
                      handleEditChange
                    }

                    required

                    className="w-full border rounded-lg px-3 py-2"

                  />

                  {/* AGE */}

                  <input

                    type="number"

                    name="age"

                    value={
                      editForm.age
                    }

                    onChange={
                      handleEditChange
                    }

                    required

                    min="1"

                    className="w-full border rounded-lg px-3 py-2"

                  />

                  {/* SYMPTOMS */}

                  <textarea

                    name="symptoms"

                    value={
                      editForm.symptoms
                    }

                    onChange={
                      handleEditChange
                    }

                    required

                    className="w-full border rounded-lg px-3 py-2"

                  />

                  {/* SEVERITY */}

                  <select

                    name="severity"

                    value={
                      editForm.severity
                    }

                    onChange={
                      handleEditChange
                    }

                    className="w-full border rounded-lg px-3 py-2"

                  >

                    <option value="1">

                      1 — Low

                    </option>

                    <option value="2">

                      2 — Moderate

                    </option>

                    <option value="3">

                      3 — High

                    </option>

                    <option value="4">

                      4 — Very High

                    </option>

                    <option value="5">

                      5 — Emergency

                    </option>

                  </select>

                  {/* SAVE */}

                  <div className="flex gap-2">

                    <button

                      className="flex-1 bg-emerald-600 text-white py-2 rounded-lg"

                    >

                      Save

                    </button>

                    <button

                      type="button"

                      onClick={
                        cancelEditing
                      }

                      className="flex-1 bg-slate-200 py-2 rounded-lg"

                    >

                      Cancel

                    </button>

                  </div>

                </form>

              ) : (

                <>

                  {/* NAME */}

                  <div className="flex justify-between items-start">

                    <div>

                      <h2 className="text-lg font-bold text-slate-800">

                        {
                          patient.full_name
                        }

                      </h2>

                      <p className="text-sm text-slate-500">

                        Age:{" "}

                        {
                          patient.age
                        }

                      </p>

                    </div>

                    <StatusBadge

                      status={
                        patient.status
                      }

                    />

                  </div>

                  {/* SYMPTOMS */}

                  <div className="mt-4">

                    <p className="text-xs font-semibold text-slate-500">

                      SYMPTOMS

                    </p>

                    <p className="text-slate-700">

                      {
                        patient.symptoms
                      }

                    </p>

                  </div>

                  {/* SEVERITY */}

                  <div className="mt-4">

                    <SeverityBadge

                      severity={
                        patient.severity
                      }

                    />

                  </div>

                  {/* CALL PATIENT */}

                  {patient.status ===
                    "waiting" && (

                    <button

                      onClick={() =>

                        handleStatusChange(

                          patient.id,

                          "in_progress"

                        )

                      }

                      className="w-full mt-5 bg-blue-600 text-white py-2 rounded-lg"

                    >

                      Call Patient

                    </button>

                  )}

                  {/* COMPLETE */}

                  {patient.status ===
                    "in_progress" && (

                    <button

                      onClick={() =>

                        handleStatusChange(

                          patient.id,

                          "completed"

                        )

                      }

                      className="w-full mt-5 bg-emerald-600 text-white py-2 rounded-lg"

                    >

                      Mark Completed

                    </button>

                  )}

                  {/* COMPLETED */}

                  {patient.status ===
                    "completed" && (

                    <div className="mt-5 bg-emerald-100 text-emerald-700 text-center font-semibold py-2 rounded-lg">

                      Patient Completed ✓

                    </div>

                  )}

                  {/* EDIT DELETE */}

                  <div className="flex gap-2 mt-3">

                    <button

                      onClick={() =>

                        startEditing(
                          patient
                        )

                      }

                      className="flex-1 bg-slate-200 py-2 rounded-lg"

                    >

                      Edit

                    </button>

                    <button

                      onClick={() =>

                        handleDelete(

                          patient.id

                        )

                      }

                      className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg"

                    >

                      Delete

                    </button>

                  </div>

                </>

              )}

            </div>

          </div>

        )

      )}

    </div>
  );
}

export default PatientList;