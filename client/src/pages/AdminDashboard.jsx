import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "../components/DataTable";
import { userColumns } from "../components/columns/userColumns";
import { bookingColumns } from "../components/columns/bookingColumns";
import ServiceTable from "../components/admin/ServiceTable";
import UserTable from "../components/admin/UserTable";
import BookingTable from "../components/admin/BookingTable";

export default function AdminDashboard({ token }) {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("services");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [usersRes, bookingsRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/admin/bookings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const usersData = await usersRes.json();
        const bookingsData = await bookingsRes.json();
        if (!usersRes.ok) throw new Error(usersData.msg || "Failed to fetch users");
        if (!bookingsRes.ok) throw new Error(bookingsData.msg || "Failed to fetch bookings");
        setUsers(usersData);
        setBookings(bookingsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 mb-8">
        <Link to="/services-admin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Manage Services</Link>
      </div>
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold transition ${tab === "services" ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500"}`}
          onClick={() => setTab("services")}
        >
          Services
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold transition ${tab === "users" ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500"}`}
          onClick={() => setTab("users")}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold transition ${tab === "bookings" ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500"}`}
          onClick={() => setTab("bookings")}
        >
          Bookings
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div>
          {tab === "services" && (
            <ServiceTable token={token} />
          )}
          {tab === "users" && (
            <UserTable />
          )}
          {tab === "bookings" && (
            <BookingTable />
          )}
        </div>
      )}
    </div>
  );
}
