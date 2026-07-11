import { useState } from "react";
import axiosClient from "../api/axiosClient";

const initialFormState = {
  full_name: "",
  age: "",
  symptoms: "",
  severity: "",
};

const severityDetails = {
  1: {
    label: "Low",
    style: "bg-green-100 text-green-700",
  },

  2: {
    label: "Moderate",
    style: "bg-yellow-100 text-yellow-700",
  },

  3: {
    label: "High",
    style: "bg-orange-100 text-orange-700",
  },

  4: {
    label: "Very High",
    style: "bg-red-100 text-red-700",
  },

  5: {
    label: "Emergency",
    style: "bg-red-600 text-white",
  },
};

function AddPatientForm({
  onPatientAdded,
}) {
  const [formData, setFormData] =
    useState(initialFormState);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // HANDLE INPUT CHANGES

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((previousData) => ({
      ...previousData,

      [name]: value,
    }));

    // Remove old messages
    setMessage("");
    setError("");
  };

  // ADD NEW PATIENT

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setIsSubmitting(true);

    setMessage("");

    setError("");

    const payload = {
      ...formData,

      age: Number(
        formData.age
      ),

      severity: Number(
        formData.severity
      ),
    };

    try {
      await axiosClient.post(
        "/patients",
        payload
      );

      setFormData(
        initialFormState
      );

      setMessage(
        "Patient added successfully ✓"
      );

      await onPatientAdded();

      // Remove success message
      // after three seconds

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Error adding patient:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Patient could not be added. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSeverity =
    severityDetails[
      formData.severity
    ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* FORM HEADER */}

      <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-2xl">
            👤
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Add New Patient
            </h2>

            <p className="mt-1 text-sm text-emerald-50">
              Register a patient in
              the hospital queue
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-6"
      >
        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* FULL NAME */}

        <div>
          <label
            htmlFor="full_name"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Full Name
          </label>

          <input
            id="full_name"
            type="text"
            name="full_name"
            value={
              formData.full_name
            }
            onChange={
              handleChange
            }
            required
            placeholder="Enter patient name"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        {/* AGE */}

        <div>
          <label
            htmlFor="age"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Age
          </label>

          <input
            id="age"
            type="number"
            name="age"
            value={
              formData.age
            }
            onChange={
              handleChange
            }
            required
            min="1"
            max="120"
            placeholder="Enter patient age"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        {/* SYMPTOMS */}

        <div>
          <label
            htmlFor="symptoms"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Symptoms
          </label>

          <textarea
            id="symptoms"
            name="symptoms"
            value={
              formData.symptoms
            }
            onChange={
              handleChange
            }
            required
            rows={4}
            placeholder="Describe the patient's symptoms..."
            className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        {/* SEVERITY */}

        <div>
          <label
            htmlFor="severity"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Medical Severity
          </label>

          <select
            id="severity"
            name="severity"
            value={
              formData.severity
            }
            onChange={
              handleChange
            }
            required
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          >
            <option
              value=""
              disabled
            >
              Select severity level
            </option>

            <option value={1}>
              1 — Low
            </option>

            <option value={2}>
              2 — Moderate
            </option>

            <option value={3}>
              3 — High
            </option>

            <option value={4}>
              4 — Very High
            </option>

            <option value={5}>
              5 — Emergency
            </option>
          </select>

          {/* SELECTED SEVERITY */}

          {selectedSeverity && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-500">
                Selected priority
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${selectedSeverity.style}`}
              >
                Severity{" "}
                {
                  formData.severity
                }{" "}
                —{" "}
                {
                  selectedSeverity.label
                }
              </span>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}

        <button
          type="submit"
          disabled={
            isSubmitting
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-emerald-400"
        >
          {isSubmitting ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

              Adding Patient...
            </>
          ) : (
            <>
              <span className="text-xl">
                +
              </span>

              Add Patient to Queue
            </>
          )}
        </button>

        {/* INFORMATION */}

        <p className="text-center text-xs leading-5 text-slate-400">
          Patients are automatically
          prioritized according to their
          medical severity.
        </p>
      </form>
    </div>
  );
}

export default AddPatientForm;