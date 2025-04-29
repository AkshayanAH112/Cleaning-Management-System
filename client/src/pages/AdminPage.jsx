import React, { useState } from "react";
import UserTable from "../components/admin/UserTable";
import BookingTable from "../components/admin/BookingTable";
import ServiceTable from "../components/admin/ServiceTable";

export default function AdminPage() {
  const [refresh, setRefresh] = useState(false);
  const token = localStorage.getItem("token");
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <ServiceTable token={token} />
      <div className="mb-12">
        <UserTable onAction={() => setRefresh(r => !r)} />
      </div>
      <BookingTable refresh={refresh} />
    </div>
  );
}
