import React, { useEffect, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function BookingTable({ refresh }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [declineId, setDeclineId] = useState(null);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/bookings", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error((await res.json()).msg || "Failed to fetch bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
      setBookings([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [refresh]);

  const handleDecline = (id) => { setDeclineId(id); setShowConfirm(true); };
  const handleConfirmClose = async (confirmed) => {
    setShowConfirm(false);
    if (confirmed && declineId) {
      const token = localStorage.getItem("token");
      await fetch(`/api/bookings/${declineId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: "declined" })
      });
      fetchBookings();
    }
    setDeclineId(null);
  };

  return (
    <div className="bg-yellow-50 rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-yellow-700">Booking Management</h2>
      {error && <div className="mb-2 text-red-600">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full bg-white rounded shadow text-center">
          <thead className="bg-yellow-100">
            <tr>
              <th className="px-4 py-2 text-center">Customer</th>
              <th className="px-4 py-2 text-center">Service</th>
              <th className="px-4 py-2 text-center">Address</th>
              <th className="px-4 py-2 text-center">Date/Time</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="px-4 py-2">{booking.customer_name || booking.user_id?.first_name + ' ' + booking.user_id?.last_name}</td>
                <td className="px-4 py-2">{booking.service_id?.name}</td>
                <td className="px-4 py-2">{booking.address}</td>
                <td className="px-4 py-2">{new Date(booking.date_time).toLocaleString()}</td>
                <td className="px-4 py-2 capitalize">{booking.status}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded mr-2"
                    disabled={booking.status === "accepted"}
                    style={{ opacity: booking.status === "accepted" ? 0.5 : 1 }}
                    onClick={async () => {
                      if (booking.status === "accepted") return;
                      const token = localStorage.getItem("token");
                      await fetch(`/api/bookings/${booking._id}/status`, {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                          ...(token ? { Authorization: `Bearer ${token}` } : {})
                        },
                        body: JSON.stringify({ status: "accepted" })
                      });
                      fetchBookings();
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded"
                    disabled={booking.status === "declined"}
                    style={{ opacity: booking.status === "declined" ? 0.5 : 1 }}
                    onClick={() => handleDecline(booking._id)}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ConfirmDialog open={showConfirm} onClose={handleConfirmClose} text="Are you sure you want to decline this booking?" />
    </div>
  );
}
