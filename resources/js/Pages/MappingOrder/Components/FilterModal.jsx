import { FilterFilled, FilterOutlined } from "@ant-design/icons"
import { DatePicker, Modal, Select } from "antd"
import React, { useEffect, useState } from "react"

const { RangePicker } = DatePicker

const FilterModal = ({ handleOk }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [filter, setFilter] = useState({
    status: null,
    warehouse_id: null,
  })

  const [warehouseTiktok, setWarehouseTiktok] = useState([])

  const loadWarehouseTiktok = () => {
    axios.get("/api/master/warehousetiktok").then((res) => {
      const { data } = res.data
      setWarehouseTiktok(data)
    })
  }

  useEffect(() => {
    loadWarehouseTiktok()
  }, [])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setIsFilter(false)
    setFilter({
      status: null,
      warehouse_id: null,
    })
  }

  const handleChange = (value, field) => {
    setFilter((filters) => ({ ...filters, [field]: value }))
  }

  const clearFilter = () => {
    setIsModalOpen(false)
    setIsFilter(false)
    setFilter({
      status: null,
      warehouse_id: null,
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
        title="Filter Mapping Order"
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
              mode="multiple"
              allowClear
              className="w-full mb-2"
              placeholder="Select Warehouse"
              onChange={(e) => handleChange(e, "warehouse_id")}
            >
              {warehouseTiktok.map((item) => (
                <Select.Option
                  key={item.tiktok_warehouse_id}
                  value={item.tiktok_warehouse_id}
                >
                  {item.warehouse_name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="w-full mb-2">
            <label htmlFor="">Range Date</label>
            <RangePicker
              className="w-full"
              format={"YYYY-MM-DD"}
              onChange={(e, dateString) =>
                handleChange(dateString, "tanggal_transaksi")
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default FilterModal
