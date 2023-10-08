import { FilterFilled, FilterOutlined } from "@ant-design/icons"
import { Modal, Select } from "antd"
import { Option } from "antd/lib/mentions"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { inArray } from "../../../helpers"
// import { searchUserCreated } from "../service";

const FilterModalProduct = ({ handleOk, type = "stock" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [warehouses, setWarehouses] = useState([])
  const [filter, setFilter] = useState({
    warehouse_id: null,
    status: null,
    createdBy: null,
  })

  const showModal = () => {
    setIsModalOpen(true)
  }

  const loadWarehouse = () => {
    axios.get("/api/master/warehouse").then((res) => {
      setWarehouses(res.data.data)
    })
  }

  useEffect(() => {
    loadWarehouse()
  }, [])

  const handleCancel = () => {
    setIsModalOpen(false)
    setIsFilter(false)
    setFilter({
      warehouse_id: null,
      status: null,
      createdBy: null,
    })
  }

  const handleChange = (value, field) => {
    if (field === "createdBy") {
      return setFilter({ ...filter, createdBy: value.value })
    }
    setFilter({ ...filter, [field]: value })
  }

  const clearFilter = () => {
    setIsModalOpen(false)
    setIsFilter(false)
    setFilter({
      warehouse_id: null,
      status: null,
      createdBy: null,
    })
    handleOk({})
  }

  return (
    <div>
      {isFilter ? (
        <button
          onClick={() => showModal()}
          className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
        >
          <FilterOutlined />
          <span className="ml-2">Show Filter</span>
        </button>
      ) : (
        <button
          onClick={() => showModal()}
          className="
          bg-white border 
          text-blue-700 hover:text-blue-700/90
          delay-100 ease-in-out
          focus:ring-4 focus:outline-none focus:ring-blue-300 
          font-medium rounded-lg 
          text-sm px-4 py-2 text-center inline-flex items-center
        "
        >
          <FilterFilled />
          <span className="ml-2">Filter</span>
        </button>
      )}

      <Modal
        title="Filter"
        open={isModalOpen}
        onOk={() => {
          handleOk(filter)
          setIsFilter(true)
          setIsModalOpen(false)
        }}
        cancelText={isFilter ? "Clear Filter" : "Cancel"}
        onCancel={isFilter ? clearFilter : handleCancel}
        okText={"Apply Filter"}
      >
        <div>
          <div>
            <label htmlFor="">Warehouse</label>
            <Select
              allowClear
              className="w-full mb-2"
              placeholder="Select Warehouse"
              onChange={(e) => handleChange(e, "warehouse_id")}
            >
              {warehouses.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          {inArray(type, ["received"]) && (
            <div>
              <label htmlFor="">Status</label>
              <Select
                mode="multiple"
                allowClear
                className="w-full mb-2"
                placeholder="Select Status"
                onChange={(e) => handleChange(e, "status")}
              >
                <Select.Option key={"received"} value={"received"}>
                  Received
                </Select.Option>
                <Select.Option key={"alocated"} value={"alocated"}>
                  Alocated
                </Select.Option>
                <Select.Option key={"canceled"} value={"canceled"}>
                  Canceled
                </Select.Option>
              </Select>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default FilterModalProduct
