const summaryTransactionColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Tanggal & Waktu",
    dataIndex: "tanggal_transaksi",
    key: "tanggal_transaksi",
  },
  {
    title: "Transaksi ID",
    dataIndex: "id_transaksi",
    key: "id_transaksi",
  },
  {
    title: "Nama Pelanggan",
    dataIndex: "nama",
    key: "nama",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Jumlah (Rp)",
    dataIndex: "jumlah",
    key: "jumlah",
    align: "center",
  },
  {
    title: "Status",
    dataIndex: "status_name",
    key: "status_name",
  },
]

const productAndStockColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },

  {
    title: "Nama Produk",
    dataIndex: "produk_nama",
    key: "produk_nama",
  },
  {
    title: "SKU",
    dataIndex: "sku",
    key: "sku",
  },
  {
    title: "UoM",
    dataIndex: "uom",
    key: "uom",
  },
  {
    title: "Stok Terjual (Qty)",
    dataIndex: "stock_terjual",
    key: "stock_terjual",
  },
  {
    title: "Sisa Stok (Qty)",
    dataIndex: "sisa_stock",
    key: "sisa_stock",
  },
]

export { summaryTransactionColumn, productAndStockColumn }
