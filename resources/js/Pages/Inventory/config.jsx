import { Tag, Tooltip } from "antd"

const inventoryStockColumns = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "PO Number",
    dataIndex: "reference_number",
    key: "reference_number",
    render: (text, record) => {
      const items = record?.selected_po?.items.filter(
        (item) => item.ref === record.uid_inventory
      )
      return (
        <Tooltip
          overlayStyle={{ maxWidth: 800 }}
          title={
            <div>
              {items.map((item, index) => {
                return (
                  <span>
                    <span>{`${item.product_name} - ${item.qty} ${item.uom}`}</span>
                    <br />
                  </span>
                )
              })}
            </div>
          }
        >
          <span>{text}</span>
        </Tooltip>
      )
    },
  },
  {
    title: "Vendor Code",
    dataIndex: "vendor",
    key: "vendor",
    render: (text, record) => {
      const items = record?.selected_po?.items.filter(
        (item) => item.is_master > 0
      )
      return (
        <Tooltip
          overlayStyle={{ maxWidth: 800 }}
          title={
            <div>
              {items.map((item, index) => {
                return (
                  <span>
                    <span>{`${item.received_number || ""} - ${
                      item.notes || ""
                    }`}</span>
                    <br />
                  </span>
                )
              })}
            </div>
          }
        >
          <span>{text}</span>
        </Tooltip>
      )
    },
  },
  {
    title: "Received By",
    dataIndex: "received_by_name",
    key: "received_by_name",
  },
  {
    title: "Received Date",
    dataIndex: "received_date",
    key: "received_date",
  },

  {
    title: "Status",
    dataIndex: "inventory_status",
    key: "inventory_status",
    render: (text) => {
      if (text === "received") {
        return <Tag color="yellow">Received</Tag>
      } else if (text === "alocated") {
        return <Tag color="green">Allocated</Tag>
      } else {
        return <Tag color="red">Canceled</Tag>
      }
    },
  },
  {
    title: "Received WH",
    dataIndex: "warehouse_name",
    key: "warehouse_name",
  },
  {
    title: "Company",
    dataIndex: "company_name",
    key: "company_name",
  },
]

const inventoryReturnStockColumns = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Product",
    dataIndex: "product_name",
    key: "product_name",
  },
  {
    title: "Warehouse",
    dataIndex: "warehouse_name",
    key: "warehouse_name",
  },
  {
    title: "Destination Warehouse",
    dataIndex: "warehouse_destination_name",
    key: "warehouse_destination_name",
  },
  {
    title: "Allocated By",
    dataIndex: "allocated_by_name",
    key: "allocated_by_name",
  },
  {
    title: "Created On",
    dataIndex: "created_on",
    key: "created_on",
  },
]
const inventoryReturnStatus = (status) => {
  {
    if (status === "0") {
      return <Tag color="yellow">Waiting Approval</Tag>
    } else if (status === "2") {
      return <Tag color="yellow">On Proccess</Tag>
    } else if (status === "3") {
      return <Tag color="blue">Received</Tag>
    } else if (status === "4") {
      return <Tag color="red">Rejected</Tag>
    } else {
      return <Tag color="green">Completed</Tag>
    }
  }
}
const inventoryReturnColumns = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "No Stock Return",
    dataIndex: "nomor_sr",
    key: "nomor_sr",
  },
  {
    title: "Vendor Code",
    dataIndex: "vendor",
    key: "vendor",
  },
  {
    title: "Created by",
    dataIndex: "created_by_name",
    key: "created_by_name",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => inventoryReturnStatus(text),
  },
  {
    title: "Received Date",
    dataIndex: "received_date",
    key: "received_date",
  },
  {
    title: "Received WH",
    dataIndex: "warehouse_name",
    key: "warehouse_name",
  },
  {
    title: "Company",
    dataIndex: "company_account_name",
    key: "company_account_name",
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
    title: "From WH",
    dataIndex: "from_warehouse_id",
    key: "from_warehouse_id",
  },
  {
    title: "To WH",
    dataIndex: "to_warehouse_id",
    key: "to_warehouse_id",
  },
  {
    title: "Sku",
    dataIndex: "sku",
    key: "sku",
  },
  {
    title: "UofM",
    dataIndex: "u_of_m",
    key: "u_of_m",
  },
  {
    title: "Qty Diterima",
    dataIndex: "qty",
    key: "qty",
  },
  {
    title: "Qty",
    dataIndex: "qty_alocation",
    key: "qty_alocation",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
]

const productListAllocationHistoryColumns = [
  {
    title: "Product",
    dataIndex: "product_id",
    key: "product_id",
    width: 300,
  },
  {
    title: "From WH",
    dataIndex: "from_warehouse_id",
    key: "from_warehouse_id",
  },
  {
    title: "To WH",
    dataIndex: "to_warehouse_id",
    key: "to_warehouse_id",
  },
  {
    title: "Sku",
    dataIndex: "sku",
    key: "sku",
  },
  {
    title: "UofM",
    dataIndex: "u_of_m",
    key: "u_of_m",
  },
  {
    title: "Qty Diterima",
    dataIndex: "qty",
    key: "qty",
  },
]

const productListReturnColumns = [
  // {
  //   title: "Case Return",
  //   dataIndex: "case_return",
  //   key: "case_return",
  //   width: 300,
  // },
  {
    title: "Product",
    dataIndex: "product_id",
    key: "product_id",
    width: 300,
  },
  {
    title: "Sku",
    dataIndex: "sku",
    key: "sku",
  },
  {
    title: "UofM",
    dataIndex: "u_of_m",
    key: "u_of_m",
  },
  {
    title: "Qty",
    dataIndex: "qty_alocation",
    key: "qty_alocation",
  },
  {
    title: "Notes",
    dataIndex: "notes",
    key: "notes",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
]

export {
  inventoryStockColumns,
  inventoryReturnColumns,
  productListColumns,
  productListAllocationHistoryColumns,
  inventoryReturnStockColumns,
  productListReturnColumns,
  inventoryReturnStatus,
}
