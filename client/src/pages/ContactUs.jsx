import React, { useState } from "react";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would typically send the form data to your backend or an email service
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Contact Us</h1>
      {submitted ? (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">Thank you for reaching out! We'll get back to you soon.</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6">
          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="name">Name</label>
            <input className="w-full border rounded px-3 py-2" type="text" id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
            <input className="w-full border rounded px-3 py-2" type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="message">Message</label>
            <textarea className="w-full border rounded px-3 py-2" id="message" name="message" rows="4" value={form.message} onChange={handleChange} required />
          </div>
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Send Message</button>
        </form>
      )}
    </div>
  );
}
