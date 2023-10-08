import React from "react"
import {
  DownOutlined,
  EditFilled,
  EyeOutlined,
  RightOutlined,
} from "@ant-design/icons"
import { Dropdown, Menu } from "antd"
import { useNavigate } from "react-router-dom"
import { formatNumber } from "../../helpers"

const ActionMenu = ({ value, role }) => {
  const navigate = useNavigate()
  return (
    <Menu
      onClick={({ key }) => {
        switch (key) {
          case "detail":
            navigate(`/contact/detail/${value}`)
            break
          case "update":
            navigate(`/contact/update/${value}`)
            break
        }
      }}
      itemIcon={<RightOutlined />}
      items={[
        {
          label: "Detail Contact",
          key: "detail",
          icon: <EyeOutlined />,
        },
        {
          label: "Ubah Contact",
          key: "update",
          icon: <EditFilled />,
        },
      ]}
    />
  )
}

const contactListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "No. Hp",
    dataIndex: "telepon",
    key: "telepon",
    render: (text) => {
      if (!text) {
        return '-'
      } else {
        var onlyno = text.substring(12, 2)
        return '+62'+onlyno
      }
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Created By",
    dataIndex: "created_by",
    key: "created_by",
  },
  {
    title: "Created On",
    dataIndex: "created_on",
    key: "created_on",
  },
  {
    title: "Deposito (Rp)",
    dataIndex: "deposit",
    key: "deposit",
  },
  {
    title: "Komisi (Rp)",
    dataIndex: "total_debt",
    key: "total_debt",
  },
  {
    title: "Action",
    key: "id",
    fixed: "right",
    align: "center",
    width: 100,
    render: (text) => (
      <Dropdown.Button
        style={{ left: -16 }}
        // icon={<DownOutlined />}
        overlay={<ActionMenu value={text.key} role="list" />}
      ></Dropdown.Button>
    ),
  },
]

const contactAddressListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Name",
    dataIndex: "nama",
    key: "nama",
  },
  {
    title: "Telepon",
    dataIndex: "telepon",
    key: "telepon",
  },
  {
    title: "Alamat",
    dataIndex: "alamat_detail",
    key: "alamat_detail",
    width: 500,
  },
]

const contactTransaction = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "TRX ID",
    dataIndex: "id_transaksi",
    key: "id_transaksi",
  },
  {
    title: "Tanggal Transaksi",
    dataIndex: "tanggal_transaksi",
    key: "tanggal_transaksi",
  },
  {
    title: "Nominal",
    dataIndex: "nominal",
    key: "nominal",
  },
  {
    title: "Metode Pembayaran",
    dataIndex: "payment_method",
    key: "payment_method",
  },
]

const contactCaseHistory = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Case No",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Contact",
    dataIndex: "contact",
    key: "contact",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
  },
  {
    title: "Created By",
    dataIndex: "created_by",
    key: "created_by",
  },
  {
    title: "Created On",
    dataIndex: "created_at",
    key: "created_at",
  },
]

const memberLayerList = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Telepon",
    dataIndex: "phone",
    key: "phone",
  },
]

const orderLeadListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (value, row, index) => index + 1,
  },
  {
    title: "Invoice Number",
    dataIndex: "invoice_number",
    key: "invoice_number",
  },
  {
    title: "Order Number",
    dataIndex: "order_number",
    key: "order_number",
  },
  {
    title: "Subtotal",
    dataIndex: "subtotal",
    key: "subtotal",
    render: (value) => `Rp ${formatNumber(value)}`,
  },
  {
    title: "Kode Unik",
    dataIndex: "kode_unik",
    key: "kode_unik",
  },
  {
    title: "Tax Total",
    dataIndex: "tax_amount",
    key: "tax_amount",
    render: (value) => `Rp ${formatNumber(value)}`,
  },
  {
    title: "Diskon",
    dataIndex: "discount_amount",
    key: "discount_amount",
    render: (value) => `Rp ${formatNumber(value)}`,
  },
  {
    title: "Total",
    dataIndex: "amount_total",
    key: "amount_total",
  },
  {
    title: "Created By",
    dataIndex: "created_by",
    key: "created_by",
  },
  {
    title: "Created On",
    dataIndex: "created_on",
    key: "created_on",
  },
  {
    title: "Payment Term",
    dataIndex: "payment_term",
    key: "payment_term",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
]

export {
  contactListColumn,
  contactAddressListColumn,
  contactTransaction,
  contactCaseHistory,
  memberLayerList,
  orderLeadListColumn,
}
