import { formatDate, formatNumber } from "../../../helpers"

const transactionListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "TRX ID",
    dataIndex: "id_transaksi",
    key: "id_transaksi",
  },
  {
    title: "User",
    dataIndex: "user_name",
    key: "user_name",
  },
  {
    title: "Transaction Date",
    dataIndex: "created_at",
    key: "created_at",
    render: (text, record) => {
      if (text) {
        return formatDate(text)
      }
      return "-"
    },
  },
  {
    title: "Nominal",
    dataIndex: "nominal",
    key: "nominal",
    render: (value) => `Rp ${formatNumber(value)}`,
  },
]

const transactionProductListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Nama Product",
    dataIndex: "product_name",
    key: "product_name",
  },
  {
    title: "SKU",
    dataIndex: "sku",
    key: "sku",
  },

  {
    title: "Harga Satuan",
    dataIndex: "price",
    key: "price",
    render: (value) => `Rp ${formatNumber(value)}`,
  },
  {
    title: "UoM",
    dataIndex: "u_of_m",
    key: "u_of_m",
  },
  {
    title: "QTY",
    dataIndex: "qty",
    key: "qty",
  },
  {
    title: "Subtotal",
    dataIndex: "subtotal",
    key: "subtotal",
    render: (value) => `Rp ${formatNumber(value)}`,
  },
]

export { transactionListColumn, transactionProductListColumn }
