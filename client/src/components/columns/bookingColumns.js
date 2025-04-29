export const bookingColumns = [
  {
    accessorKey: "customer_name",
    header: "Customer Name",
  },
  {
    accessorKey: "service_id.name",
    header: "Service Type",
    cell: ({ row }) => row.original.service_id?.name || "",
  },
  {
    accessorKey: "date_time",
    header: "Date",
    cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => getValue()?.charAt(0).toUpperCase() + getValue()?.slice(1),
  },
  // Actions column for admin, to be conditionally included
];
