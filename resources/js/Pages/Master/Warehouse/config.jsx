const warehouseListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Nama",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Lokasi",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Alamat",
    dataIndex: "alamat",
    key: "alamat",
  },
];

export { warehouseListColumn };
