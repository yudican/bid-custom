import { CloseOutlined, LockOutlined, PlusOutlined } from "@ant-design/icons"
import { Input, Select, Table } from "antd"
import React from "react"
import ModalProduct from "../../../components/Modal/ModalProduct"
import { productListColumns } from "../config"

const ProductList = ({
  products = [],
  warehouses = [],
  handleChange,
  handleClick,
  data = [],
  loading = false,
  disabled = {},
  cases = [],
  summary,
  columns = productListColumns,
  stock = "final_stock",
}) => {
  const mergedColumns = columns.map((col) => {
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        cases,
        products,
        warehouses,
        disabled,
        columns,
        stock,
        handleChange: (val) => handleChange(val),
        handleClick: (val) => handleClick(val),
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
        rowKey="key"
        scroll={{ x: "max-content" }}
        tableLayout={"auto"}
        summary={summary}
      />
    </div>
  )
}

const EditableCell = (props) => {
  const {
    dataIndex,
    handleChange,
    handleClick,
    record,
    cases,
    products,
    warehouses,
    disabled,
    columns,
    stock,
  } = props
  if (!record) {
    return (
      <td colSpan={7}>
        <span>Tidak Ada Data</span>
      </td>
    )
  }

  if (dataIndex === "case_return") {
    return (
      <td>
        <Select
          disabled={disabled?.case_return}
          placeholder="Select Case Return"
          value={record[dataIndex]}
          className="w-full"
          onChange={(e) => {
            handleChange({
              value: e,
              dataIndex,
              key: record.key,
            })
          }}
        >
          {cases.map((item) => {
            if (item.name) {
              return (
                <Select.Option key={item.id} value={item.name}>
                  {item.name} - {item.type}
                </Select.Option>
              )
            }
          })}
        </Select>
      </td>
    )
  }

  if (dataIndex === "product_id") {
    return (
      <td>
        <ModalProduct
          products={products}
          disabled={disabled?.product_id}
          stock={stock}
          handleChange={(e) =>
            handleChange({
              value: e,
              dataIndex,
              key: record.key,
              product_id: e,
              type: "change-product",
            })
          }
          value={record?.product_id}
        />
      </td>
    )
  }

  if (dataIndex === "from_warehouse_id") {
    return (
      <td>
        <Select
          disabled={disabled?.from_warehouse_id}
          placeholder="Select Warehouse"
          value={record[dataIndex]}
          className="w-full"
          onChange={(e) => {
            handleChange({
              value: e,
              dataIndex,
              key: record.key,
            })
          }}
        >
          {record[dataIndex] && (
            <Select.Option value={null}>
              <span className="flex items-center justify-between">
                <span>Reset</span>
                <CloseOutlined />
              </span>
            </Select.Option>
          )}

          {warehouses.map((warehouse) => (
            <Select.Option value={warehouse.id} key={warehouse.id}>
              {warehouse.name}
            </Select.Option>
          ))}
        </Select>
      </td>
    )
  }

  if (dataIndex === "to_warehouse_id") {
    return (
      <td>
        <Select
          disabled={disabled?.to_warehouse_id}
          placeholder="Select Warehouse"
          value={record[dataIndex]}
          className="w-full"
          onChange={(e) => {
            handleChange({
              value: e,
              dataIndex,
              key: record.key,
            })
          }}
        >
          {record[dataIndex] && (
            <Select.Option value={null}>
              <span className="flex items-center justify-between">
                <span>Reset</span>
                <CloseOutlined />
              </span>
            </Select.Option>
          )}
          {warehouses.map((warehouse) => (
            <Select.Option value={warehouse.id} key={warehouse.id}>
              {warehouse.name}
            </Select.Option>
          ))}
        </Select>
      </td>
    )
  }

  if (dataIndex === "qty_alocation") {
    if (disabled?.qty_alocation) {
      return (
        <td>
          <div
            className="input-group input-spinner mr-3"
            style={{ marginBottom: 17 }}
          >
            <button
              className="btn btn-light btn-xs border"
              type="button"
              disabled
            >
              <i className="fas fa-minus"></i>
            </button>

            <Input
              disabled
              value={record[dataIndex] || 0}
              style={{ width: "100px" }}
              controls={false}
            />

            <button
              className="btn btn-light btn-xs border"
              type="button"
              disabled
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
                key: record.key,
                type: "remove-qty",
              })
            }
          >
            <i className="fas fa-minus"></i>
          </button>

          <Input
            // disabled={disabled?.qty}
            value={parseInt(record[dataIndex]) || 0}
            onChange={(e) => {
              const { value } = e.target
              if (value == "") {
                return handleChange({
                  value: 0,
                  dataIndex,
                  key: record.key,
                })
              }

              if (value > record.qty) {
                return handleChange({
                  value: record.qty,
                  dataIndex,
                  key: record.key,
                })
              }

              return handleChange({
                value,
                dataIndex,
                key: record.key,
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
                key: record.key,
                type: "add-qty",
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
    if (disabled?.action) {
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
                key: record.key,
                type: "delete",
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
              key: record.key,
              type: "add",
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

  if (dataIndex === "notes") {
    if (!disabled?.notes) {
      return (
        <td>
          <Input
            value={record[dataIndex]}
            onChange={(e) => {
              handleChange({
                value: e.target.value,
                dataIndex,
                key: record.key,
              })
            }}
            style={{ width: "100%" }}
          />
        </td>
      )
    }
  }

  return (
    <td>
      <span>{record[dataIndex]}</span>
    </td>
  )
}

export default ProductList
