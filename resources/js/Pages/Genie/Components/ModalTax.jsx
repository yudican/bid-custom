import { Form, Input, Modal } from "antd"
import React, { useState } from "react"
const ModalTax = ({ handleSubmit }) => {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
    form.setFieldsValue({
      vat_value: 0,
      tax_value: 0,
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  return (
    <div>
      <button
        className="text-white bg-orangeButton hover:bg-orangeButton/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-4"
        onClick={showModal}
      >
        <span className="">Submit to GP</span>
      </button>

      <Modal
        title="Input VAT"
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false)
          form.submit()
        }}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <div>
            {/* <Form.Item
              label="Tax Name"
              name="tax_name"
              rules={[
                {
                  required: true,
                  message: "Please input Tax Name!",
                },
              ]}
            >
              <Input placeholder="PPN" />
            </Form.Item> */}
            <Form.Item
              label="Tax Value (%)"
              name="tax_value"
              rules={[
                {
                  required: true,
                  message: "Please input Tax Value!",
                },
              ]}
            >
              <Input placeholder="10" />
            </Form.Item>
            <Form.Item
              label="VAT Value (%)"
              name="vat_value"
              rules={[
                {
                  required: true,
                  message: "Please input VAT Value!",
                },
              ]}
            >
              <Input placeholder="1.11" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default ModalTax
