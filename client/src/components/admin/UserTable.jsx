import React, { useEffect, useState } from "react";
import UserFormModal from "./UserFormModal";
import ConfirmDialog from "./ConfirmDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function UserTable({ onAction }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      if (!res.ok) throw new Error((await res.json()).msg || "Failed to fetch users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = () => { setEditUser(null); setShowModal(true); };
  const handleEdit = (user) => { setEditUser(user); setShowModal(true); };
  const handleDelete = (id) => { setDeleteUserId(id); setShowConfirm(true); };

  const handleModalClose = (changed) => {
    setShowModal(false);
    setEditUser(null);
    if (changed) { fetchUsers(); if(onAction) onAction(); }
  };
  const handleConfirmClose = async (confirmed) => {
    setShowConfirm(false);
    if (confirmed && deleteUserId) {
      const token = localStorage.getItem("token");
      await fetch(`/api/admin/users/${deleteUserId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      fetchUsers(); if(onAction) onAction();
    }
    setDeleteUserId(null);
  };

  return (
    <div className="bg-green-50 rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-green-700">User Management</h2>
      {error && <div className="mb-2 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow text-center">
          <thead className="bg-green-100">
            <tr>
              <th className="px-4 py-2 border-b text-center">First Name</th>
              <th className="px-4 py-2 border-b text-center">Last Name</th>
              <th className="px-4 py-2 border-b text-center">Email</th>
              <th className="px-4 py-2 border-b text-center">Admin</th>
              <th className="px-4 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td className="px-4 py-2 text-center" colSpan={5}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td className="px-4 py-2 border-b text-center">{user.first_name}</td>
                  <td className="px-4 py-2 border-b text-center">{user.last_name}</td>
                  <td className="px-4 py-2 border-b text-center">{user.email}</td>
                  <td className="px-4 py-2 border-b text-center">{user.isAdmin ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 border-b flex gap-2 justify-center">
                    <button className="text-green-600 hover:text-green-800 mr-2" onClick={() => handleEdit(user)}><EditIcon fontSize="small" /> Edit</button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(user._id)}><DeleteIcon fontSize="small" /> Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2" onClick={handleAdd}>
        <PersonAddIcon fontSize="small" /> Add User
      </button>
      {showModal && <UserFormModal open={showModal} onClose={handleModalClose} user={editUser} />}
      {showConfirm && (
        <ConfirmDialog open={showConfirm} onClose={handleConfirmClose} message="Are you sure you want to delete this user?" />
      )}
    </div>
  );
}
