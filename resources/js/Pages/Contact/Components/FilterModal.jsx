import { FilterFilled, FilterOutlined } from "@ant-design/icons"
import { DatePicker, Modal, Input, Select } from "antd"
import React, { useEffect, useState } from "react"

const { RangePicker } = DatePicker

const FilterModal = ({ handleOk }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [roles, setRoles] = useState([])
  const [filter, setFilter] = useState({
    roles: null,
    status: null,
    createdBy: null,
  })

  const showModal = () => {
    loadRole()
    setIsModalOpen(true)
  }

  const loadRole = () => {
    axios.get("/api/master/role").then((res) => {
      setRoles(res.data.data)
    })
  }

  useEffect(() => {
    loadRole()
  }, [])

  const handleCancel = () => {
    setIsModalOpen(false)
    setIsFilter(false)
    setFilter({
      roles: null,
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
      roles: null,
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
        title="Filter Contact"
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
            <label htmlFor="">Role</label>
            <Select
              mode="multiple"
              allowClear
              className="w-full mb-2"
              placeholder="Select Role"
              onChange={(e) => handleChange(e, "roles")}
            >
              {roles.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.role_name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="">Status</label>
            <Select
              mode="multiple"
              allowClear
              className="w-full mb-2"
              placeholder="Select Order Status"
              onChange={(e) => handleChange(e, "status")}
            >
              <Select.Option key={1} value={1}>
                Active
              </Select.Option>
              <Select.Option key={0} value={0}>
                Non Active
              </Select.Option>
              <Select.Option key={2} value={2}>
                Blacklist
              </Select.Option>
            </Select>
          </div>
          
        </div>

        <div className="mb-2">
            <label htmlFor="">Create Date</label>
            <RangePicker
              className="w-full"
              format={"YYYY-MM-DD"}
              onChange={(e, dateString) =>
                handleChange(dateString, "created_at")
              }
            />
        </div>

        <div className="row mb-2">
          <div className="col-md-6">
            <label htmlFor="">Range Deposito</label>
            <Input placeholder="Min" />
          </div>
          <div className="col-md-6">
            <label htmlFor="">&nbsp;</label>
            <Input placeholder="Max" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <label htmlFor="">Range Stock</label>
            <Input placeholder="Min" />
          </div>
          <div className="col-md-6">
            <label htmlFor="">&nbsp;</label>
            <Input placeholder="Max" />
          </div>
        </div>
     
      </Modal>
    </div>
  )
}

export default FilterModal
