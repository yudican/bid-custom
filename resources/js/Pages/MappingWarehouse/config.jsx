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
          }
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
              navigate(`/mapping/warehouse/detail/${value}`)
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
    title: "Warehouse Id",
    dataIndex: "warehouse_id",
    key: "warehouse_id",
  },
  {
    title: "Warehouse Name",
    dataIndex: "warehouse_name",
    key: "warehouse_name",
  },
  {
    title: "Warehouse City",
    dataIndex: "warehouse_city",
    key: "warehouse_city",
  },
  {
    title: "Warehouse Contact",
    dataIndex: "warehouse_contact",
    key: "warehouse_contact",
  },
  {
    title: "Warehouse Phone",
    dataIndex: "warehouse_phone",
    key: "warehouse_phone",
  },
  {
    title: "Is Default?",
    dataIndex: "is_default",
    key: "is_default",
    render: (text) => {
        return (text==1)?'Yes':'No';
    },
  },
  {
    title: "Status Mapping",
    dataIndex: "status_mapping",
    key: "status_mapping",
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

export { mappingProductListColumn }
