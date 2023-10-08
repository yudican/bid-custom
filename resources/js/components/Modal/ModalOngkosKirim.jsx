import { EditOutlined } from "@ant-design/icons"
import { Form, Input, message, Modal } from "antd"
import React, { useState } from "react"

const ModalOngkosKirim = ({
  url,
  refetch,
  initialValues = {},
  disabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const onFinish = (values) => {
    setLoading(true)
    axios
      .post(url, values)
      .then((res) => {
        setLoading(false)
        setIsModalOpen(false)
        message.success("Ongkos kirim Berhasil Diupdate")
        refetch()
      })
      .catch((err) => {
        setLoading(false)
        message.error("Ongkos kirim Gagal Diupdate")
      })
  }

  const deleteOngkir = () => {
    setLoading(true)
    axios
      .post(url, { ongkir: 0 })
      .then((res) => {
        setLoading(false)
        setIsModalOpen(false)
        message.success("Ongkos kirim Berhasil Diupdate")
        refetch()
      })
      .catch((err) => {
        setLoading(false)
        message.error("Ongkos kirim Gagal Diupdate")
      })
  }

  if (disabled) {
    return <strong>Ongkir</strong>
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <strong>Ongkir</strong>
        <EditOutlined onClick={() => showModal()} />
      </div>

      <Modal
        title="Update Ongkir"
        open={isModalOpen}
        onOk={() => {
          form.submit()
        }}
        cancelText={"Hapus Ongkir"}
        onCancel={() => deleteOngkir()}
        okText={"Update Ongkir"}
        confirmLoading={loading}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            ...initialValues,
          }}
        >
          <Form.Item
            label="Ongkir"
            name="ongkir"
            rules={[
              {
                required: false,
                message: "Please input Ekspedisi!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ModalOngkosKirim
