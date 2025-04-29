import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookingForm from "./BookingForm";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

export default function Dashboard({ token, isAdmin }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // Calculate paginated bookings
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(bookings.length / rowsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to fetch bookings");
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, [token]);

  const handleEdit = (booking) => {
    setEditBooking(booking);
    setShowForm(true);
  };
  const handleAdd = () => {
    setEditBooking(null);
    setShowForm(true);
  };
  const handleCancel = () => {
    setShowForm(false);
    setEditBooking(null);
  };
  const handleSuccess = () => {
    setShowForm(false);
    setEditBooking(null);
    fetchBookings();
  };
  const handleDelete = async (booking) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${booking._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to cancel booking");
      fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <AssignmentTurnedInIcon className="text-blue-500" />
        {isAdmin ? "All Bookings" : "My Bookings"}
      </h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 shadow-md"
        onClick={handleAdd}
      >
        <EventIcon /> Add Booking
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="min-w-full w-full rounded-lg">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-3 px-4 border-b text-blue-700 text-left font-semibold whitespace-nowrap"><span className="flex items-center gap-1"><PersonIcon fontSize="small" /> Customer</span></th>
                <th className="py-3 px-4 border-b text-blue-700 text-left font-semibold whitespace-nowrap"><span className="flex items-center gap-1"><LocationOnIcon fontSize="small" /> Address</span></th>
                <th className="py-3 px-4 border-b text-blue-700 text-left font-semibold whitespace-nowrap"><span className="flex items-center gap-1"><EventIcon fontSize="small" /> Date/Time</span></th>
                <th className="py-3 px-4 border-b text-blue-700 text-left font-semibold whitespace-nowrap">Service</th>
                <th className="py-3 px-4 border-b text-blue-700 text-left font-semibold whitespace-nowrap">Status</th>
                <th className="py-3 px-4 border-b text-blue-700 text-left font-semibold whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((b) => (
                <tr key={b._id} className="hover:bg-blue-50 transition">
                  <td className="border-b px-4 py-2 align-middle whitespace-nowrap"><span className="flex items-center gap-2"><PersonIcon className="text-blue-400" /> {b.customer_name}</span></td>
                  <td className="border-b px-4 py-2 align-middle whitespace-nowrap"><span className="flex items-center gap-2"><LocationOnIcon className="text-green-500" /> {b.address}</span></td>
                  <td className="border-b px-4 py-2 align-middle whitespace-nowrap"><span className="flex items-center gap-2"><EventIcon className="text-purple-500" /> {new Date(b.date_time).toLocaleString()}</span></td>
                  <td className="border-b px-4 py-2 align-middle whitespace-nowrap">{b.service_id?.name}</td>
                  <td className={`border-b px-4 py-2 align-middle whitespace-nowrap capitalize font-semibold ${b.status === 'pending' ? 'text-yellow-600' : b.status === 'completed' ? 'text-green-600' : 'text-gray-500'}`}>{b.status}</td>
                  <td className="border-b px-4 py-2 align-middle whitespace-nowrap">
                    {b.status === "pending" && (
                      <span className="flex items-center gap-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 p-1 rounded transition"
                          onClick={() => handleEdit(b)}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 p-1 rounded transition"
                          onClick={() => handleDelete(b)}
                          title="Cancel"
                        >
                          <DeleteIcon />
                        </button>
                      </span>
                    )}
                    {b.status !== "pending" && (
                      <span className="text-gray-400">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  className={`px-3 py-1 rounded font-semibold ${currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-200'}`}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      {showForm && (
        <BookingForm
          token={token}
          booking={editBooking}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
      <div className="flex gap-4 mt-8">
        <Link to="/services" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow">View Services</Link>
      </div>
    </div>
  );
}
