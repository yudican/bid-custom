import { Tag, Tooltip } from "antd"
import { truncateString } from "../../../helpers"

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
    title: "Package",
    dataIndex: "package_name",
    key: "package_name",
  },
  {
    title: "Sales Channel",
    dataIndex: "sales_channel",
    key: "sales_channel",
    render: (text, record, index) => {
      if (text) {
        return record.sales_channels.map((item) => (
          <Tag key={item} color="green">
            {item.replace("-", " ")}
          </Tag>
        ))
      }

      return "-"
    },
  },
  {
    title: "Variant",
    dataIndex: "variant_name",
    key: "variant_name",
  },
  {
    title: "Stock",
    dataIndex: "final_stock",
    key: "final_stock",
  },
  {
    title: "Stock Off Market",
    dataIndex: "stock_off_market",
    key: "stock_off_market",
  },
  {
    title: "Final Price (B2B)",
    dataIndex: "final_price",
    key: "final_price",
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
    title: "Product",
    dataIndex: "product_image",
    key: "product_image",
    render: (text, record, index) => (
      <div className="flex justify-start items-center">
        <img
          src={record.product_image}
          alt="product_image"
          width="30"
          height="30"
        />
        <p className="mb-0 ml-3">{truncateString(record.name, 50)}</p>
      </div>
    ),
  },
]

export { productVariantListColumn, productListColumn }
