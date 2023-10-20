import {
  CheckOutlined,
  CloseOutlined,
  EditFilled,
  EyeOutlined,
  RightOutlined,
} from "@ant-design/icons"
import { Badge, Dropdown, Menu, message } from "antd"
import axios from "axios"
import React from "react"
import { useNavigate } from "react-router-dom"
import {
  capitalizeString,
  formatDate,
  formatNumber,
  prospectStatusColor,
} from "../../helpers"

const getStatusItems = (status) => {
  switch (status) {
    case "Draft":
      return [
        {
          label: "Detail",
          key: "detail",
          icon: <EyeOutlined />,
          children: [
            {
              label: "Open Directly",
              key: "detail",
              icon: <EyeOutlined />,
            },
            {
              label: "Open In New Tab",
              key: "detail_new_tab",
              icon: <EyeOutlined />,
            },
          ],
        },
        {
          label: "Ubah",
          key: "update",
          icon: <EditFilled />,
        },
      ]
    case "New":
      return [
        {
          label: "Detail",
          key: "detail",
          icon: <EyeOutlined />,
          children: [
            {
              label: "Open Directly",
              key: "detail",
              icon: <EyeOutlined />,
            },
            {
              label: "Open In New Tab",
              key: "detail_new_tab",
              icon: <EyeOutlined />,
            },
          ],
        },
        {
          label: "Ubah",
          key: "update",
          icon: <EditFilled />,
        },
        {
          label: "Cancel",
          key: "cancel",
          icon: <CloseOutlined />,
        },
      ]
    case "Open":
      return [
        {
          label: "Detail",
          key: "detail",
          icon: <EyeOutlined />,
          children: [
            {
              label: "Open Directly",
              key: "detail",
              icon: <EyeOutlined />,
            },
            {
              label: "Open In New Tab",
              key: "detail_new_tab",
              icon: <EyeOutlined />,
            },
          ],
        },
        // {
        //     label: "Ubah",
        //     key: "update",
        //     icon: <EditFilled />,
        // },
        // {
        //     label: "Approve",
        //     key: "approve",
        //     icon: <CheckOutlined />,
        // },
        // {
        //   label: "Cancel",
        //   key: "cancel",
        //   icon: <CloseOutlined />,
        // },
      ]

    case "Closed":
      return [
        {
          label: "Detail",
          key: "detail",
          icon: <EyeOutlined />,
          children: [
            {
              label: "Open Directly",
              key: "detail",
              icon: <EyeOutlined />,
            },
            {
              label: "Open In New Tab",
              key: "detail_new_tab",
              icon: <EyeOutlined />,
            },
          ],
        },
      ]
    default:
      return [
        {
          label: "Detail",
          key: "detail",
          icon: <EyeOutlined />,
          children: [
            {
              label: "Open Directly",
              key: "detail",
              icon: <EyeOutlined />,
            },
            {
              label: "Open In New Tab",
              key: "detail_new_tab",
              icon: <EyeOutlined />,
            },
          ],
        },
      ]
  }
}

const ActionMenu = ({ value, status = 1 }) => {
  const navigate = useNavigate()

  return (
    <Menu
      onClick={({ key }) => {
        switch (key) {
          case "detail":
            navigate(`/prospect/detail/${value}`)
            break
          case "detail_new_tab":
            window.open(`/prospect/detail/${value}`)
            break
          case "update":
            navigate(`/prospect/form/${value}`)
            break
          case "cancel":
            return axios.get(`/api/prospect/cancel/${value}`).then((res) => {
              message.success("Order Lead berhasil di cancel")
              window.location.reload()
            })
        }
      }}
      itemIcon={<RightOutlined />}
      items={getStatusItems(status)}
    />
  )
}

const prospectListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (value, row, index) => index + 1,
  },
  {
    title: "Prospect Number",
    dataIndex: "prospect_number",
    key: "prospect_number",
  },
  {
    title: "Contact",
    dataIndex: "contact_name",
    key: "contact_name",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => {
      return (
        <Badge
          count={text === "onprogress" ? "On Progress" : capitalizeString(text)}
          color={prospectStatusColor(text)}
        />
      )
    },
  },
  {
    title: "Activity",
    dataIndex: "activity_total",
    key: "activity_total",
  },
  {
    title: "Tag",
    dataIndex: "tag_name",
    key: "tag_name",
  },
  {
    title: "Created On",
    dataIndex: "created_at",
    key: "created_at",
    render: (text, record) => {
      console.log(record, "created_on")
      if (text) {
        return formatDate(text)
      }
      return "-"
    },
  },
  {
    title: "Action",
    key: "id",
    align: "center",
    fixed: "right",
    width: 100,
    render: (text) => (
      <Dropdown.Button
        style={{
          left: -16,
        }}
        // icon={<MoreOutlined />}
        overlay={<ActionMenu value={text.uuid} status={text.status} />}
      ></Dropdown.Button>
    ),
  },
]

const columns = [
  "Product",
  "Price",
  "Qty",
  "Discount",
  "Tax",
  "Total Price",
  "Final Price",
]
const productNeedListColumn = [
  {
    title: "Product",
    dataIndex: "product",
    key: "product",
  },
  {
    title: "QTY",
    dataIndex: "qty",
    key: "qty",
  },
  {
    title: "Normal Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Nego Price",
    dataIndex: "final_price",
    key: "final_price",
  },
]

const productNeedListColumnStep2 = columns.map((column) => {
  return {
    title: column,
    dataIndex: column.replace(/\s/g, "_").toLowerCase(),
    key: column.replace(/\s/g, "_").toLowerCase(),
  }
})

const billingColumns = [
  {
    title: "Name",
    dataIndex: "account_name",
    key: "account_name",
  },
  {
    title: "Bank",
    dataIndex: "account_bank",
    key: "account_bank",
  },
  {
    title: "Nominal",
    dataIndex: "total_transfer",
    key: "total_transfer",
    render: (text) => `Rp ${formatNumber(text)}`,
  },
  {
    title: "Tanggal Transfer",
    dataIndex: "transfer_date",
    key: "transfer_date",
    render: (text) => {
      if (text) {
        return formatDate(text)
      }
      return "-"
    },
  },
  {
    title: "Notes",
    dataIndex: "notes",
    key: "notes",
  },
  {
    title: "Attachment",
    dataIndex: "upload_billing_photo",
    key: "upload_billing_photo",
    render: (text) => {
      if (text) {
        return (
          <a href={text} target="_blank" rel="noreferrer">
            Lihat Bukti
          </a>
        )
      }
      return "-"
    },
  },
  {
    title: "Struct Transfer",
    dataIndex: "upload_transfer_photo",
    key: "upload_transfer_photo",
    render: (text) => {
      if (text) {
        return (
          <a href={text} target="_blank" rel="noreferrer">
            Lihat Bukti
          </a>
        )
      }
      return "-"
    },
  },
  {
    title: "Approved By",
    dataIndex: "approved_by_name",
    key: "approved_by_name",
  },
  {
    title: "Approved At",
    dataIndex: "approved_at",
    key: "approved_at",
  },
  {
    title: "Payment Number",
    dataIndex: "payment_number",
    key: "payment_number",
  },
]

const activityColumns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Start Date",
    dataIndex: "start_date",
    key: "start_date",
    render: (text) => {
      if (text) {
        return formatDate(text)
      }
      return "-"
    },
  },
  {
    title: "End Date",
    dataIndex: "end_date",
    key: "end_date",
    render: (text) => {
      if (text) {
        return formatDate(text)
      }
      return "-"
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Result",
    dataIndex: "result",
    key: "result",
  },
]

const negotiationsColumns = [
  {
    title: "Notes",
    dataIndex: "notes",
    key: "notes",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Date",
    dataIndex: "created_at",
    key: "created_at",
    render: (text) => {
      if (text) {
        return formatDate(text)
      }
      return "-"
    },
  },
]

const productListColumns = [
  {
    title: "Product",
    dataIndex: "product_id",
    key: "product_id",
    width: 300,
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },

  {
    title: "Qty",
    dataIndex: "qty",
    key: "qty",
  },
  {
    title: "Tax",
    dataIndex: "tax_id",
    key: "tax_id",
  },
  {
    title: "Discount",
    dataIndex: "discount_id",
    key: "discount_id",
  },
  {
    title: "Subtotal",
    dataIndex: "total_price",
    key: "total_price",
  },
  {
    title: "Total Price Nego",
    dataIndex: "price_nego",
    key: "price_nego",
  },
  // {
  //   title: "Total Price Nego",
  //   dataIndex: "total_price_nego",
  //   key: "total_price_nego",
  // },
  {
    title: " Total Dpp + PPN",
    dataIndex: "final_price",
    key: "final_price",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
]

export {
  prospectListColumn,
  productNeedListColumn,
  productNeedListColumnStep2,
  billingColumns,
  activityColumns,
  negotiationsColumns,
  productListColumns,
}
