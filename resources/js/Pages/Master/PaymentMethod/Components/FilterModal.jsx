import { FilterFilled, FilterOutlined } from "@ant-design/icons"
import { Modal, Select } from "antd"
import React, { useState } from "react"

const filterdata = {
  status: null,
  payment_channel: null,
  payment_type: null,
}
const FilterModal = ({ handleOk }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [filter, setFilter] = useState(filterdata)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setIsFilter(false)
    setFilter(filterdata)
  }

  const handleChange = (value, field) => {
    setFilter((filters) => ({ ...filters, [field]: value }))
  }

  const clearFilter = () => {
    setIsModalOpen(false)
    setIsFilter(false)
    setFilter(filterdata)
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
        title="Filter Payment Method"
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
            <label htmlFor="">Payment Type</label>
            <Select
              allowClear
              className="w-full mb-2"
              placeholder="Select Payment Type"
              onChange={(e) => handleChange(e, "payment_type")}
            >
              <Select.Option key={1} value={"Otomatis"}>
                Otomatis
              </Select.Option>
              <Select.Option key={0} value={"Manual"}>
                Manual
              </Select.Option>
            </Select>
          </div>
          <div>
            <label htmlFor="">Payment Channel</label>
            <Select
              allowClear
              className="w-full mb-2"
              placeholder="Select Payment Type"
              onChange={(e) => handleChange(e, "payment_channel")}
            >
              <Select.Option value="">Select Payment Type</Select.Option>
              <Select.Option value="bank_transfer">Bank transfer</Select.Option>
              <Select.Option value="echannel">echannel</Select.Option>
              <Select.Option value="bca_klikpay">Bca klikpay</Select.Option>
              <Select.Option value="bca_klikbca">Bca klikbca</Select.Option>
              <Select.Option value="bri_epay">bri_epay</Select.Option>
              <Select.Option value="gopay">gopay</Select.Option>
              <Select.Option value="shopeepay">shopeepay</Select.Option>
              <Select.Option value="qris">Qris</Select.Option>
              <Select.Option value="mandiri_clickpay">
                Mandiri Clickpay
              </Select.Option>
              <Select.Option value="cimb_clicks">Cimb Clicks</Select.Option>
              <Select.Option value="danamon_online">
                Danamon online
              </Select.Option>
              <Select.Option value="cstore">cstore</Select.Option>
              <Select.Option value="cod_jne">cod jne</Select.Option>
              <Select.Option value="cod_jxe">cod jxe</Select.Option>
            </Select>
          </div>
          <div>
            <label htmlFor="">Status</label>
            <Select
              mode="multiple"
              allowClear
              className="w-full mb-2"
              placeholder="Select Status"
              onChange={(e) => handleChange(e, "status")}
            >
              <Select.Option key={1} value={1}>
                Active
              </Select.Option>
              <Select.Option key={0} value={0}>
                Non Active
              </Select.Option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default FilterModal
