import { useState, useEffect } from "react";

export default function BookingForm({ token, booking, onSuccess, onCancel }) {
  const [customer_name, setCustomerName] = useState(booking?.customer_name || "");
  const [address, setAddress] = useState(booking?.address || "");
  const [date_time, setDateTime] = useState(booking ? booking.date_time.slice(0, 16) : "");
  const [service_id, setServiceId] = useState(booking?.service_id?._id || "");
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");

  // Always get token from prop or localStorage
  const authToken = token || localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((res) => res.json())
      .then(setServices)
      .catch(() => setServices([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!customer_name || !address || !date_time || !service_id) {
      setError("All fields are required.");
      return;
    }
    try {
      const method = booking ? "PUT" : "POST";
      const url = booking
        ? `http://localhost:5000/api/bookings/${booking._id}`
        : "http://localhost:5000/api/bookings";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ customer_name, address, date_time, service_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to save booking");
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        className="bg-white rounded shadow-lg p-8 w-full max-w-md relative"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">{booking ? "Edit" : "Add"} Booking</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1">Customer Name</label>
          <input
            className="border rounded w-full px-3 py-2"
            value={customer_name}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Address</label>
          <input
            className="border rounded w-full px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Date and Time</label>
          <input
            className="border rounded w-full px-3 py-2"
            type="datetime-local"
            value={date_time}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Service Type</label>
          <select
            className="border rounded w-full px-3 py-2"
            value={service_id}
            onChange={(e) => setServiceId(e.target.value)}
            required
          >
            <option value="">Select Service</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            type="submit"
          >
            {booking ? "Update" : "Add"}
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
