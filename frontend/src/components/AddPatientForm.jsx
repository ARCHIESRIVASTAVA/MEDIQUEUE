import { useState } from "react";
import axiosClient from "../api/axiosClient";

const initialFormState = {
  full_name: "",
  age: "",
  symptoms: "",
  severity: "",
};

function AddPatientForm({ onPatientAdded }) {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      age: Number(formData.age),
      severity: Number(formData.severity),
    };

    axiosClient
      .post("/patients", payload)
      .then(() => {
        setFormData(initialFormState);
        onPatientAdded();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-slate-700 mb-4">
        Add Patient
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
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
            value={formData.age}
            onChange={handleChange}
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
            value={formData.symptoms}
            onChange={handleChange}
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
            value={formData.severity}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-md px-3 py-2"
          >
            <option value="" disabled>
              Select severity
            </option>
            <option value={1}>1 - Low</option>
            <option value={2}>2 - Moderate</option>
            <option value={3}>3 - High</option>
            <option value={4}>4 - Very High</option>
            <option value={5}>5 - Emergency</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white font-medium py-2 rounded-md hover:bg-emerald-700 transition"
        >
          Add Patient
        </button>
      </form>
    </div>
  );
}

export default AddPatientForm;