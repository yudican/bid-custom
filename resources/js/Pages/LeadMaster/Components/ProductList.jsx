import {
  CloseOutlined,
  LockOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { Input, Modal, Select, Table, Tag, Tooltip } from "antd"
import React, { useState } from "react"
import { getItem, inArray } from "../../../helpers"
import { productListColumns } from "../config"

const ProductList = ({
  products = [],
  handleChange,
  handleClick,
  onChange,
  data = [],
  taxs = [],
  discounts = [],
  loading = false,
  disabled = false,
}) => {
  const mergedColumns = productListColumns.map((col) => {
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        products,
        taxs,
        discounts,
        disabled,
        handleChange: (val) => handleChange(val),
        handleClick: (val) => handleClick(val),
        onChange: (val) => onChange(val),
      }),
    }
  })
  return (
    <div>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        dataSource={data}
        columns={mergedColumns}
        loading={loading}
        pagination={false}
        rowKey="id"
        scroll={{ x: "max-content" }}
        tableLayout={"auto"}
      />
    </div>
  )
}

const EditableCell = (props) => {
  const {
    dataIndex,
    handleChange,
    handleClick,
    onChange,
    record,
    products,
    taxs,
    discounts,
    disabled,
  } = props

  if (record) {
    if (dataIndex === "product_id") {
      return (
        <td>
          <ModalProductList
            style={{ marginBottom: 17 }}
            products={products}
            handleChange={(e) =>
              handleChange({
                value: e,
                dataIndex,
                key: record.id,
                uid_lead: record.uid_lead,
              })
            }
            disabled={disabled}
            value={record?.product_id}
          />
        </td>
      )
    }

    if (dataIndex === "tax_id") {
      return (
        <td>
          <Select
            style={{ marginBottom: 17 }}
            disabled={disabled}
            placeholder="Select Tax"
            value={record.tax_id}
            onChange={(e) => {
              if (disabled) return
              handleChange({
                value: e,
                dataIndex,
                key: record.id,
                uid_lead: record.uid_lead,
              })
            }}
          >
            {taxs.map((tax) => (
              <Select.Option value={tax.id} key={tax.id}>
                {tax.tax_code}
              </Select.Option>
            ))}
          </Select>
        </td>
      )
    }

    if (dataIndex === "discount_id") {
      return (
        <td>
          <Select
            style={{ marginBottom: 17 }}
            placeholder="Select Discount"
            value={record.discount_id}
            disabled={disabled || record.disabled_discount}
            onChange={(e) => {
              if (disabled) return
              handleChange({
                value: e,
                dataIndex,
                key: record.id,
                uid_lead: record.uid_lead,
              })
            }}
          >
            {discounts.map((discount) => (
              <Select.Option value={discount.id} key={discount.id}>
                {discount.title}
              </Select.Option>
            ))}
          </Select>
        </td>
      )
    }

    if (dataIndex === "final_price") {
      return (
        <td>
          <Input
            disabled={true}
            value={record[dataIndex]}
            style={{ marginBottom: 17 }}
            // type={"number"}
            // onChange={(e) =>
            //   onChange({
            //     value: e.target.value,
            //     dataIndex,
            //     key: record.key,
            //     uid_lead: record.uid_lead,
            //   })
            // }
            // onBlur={() => {
            //   if (disabled) return

            //   handleChange({
            //     value: record[dataIndex],
            //     dataIndex,
            //     key: record.id,
            //     uid_lead: record.uid_lead,
            //   })
            // }}
          />
        </td>
      )
    }

    if (dataIndex === "price_nego") {
      return (
        <td>
          <Input
            disabled={disabled || record?.disabled_price_nego}
            value={record[dataIndex]}
            type={"number"}
            onChange={(e) => {
              if (e.target.value > 0) {
                onChange({
                  value: e.target.value,
                  dataIndex,
                  key: record.key,
                  uid_lead: record.uid_lead,
                })
              }
            }}
            onBlur={() => {
              if (disabled) return

              handleChange({
                value: record[dataIndex],
                dataIndex,
                key: record.id,
                uid_lead: record.uid_lead,
              })
            }}
          />
          {inArray(getItem("role"), ["admin", "finance", "superadmin"]) && (
            <span>Margin: {record?.margin_price}</span>
          )}
        </td>
      )
    }

    if (dataIndex === "qty") {
      if (disabled) {
        return (
          <td>
            <div
              className="input-group input-spinner mr-3"
              style={{ marginBottom: 17 }}
            >
              <button
                className="btn btn-light btn-xs border"
                type="button"
                disabled={disabled}
              >
                <i className="fas fa-minus"></i>
              </button>

              <button className="btn btn-light btn-xs border" type="button">
                {record[dataIndex]}
              </button>
              <button
                className="btn btn-light btn-xs border"
                type="button"
                disabled={disabled}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </td>
        )
      }
      return (
        <td>
          <div
            className="input-group input-spinner mr-3"
            style={{ marginBottom: 17 }}
          >
            <button
              className="btn btn-light btn-xs border"
              type="button"
              onClick={() =>
                handleClick({
                  key: record.id,
                  type: "remove-qty",
                  uid_lead: record.uid_lead,
                })
              }
            >
              <i className="fas fa-minus"></i>
            </button>

            <Input
              disabled={disabled}
              value={record[dataIndex]}
              onChange={(e) => {
                if (e.target.value > -1) {
                  return onChange({
                    value: e.target.value,
                    dataIndex,
                    key: record.key,
                    uid_lead: record.uid_lead,
                  })
                }
                return null
              }}
              onBlur={(e) => {
                if (disabled) return

                handleChange({
                  value: record[dataIndex],
                  dataIndex,
                  key: record.id,
                  uid_lead: record.uid_lead,
                })
              }}
              style={{ width: "100px" }}
              controls={false}
            />

            <button
              className="btn btn-light btn-xs border"
              type="button"
              onClick={() =>
                handleClick({
                  key: record.id,
                  type: "add-qty",
                  uid_lead: record.uid_lead,
                })
              }
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </td>
      )
    }

    if (dataIndex === "action") {
      if (disabled) {
        return (
          <td>
            <button
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
              style={{ marginBottom: 17 }}
            >
              <LockOutlined />
            </button>
          </td>
        )
      }
      if (record.key > 0) {
        return (
          <td>
            <button
              onClick={() =>
                handleClick({
                  key: record.id,
                  type: "delete",
                  uid_lead: record.uid_lead,
                })
              }
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
              style={{ marginBottom: 17 }}
            >
              <CloseOutlined />
            </button>
          </td>
        )
      }
      return (
        <td>
          <button
            onClick={() =>
              handleClick({
                key: record.id,
                type: "add",
                uid_lead: record.uid_lead,
              })
            }
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
            style={{ marginBottom: 17 }}
          >
            <PlusOutlined />
          </button>
        </td>
      )
    }

    return (
      <td>
        <Input
          value={record[dataIndex]}
          disabled={disabled}
          style={{ marginBottom: 17 }}
          readOnly
        />
      </td>
    )
  }
  return (
    <td colSpan={6}>
      <span>Tidak Ada Data</span>
    </td>
  )
}

const ModalProductList = ({
  products,
  handleChange,
  value,
  disabled = false,
  style,
}) => {
  const [isModalProductListVisible, setIsModalProductListVisible] =
    useState(false)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [search, setSearch] = useState("")

  const title = products?.find((product) => product?.id === value)?.name
  const filteredProducts =
    products.filter((value) => value.name.toLowerCase().includes(search)) ||
    products

  return (
    <div style={style}>
      <Tooltip title={title}>
        {disabled ? (
          <div className="w-96 flex items-center bg-gray-100 border py-1 px-2 rounded-sm line-clamp-1 cursor-pointer">
            <SearchOutlined className="mr-2" />
            <span>{value ? title : "Select Product"}</span>
          </div>
        ) : (
          <div
            className="w-96 flex items-center border py-1 px-2 rounded-sm line-clamp-1 cursor-pointer"
            onClick={() => setIsModalProductListVisible(true)}
          >
            <SearchOutlined className="mr-2" />
            <span>{value ? title : "Select Product"}</span>
          </div>
        )}
      </Tooltip>
      <Modal
        title="List Product"
        open={isModalProductListVisible}
        cancelText={"Batal"}
        okText={"Pilih"}
        onOk={() => {
          handleChange(selectedProduct)
          setIsModalProductListVisible(false)
        }}
        onCancel={() => setIsModalProductListVisible(false)}
        width={900}
      >
        <div>
          <Input
            placeholder="Cari produk disini.."
            size={"large"}
            className="rounded mb-4"
            suffix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`
                mb-4 shadow-none rounded-md p-2 cursor-pointer bg-white
                ${
                  selectedProduct == product.id
                    ? "border-[1px] border-blue-400 drop-shadow-md ring-blue-500"
                    : "border border-gray-400"
                }
              `}
              onClick={() => {
                setSelectedProduct(product.id)
              }}
              // disabled={product.stock === 0}
            >
              <div className="flex max-w-[800px] justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={product.image_url}
                    alt="product_photo"
                    className="mr-4 w-20 h-20 rounded-md border"
                  />
                  <div>
                    <div className="block text-lg line-clamp-1 font-medium max-w-2xl">
                      {product.name}{" "}
                    </div>
                    <br />
                    <div className="block">
                      Tersedia di :{" "}
                      {product?.sales_channels?.map((value, index) => (
                        <Tag key={index} color="lime">
                          {value}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="block text-red-500">
                  Stock Tersedia: {product.stock_off_market}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default ProductList
