import { Tooltip } from "antd"
import { truncateString } from "../../../helpers"

const productListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Product",
    dataIndex: "product_image",
    key: "product_image",
    render: (text, record) => {
      return (
        <Tooltip overlayStyle={{ maxWidth: 800 }} title={record.name}>
          <div className="flex justify-start items-center">
            <img
              src={record.product_image}
              alt="product_image"
              width="30"
              height="30"
            />
            <p className="mb-0 ml-3">{truncateString(record.name, 50)}</p>
          </div>
        </Tooltip>
      )
    },
  },
  {
    title: "Brand",
    dataIndex: "brand_name",
    key: "brand_name",
  },
  {
    title: "Category",
    dataIndex: "category_name",
    key: "category_name",
  },
  {
    title: "SKU",
    dataIndex: "sku",
    key: "sku",
  },
  {
    title: "All Stock",
    dataIndex: "stock",
    key: "stock",
    render: (text, record) => {
      if (text > 0) {
        return (
          <Tooltip
            title={
              <div>
                {record.stock_warehouse.map((item, index) => {
                  return (
                    <span>
                      <span>{`${item.warehouse_name} - ${item.stock}`}</span>{" "}
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
      }

      return text
    },
  },
]

const productVariantListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Product",
    dataIndex: "product_image",
    key: "product_image",
    render: (text, record) => {
      return (
        <Tooltip overlayStyle={{ maxWidth: 800 }} title={record.name}>
          <div className="flex justify-start items-center">
            <img
              src={record.product_image}
              alt="product_image"
              width="30"
              height="30"
            />
            <p className="mb-0 ml-3">{truncateString(record.name, 50)}</p>
          </div>
        </Tooltip>
      )
    },
  },
  {
    title: "SKU",
    dataIndex: "sku",
    key: "sku",
  },
]

export { productListColumn, productVariantListColumn }
