import React, { useState } from "react";

export default function ServiceFormModal({ service, onClose, token }) {
  const [name, setName] = useState(service?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = service ? "PUT" : "POST";
      const url = service
        ? `/api/services/${service._id}`
        : "/api/services";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to save service");
      onClose(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 w-full max-w-md relative">
        <h3 className="text-lg font-semibold mb-4">{service ? "Edit Service" : "Add Service"}</h3>
        {error && <div className="mb-2 text-red-600">{error}</div>}
        <div className="mb-3">
          <label className="block mb-1">Service Name</label>
          <input name="name" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={() => onClose(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{loading ? "Saving..." : service ? "Save" : "Add"}</button>
        </div>
      </form>
    </div>
  );
}
