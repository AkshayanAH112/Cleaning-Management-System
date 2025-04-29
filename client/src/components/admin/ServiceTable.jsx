import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ServiceFormModal from "./ServiceFormModal";

export default function ServiceTable({ token }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/services", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to fetch services");
      setServices(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
      setServices([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line
  }, [token]);

  const handleModalClose = (changed) => {
    setShowModal(false);
    setEditService(null);
    if (changed) fetchServices();
  };

  const handleEdit = (service) => {
    setEditService(service);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to delete service");
      fetchServices();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-blue-50 rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Service Management</h2>
      {error && <div className="mb-2 text-red-600">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full bg-white rounded shadow text-center">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td className="px-4 py-2 text-center" colSpan={2}>
                  No services found.
                </td>
              </tr>
            ) : (
              services.map(service => (
                <tr key={service._id}>
                  <td className="px-4 py-2">{service.name}</td>
                  <td className="px-4 py-2">
                    <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={() => handleEdit(service)}><EditIcon fontSize="small" /> Edit</button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(service._id)}><DeleteIcon fontSize="small" /> Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2" onClick={() => { setEditService(null); setShowModal(true); }}>
        <AddIcon fontSize="small" /> Add Service
      </button>
      {showModal && (
        <ServiceFormModal
          service={editService}
          onClose={handleModalClose}
          token={token}
        />
      )}
    </div>
  );
}
