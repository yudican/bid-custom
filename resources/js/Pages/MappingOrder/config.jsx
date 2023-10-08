import {
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

const getStatusItems = (status) => {
  switch (status) {
    case "New":
      return [
        {
          label: "Detail",
          key: "detail",
          icon: <EyeOutlined />,
        },
        {
          label: "Ubah",
          key: "update",
          icon: <EditFilled />,
        },
      ]
    case "Open":
      return [
        {
          label: "Detail",
          key: "detail",
          icon: <EyeOutlined />,
        },
        {
          label: "Ubah",
          key: "update",
          icon: <EditFilled />,
        },
        // {
        //     label: "Approve",
        //     key: "approve",
        //     icon: <CheckOutlined />,
        // },
        {
          label: "Cancel",
          key: "cancel",
          icon: <CloseOutlined />,
        },
      ]

    case "Closed":
      return [
        {
          label: "Detail",
          key: "detail",
          icon: <EyeOutlined />,
        },
      ]
    default:
      return [
        {
          label: "Detail",
          key: "detail",
          icon: <EyeOutlined />,
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
            navigate(`/mapping/order/detail/${value}`)
            break
          case "update":
            navigate(`/lead-master/form/${value}`)
            break
        }
      }}
      itemIcon={<RightOutlined />}
      items={getStatusItems(status)}
    />
  )
}

const mappingProductListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Order Id",
    dataIndex: "order_id",
    key: "order_id",
  },
  {
    title: "Payment Method",
    dataIndex: "payment_method",
    key: "payment_method",
  },
  {
    title: "Shipping Provider",
    dataIndex: "shipping_provider",
    key: "shipping_provider",
  },
  {
    title: "Tracking Number",
    dataIndex: "tracking_number",
    key: "tracking_number",
  },
  {
    title: "Customer Name",
    dataIndex: "buyer_name",
    key: "buyer_name",
  },
  {
    title: "Total Amount",
    dataIndex: "total_amount",
    key: "total_amount",
  },
  {
    title: "Transaction Date",
    dataIndex: "create_time",
    key: "create_time",
  },
  {
    title: "Order Status",
    dataIndex: "order_status",
    key: "order_status",
  },
  {
    title: "Warehouse Tiktok Id",
    dataIndex: "warehouse_tiktok_id",
    key: "warehouse_tiktok_id",
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
        overlay={<ActionMenu value={text.id} status={text.status} />}
      ></Dropdown.Button>
    ),
  },
]

const productListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Nama Produk",
    dataIndex: "product_name",
    key: "product_name",
  },
  {
    title: "QTY",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "SKU Penjual",
    dataIndex: "seller_sku",
    key: "seller_sku",
  },
  {
    title: "Harga Produk",
    dataIndex: "sku_original_price",
    key: "sku_original_price",
  },
]

export { mappingProductListColumn, productListColumn }
