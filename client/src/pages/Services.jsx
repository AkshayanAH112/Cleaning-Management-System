import React, { useEffect, useState } from "react";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Failed to fetch services");
        setServices(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
        setServices([]);
      }
      setLoading(false);
    }
    fetchServices();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Our Services</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(service => (
            <div key={service._id} className="bg-white rounded shadow p-4 border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-600 mb-2">{service.name}</h2>
              <p className="mb-2 text-gray-700">{service.description}</p>
              <div className="text-lg font-bold text-blue-800">{service.price}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
