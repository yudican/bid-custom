import { EditOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { Form, Input, Modal, Upload } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { getBase64 } from "../../../../helpers"

const FormLogisticRates = ({
  refetch,
  record = {},
  update = false,
  logisticId,
}) => {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const onFinish = (values) => {
    setConfirmLoading(true)
    const url = update ? `save/${record.id}` : "save"
    axios
      .post(`/api/master/shipping-method/offline/logistic/rates/${url}`, {
        ...values,
        logistic_id: logisticId,
      })
      .then((res) => {
        setConfirmLoading(false)
        form.resetFields()
        setOpen(false)
        toast.success("Data Berhasil Di simpan")
        refetch()
      })
      .catch((err) => {
        setConfirmLoading(false)
        toast.error("Data gagal Di simpan")
      })
  }

  useEffect(() => {
    if (update) {
      form.setFieldsValue(record)
    }
  }, [update])

  return (
    <div>
      {
        // Button Tambah Data
        update ? (
          <button
            onClick={() => {
              setOpen(true)
            }}
            className="text-white bg-[#008BE1] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
          >
            <EditOutlined />
          </button>
        ) : (
          <button
            onClick={() => {
              setOpen(true)
            }}
            className="text-white bg-[#008BE1] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
          >
            <PlusOutlined />
            <span className="ml-2">Tambah Data</span>
          </button>
        )
      }

      <Modal
        title="Form Logistic"
        open={open}
        onOk={() => {
          form.submit()
        }}
        cancelText={"Cancel"}
        onCancel={() => setOpen(false)}
        okText={"Save"}
        confirmLoading={confirmLoading}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Service Name"
            name="logistic_rate_name"
            rules={[
              {
                required: true,
                message: "Please input your Service Name!",
              },
            ]}
          >
            <Input placeholder="Ketik Service Name" />
          </Form.Item>

          <Form.Item
            label="Service Code"
            name="logistic_rate_code"
            rules={[
              {
                required: true,
                message: "Please input your Service Code!",
              },
            ]}
          >
            <Input placeholder="Ketik Service Code" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FormLogisticRates
