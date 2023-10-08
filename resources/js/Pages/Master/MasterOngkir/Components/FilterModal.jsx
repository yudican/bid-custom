import { FilterFilled, FilterOutlined } from "@ant-design/icons"
import { Modal, Select } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
const FilterModal = ({ handleOk }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [logistic, setLogistic] = useState([])
  const [filter, setFilter] = useState({
    status_ongkir: null,
    logistic_id: [],
  })

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setIsFilter(false)
    setFilter({
      status_ongkir: null,
      logistic_id: [],
    })
  }

  const handleChange = (value, field) => {
    setFilter((filters) => ({ ...filters, [field]: value }))
  }

  const clearFilter = () => {
    setIsModalOpen(false)
    setIsFilter(false)
    setFilter({
      status_ongkir: null,
      logistic_id: [],
    })
    handleOk({})
  }

  const loadLogistic = () => {
    axios.get(`/api/master/logistic`).then((res) => {
      const { data } = res.data
      const newData = data.filter((item) => item.logistic_type === "online")
      setLogistic(newData)
    })
  }

  useEffect(() => {
    loadLogistic()
  }, [])

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
        title="Filter Variant"
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
            <label htmlFor="">Status</label>
            <Select
              mode="multiple"
              allowClear
              className="w-full mb-2"
              placeholder="Select Status"
              onChange={(e) => handleChange(e, "status_ongkir")}
            >
              <Select.Option key={1} value={1}>
                Active
              </Select.Option>
              <Select.Option key={0} value={0}>
                Non Active
              </Select.Option>
            </Select>
          </div>
          <div>
            <label htmlFor="">Logistic</label>
            <Select
              mode="multiple"
              allowClear
              className="w-full mb-2"
              placeholder="Select Logistic"
              onChange={(e) => {
                console.log(e)
                handleChange(e, "logistic_id")
              }}
            >
              {logistic.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {/* image */}
                  <div className="flex items-center">
                    <img
                      src={item.logistic_url_logo}
                      alt=""
                      style={{ width: 40 }}
                    />
                    <span className="ml-2">{item.logistic_name}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default FilterModal
