import {
    CheckOutlined,
    CloseOutlined,
    EditFilled,
    EyeOutlined,
    RightOutlined,
  } from "@ant-design/icons"
  import { Dropdown, Menu, Tag } from "antd"
  import moment from "moment"
  import React from "react"
  import { useNavigate } from "react-router-dom"
  import { formatDate } from "../../helpers"

const ticketListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Order No.",
    dataIndex: "order_id",
    key: "order_id",
  },
  {
    title: "Pembeli",
    dataIndex: "pembeli",
    key: "pembeli",
  },
  {
    title: "Seller Id",
    dataIndex: "seller_id",
    key: "seller_id",
  },
  {
    title: "Metode Pembayaran",
    dataIndex: "pay_method",
    key: "pay_method",
  },
  {
    title: "Whatsapp",
    dataIndex: "whatsapp",
    key: "whatsapp",
  },
  {
    title: "Kabupaten",
    dataIndex: "shipping_kabupaten",
    key: "shipping_kabupaten",
  },
  {
    title: "Provinsi",
    dataIndex: "shipping_provinsi",
    key: "shipping_provinsi",
  },
  {
    title: "Tracking Logistic",
    dataIndex: "tracking_logistic",
    key: "tracking_logistic",
  },
  {
    title: "Warehouse",
    dataIndex: "warehouse_name",
    key: "warehouse_name",
  },
  {
    title: "Follow Up",
    dataIndex: "status_fu",
    key: "status_fu",
    align: "center",
    render: (text) => {
      if (text == "1") {
        return <CheckOutlined style={{ color: "green" }} />
      }
      return <CloseOutlined style={{ color: "red" }} />
    },
  },
]

export { ticketListColumn }
