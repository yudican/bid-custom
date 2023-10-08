const paymentMethodListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Nama Bank",
    dataIndex: "nama_bank",
    key: "nama_bank",
  },
  {
    title: "Type Pembayaran",
    dataIndex: "payment_type",
    key: "payment_type",
  },
  {
    title: "Nama Channel",
    dataIndex: "payment_channel",
    key: "payment_channel",
  },
  {
    title: "Logo Bank",
    dataIndex: "logo",
    key: "logo",
    render: (text, record, index) => (
      <img src={record.logo} alt="logo" width="100" height="100" />
    ),
  },
];

export { paymentMethodListColumn };
