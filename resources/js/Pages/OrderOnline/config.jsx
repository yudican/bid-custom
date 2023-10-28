import {
  CloseOutlined,
  DeleteFilled,
  EditFilled,
  EyeOutlined,
  RightOutlined,
} from "@ant-design/icons"
import { Dropdown, Menu, Steps, Tag, Tooltip, message } from "antd"
import axios from "axios"
import moment from "moment"
import React from "react"
import { useNavigate } from "react-router-dom"
import { formatDate, formatNumber, inArray } from "../../helpers"

const getStatusItems = (status) => {
  switch (status) {
    case "New Order":
      return [
        {
          label: "Ubah",
          key: "update",
          icon: <EditFilled />,
        },
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
          label: "Cancel",
          key: "cancel",
          icon: <DeleteFilled />,
        },
      ]
    case "Packing":
      return [
        {
          label: "Ubah",
          key: "update",
          icon: <EditFilled />,
        },
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
          label: "Cancel",
          key: "cancel",
          icon: <DeleteFilled />,
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
  console.log(value, status)

  return (
    <Menu
      onClick={({ key }) => {
        switch (key) {
          case "detail":
            navigate(`/order/order-manual/detail/${value}`)
            break
          case "detail_new_tab":
            window.open(`/order/order-manual/detail/${value}`)
            break
          case "update":
            navigate(`/order/order-manual/form/${value}`)
            break
          case "cancel":
            return axios
              .get(`/api/order-manual/cancel/${value}`)
              .then((res) => {
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

const orderOnlineListColumn = [
  {
    title: "No.",
    dataIndex: "key",
    key: "key",
    // render: (value, row, index) => index + 1,
  },
  {
    title: "Order ID",
    dataIndex: "order_id",
    key: "order_id",
  },
  {
    title: "Contact",
    dataIndex: "contact",
    key: "contact",
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
    render: (text) => {
      if (text) {
        return formatDate(text)
      }
      return "-"
    },
  },
  {
    title: "Nominal",
    dataIndex: "amount_total",
    key: "amount_total",
    render: (text) => `Rp. ${formatNumber(text)}`,
  },
  {
    title: "Payment Method",
    dataIndex: "payment_method",
    key: "payment_method",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => {
      const statusSwitch = (text) => {
        switch (text) {
          case "New Order":
            return "#FF6600"
          case "Packing":
            return "#7B61FF"
          case "Delivery":
            return "#008BE1"
          case "Completed":
            return "#43936C"
          case "Cancelled":
            return "#CB3A31"
          default:
            return "black"
        }
      }

      return (
        <span style={{ color: statusSwitch(text) }} className="font-semibold">
          {text}
        </span>
      )
    },
  },
  {
    title: "Action",
    align: "center",
    fixed: "right",
    width: 100,
    render: (text, record) => {
      return (
        <Dropdown.Button
          style={{
            left: -16,
          }}
          overlay={<ActionMenu value={text.id} status={text.status} />}
        ></Dropdown.Button>
      )
    },
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
    title: "Qty",
    dataIndex: "qty",
    key: "qty",
  },
  {
    title: "Normal Price",
    dataIndex: "price",
    key: "price",
    render: (text) => formatNumber(text),
  },
  {
    title: "Nego Price",
    dataIndex: "final_price",
    key: "final_price",
    render: (text) => formatNumber(text),
  },
  {
    title: "Tax Amount",
    dataIndex: "tax_amount",
    key: "tax_amount",
    render: (text) => formatNumber(text),
  },
]

const trackingListColumn = [
  {
    title: "Time",
    dataIndex: "created_at",
    key: "created_at",
    render: (text) => moment(text).format("ddd, DD MMM YYYY - LT"),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text, record) => {
      let dummyTrack = [record, record, record]
      return (
        <Tooltip
          color="white"
          overlayStyle={{ maxWidth: 800 }}
          title={
            <div>
              <Steps progressDot direction="vertical" size="small" current={0}>
                {dummyTrack.reverse().map((row, index) => {
                  return (
                    <Steps.Step
                      style={{ color: "white" }}
                      key={index}
                      title={moment(row.created_at).format(
                        "ddd, DD MMM YYYY - LT"
                      )}
                      subTitle={row.description}
                    />
                  )
                })}
              </Steps>
            </div>
          }
        >
          <span>{text}</span>
        </Tooltip>
      )
    },
  },
]

const productNeedListColumnStep2 = columns.map((column) => {
  return {
    title: column,
    dataIndex: column.replace(/\s/g, "_").toLowerCase(),
    key: column.replace(/\s/g, "_").toLowerCase(),
    render: (text) => {
      if (inArray(column, ["Price", "Total Price", "Final Price"])) {
        return formatNumber(text)
      }
      return text
    },
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
    render: (text) => formatNumber(text),
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
    render: (text) => formatNumber(text),
  },
  {
    title: "Total Price Nego",
    dataIndex: "price_nego",
    key: "price_nego",
    render: (text) => formatNumber(text),
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
    render: (text) => formatNumber(text),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
]

const orderDeliveryColumns = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "SKU",
    dataIndex: "sku",
    key: "sku",
  },
  {
    title: "Product Name",
    dataIndex: "product",
    key: "product",
  },
  {
    title: "Qty",
    dataIndex: "qty_delivered",
    key: "qty_delivered",
  },
  {
    title: "No Resi",
    dataIndex: "resi",
    key: "resi",
    render: (text) => text || "-",
  },
  {
    title: "Ekspedisi",
    dataIndex: "courier",
    key: "courier",
    render: (text) => text || "-",
  },
  {
    title: "Nama Pengirim",
    dataIndex: "sender_name",
    key: "sender_name",
    render: (text) => text || "-",
  },
  {
    title: "Telepon Pengirim",
    dataIndex: "sender_phone",
    key: "sender_phone",
    render: (text) => text || "-",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Invoice Status",
    dataIndex: "status",
    key: "status",
    render: (text, record) => {
      if (record?.is_invoice == 1) {
        return <Tag color="green">Invoiced</Tag>
      }

      return <Tag color="red">Not Invoiced</Tag>
    },
  },
]

const ethixColumns = [
  {
    title: "No.",
    width: 100,
    fixed: "left",
    render: (text, record, index) => index + 1,
  },
  {
    title: "SO Number",
    dataIndex: "so_number",
    key: "1",
  },
  {
    title: "SKU",
    dataIndex: "sku",
    key: "2",
  },
  {
    title: "Resi",
    dataIndex: "awb_number",
    key: "3",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "4",
  },
  {
    title: "Created On",
    dataIndex: "created_at",
    render: (text) => {
      return formatDate(text)
    },
  },
]

export {
  activityColumns,
  billingColumns,
  ethixColumns,
  getStatusItems,
  negotiationsColumns,
  orderDeliveryColumns,
  orderOnlineListColumn,
  productListColumns,
  productNeedListColumn,
  productNeedListColumnStep2,
  trackingListColumn,
}
