import { SyncOutlined } from "@ant-design/icons"
import { DatePicker, Modal } from "antd"
import React, { useState } from "react"

const { RangePicker } = DatePicker

const SyncModal = ({ handleOk }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [filter, setFilter] = useState({
    tanggal_transaksi: null,
  })

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setIsFilter(false)
    setFilter({
      tanggal_transaksi: null,
    })
  }

  const handleChange = (value, field) => {
    setFilter((filters) => ({ ...filters, [field]: value }))
  }

  const clearFilter = () => {
    setIsModalOpen(false)
    setIsFilter(false)
    setFilter({
      tanggal_transaksi: null,
    })
    handleOk({})
  }

  return (
    <div>
      <button
        onClick={() => showModal()}
        className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
      >
        <span>Sinkronisasi Data</span>
      </button>

      <Modal
        title="Sync Data"
        open={isModalOpen}
        onOk={() => {
          handleOk(filter)
          setIsFilter(true)
          setIsModalOpen(false)
        }}
        cancelText={"Cancel"}
        onCancel={() => handleCancel()}
        okText={"sync Order"}
      >
        <div>
          <div className="w-full mb-2">
            <label htmlFor="">Pilih Tanggal</label>
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

export default SyncModal
