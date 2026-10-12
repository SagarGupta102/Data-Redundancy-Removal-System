
import { useState } from "react";
import { apiFetch } from "../api";

function AddRecord() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setMessage("");
    setMessageType("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email.trim())) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      setMessage("Enter a 10-digit phone number.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);
    setMessage("Submitting record...");
    setMessageType("info");

    try {
      const response = await apiFetch("/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          department: formData.department,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Unable to save the record.");
        setMessageType(
          result.status === "DUPLICATE" ? "warning" : "error"
        );
        return;
      }

      setMessage("Record saved successfully in MongoDB Atlas!");
      setMessageType("success");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        department: "",
      });
    } catch (error) {
      console.error("Record submission failed:", error);
      setMessage(
        "Cannot connect to the backend. Check that your server is running."
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearForm() {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      department: "",
    });
    setMessage("");
    setMessageType("");
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Add Record</p>
          <h1>Add New Record</h1>
          <p className="page-description">
            Submit a record for validation and duplicate checking.
          </p>
        </div>
      </header>

      <section className="content-panel record-form-panel">
        <div className="panel-heading">
          <div>
            <h2>Record Information</h2>
            <p>All fields are required.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="record-form">
          <div className="form-field">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              maxLength={254}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={10}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select department</option>
              <option value="IT">IT</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={clearForm}
              disabled={isSubmitting}
            >
              Clear Form
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Save Record"}
            </button>
          </div>

          {message && (
            <p
              className={`form-message ${messageType}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

export default AddRecord;