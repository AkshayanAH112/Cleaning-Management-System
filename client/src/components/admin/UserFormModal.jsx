import React, { useState } from "react";

export default function UserFormModal({ user, onClose }) {
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    password: "",
    isAdmin: user?.isAdmin || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = user ? "PUT" : "POST";
      const url = user ? `/api/admin/users/${user._id}` : "/api/admin/users";
      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).msg || "Error");
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
        <h3 className="text-lg font-semibold mb-4">{user ? "Edit User" : "Add User"}</h3>
        {error && <div className="mb-2 text-red-600">{error}</div>}
        <div className="mb-3">
          <label className="block mb-1">First Name</label>
          <input name="first_name" value={form.first_name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Last Name</label>
          <input name="last_name" value={form.last_name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Password {user && <span className="text-xs">(leave blank to keep unchanged)</span>}</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder={user ? "Leave blank to keep" : ""} />
        </div>
        <div className="mb-3 flex items-center">
          <input id="isAdmin" name="isAdmin" type="checkbox" checked={form.isAdmin} onChange={handleChange} className="mr-2" />
          <label htmlFor="isAdmin">Admin</label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={() => onClose(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{loading ? "Saving..." : user ? "Save" : "Add"}</button>
        </div>
      </form>
    </div>
  );
}
